#!/usr/bin/env bash
# Proves production's CloudNativePG backups restore: infra/k8s/restore-test-cnpg.sh [--keep]
#
# Against bta-prod-k3s (it sets BTA_CLUSTER=production for k.sh; the tunnel must be up).
# It counts the live database (../ansible/backup-counts.sql), marks that moment with a
# named restore point, and has PostgreSQL switch to a new WAL file so the one holding the
# mark is archived. It then bootstraps a second Cluster, restore-test, from the R2 object
# store (database/production/object-store.yaml): the latest base backup, and the WAL
# replayed up to that restore point, no further. The same figures from the copy must equal
# the live ones. The copy is deleted at the end, unless --keep.
#
# What it proves: a base backup and the WAL after it are in R2 and readable with the
# cluster's own token, and point-in-time recovery reaches a chosen moment.
# With --keep, the copy's timeline history says where recovery stopped
# (pg_wal/00000002.history):
#   1  3/E60000C8  at restore point "restore-test-20261128T122234Z"
# The figures match only if nothing wrote between the count and the mark: run it when the scheduler is
# idle (matches are played on weekend afternoons, Paris time), and a mismatch says so.
#
# The copy is a second PostgreSQL on the same node: it needs the database's size in disk
# space (about 9 GB uncompressed, 2026-11-28) for a few minutes. It does not archive: a
# restored Cluster archives only if it names the plugin in spec.plugins, and this one does
# not, so it cannot write into production's backups.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
keep=false
[ "${1:-}" = --keep ] && keep=true
export BTA_CLUSTER=production
kube() { "$here/k.sh" "$@"; }
live_psql() { kube kubectl -n bta exec -i "$1" -c postgres -- psql -v ON_ERROR_STOP=1 "${@:2}"; }

name=restore-test
point="restore-test-$(date -u +%Y%m%dT%H%M%SZ)"

kube kubectl -n bta get cluster "$name" -o name < /dev/null 2>/dev/null &&
  { echo "restore-test-cnpg.sh: a $name Cluster already exists; delete it first" >&2; exit 1; }

pod=$(kube kubectl -n bta get pods -l cnpg.io/cluster=database,cnpg.io/instanceRole=primary \
  -o jsonpath='{.items[0].metadata.name}' < /dev/null)
[ -n "$pod" ] || { echo "restore-test-cnpg.sh: no primary pod for the database Cluster" >&2; exit 1; }
image=$(kube kubectl -n bta get cluster database -o jsonpath='{.spec.imageName}' < /dev/null)
# A recovery target from a plugin's object store names the base backup to start from: the
# latest one completed. The restore point comes after it, so its WAL follows.
backup_id=$(kube kubectl -n bta get backups -o json < /dev/null | python3 -c '
import json, sys
done = [b["status"] for b in json.load(sys.stdin)["items"]
        if b["spec"]["cluster"]["name"] == "database" and b.get("status", {}).get("phase") == "completed"]
print(max(done, key=lambda s: s["stoppedAt"])["backupId"] if done else "")')
[ -n "$backup_id" ] || { echo "restore-test-cnpg.sh: no completed backup of the database Cluster" >&2; exit 1; }

echo "== live, $pod; base backup $backup_id"
live=$(live_psql "$pod" -d btadb -AtF' ' < "$here/../ansible/backup-counts.sql")
echo "$live"
# The mark, then a new WAL file, so the file holding the mark is complete and archived.
# pg_switch_wal() returns the end of the file it completed, a file boundary, where
# pg_walfile_name() names that completed file: the one holding the mark. Not the current
# position less one, which by then may already be in the next file, archived only at
# archive_timeout (5 minutes).
mark_wal=$(live_psql "$pod" -U postgres -d postgres -Atq < /dev/null \
  -c "select pg_create_restore_point('$point')" \
  -c "select pg_walfile_name(pg_switch_wal())" | tail -n 1)
echo "restore point $point, in $mark_wal"

# Archived once pg_stat_archiver's last WAL is the one holding the mark, or a later one.
for _ in $(seq 1 60); do
  archived=$(live_psql "$pod" -U postgres -d postgres -Atc \
    "select coalesce(last_archived_wal, '') from pg_stat_archiver" < /dev/null)
  [[ "$archived" > "$mark_wal" || "$archived" == "$mark_wal" ]] && break
  sleep 5
done
[[ "$archived" > "$mark_wal" || "$archived" == "$mark_wal" ]] ||
  { echo "restore-test-cnpg.sh: $mark_wal not archived after 5 minutes" >&2; exit 1; }

cleanup() {
  $keep && { echo "kept: kubectl -n bta delete cluster $name"; return; }
  kube kubectl -n bta delete cluster "$name" --wait=true < /dev/null > /dev/null 2>&1 || true
}
trap cleanup EXIT

kube kubectl apply -f - <<EOF
apiVersion: postgresql.cnpg.io/v1
kind: Cluster
metadata:
  name: $name
  namespace: bta
spec:
  instances: 1
  imageName: $image
  storage:
    size: 20Gi
    storageClass: local-path
  bootstrap:
    recovery:
      source: origin
      recoveryTarget:
        backupID: $backup_id
        targetName: $point
  externalClusters:
    - name: origin
      plugin:
        name: barman-cloud.cloudnative-pg.io
        parameters:
          barmanObjectName: r2
          serverName: database
EOF

started=$(date +%s)
for _ in $(seq 1 120); do
  ready=$(kube kubectl -n bta get cluster "$name" -o jsonpath='{.status.readyInstances}' < /dev/null)
  [ "$ready" = 1 ] && break
  sleep 10
done
[ "$ready" = 1 ] || { echo "restore-test-cnpg.sh: $name not ready after 20 minutes" >&2; exit 1; }
echo "== restored in $(( $(date +%s) - started )) s, $name-1"

copy=$(live_psql "$name-1" -U postgres -d btadb -AtF' ' < "$here/../ansible/backup-counts.sql")
echo "$copy"
if [ "$copy" = "$live" ]; then
  echo "restore-test-cnpg.sh: the restored copy matches production at $point"
else
  echo "restore-test-cnpg.sh: MISMATCH between production and the copy at $point" >&2
  exit 1
fi
