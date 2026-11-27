#!/usr/bin/env bash
# Restores the latest production backup into the lab's database: infra/k8s/restore.sh [daily|weekly]
#
# Runs on the maintainer's machine, not in the cluster: the backup is encrypted to the
# maintainer's age key, and that key stays on this machine. The dump is streamed from R2
# through age (in the ansible.sh image, with the read token and the key restore-test.sh
# uses) into pg_restore inside the database pod (through k.sh), so the decrypted dump never
# touches a disk and the cluster holds no credential for the bucket.
#
# The database must be empty: on a database that already holds the schema, it stops.
# To restore again, delete the Cluster and let Argo CD recreate it:
#   infra/k8s/k.sh kubectl -n bta delete cluster database
# The old pod can stay Terminating for up to its 30-minute grace period: its instance
# manager loses access to the API with the Cluster, so it never reports PostgreSQL
# stopped, and the new Cluster waits for its name. Its data is the data being replaced,
# so force-deleting it is safe:
#   infra/k8s/k.sh kubectl -n bta delete pod database-1 --grace-period=0 --force
#
# The restore runs as the database's owner, bta, so that bta owns every object, as the
# application's role will need. It ends with ANALYZE and the figures of
# ../ansible/backup-counts.sql, to compare with restore-test.sh's restore of the same dump.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
prefix="${1:-daily}"
bucket=bta-db-backups
env_file="$HOME/.config/bta-ansible/r2-backups-read.env"
[ -f "$env_file" ] || { echo "restore.sh: missing $env_file" >&2; exit 2; }
set -a
# shellcheck disable=SC1090
. "$env_file"
set +a

backup() { "$here/../ansible/ansible.sh" "$@"; }
kube() { "$here/k.sh" "$@"; }

pod=$(kube kubectl -n bta get pods -l cnpg.io/cluster=database,cnpg.io/instanceRole=primary \
  -o jsonpath='{.items[0].metadata.name}' < /dev/null)
[ -n "$pod" ] || { echo "restore.sh: no primary pod for the database Cluster" >&2; exit 1; }
psql() { kube kubectl -n bta exec -i "$pod" -c postgres -- psql -v ON_ERROR_STOP=1 -d btadb "$@"; }

tables=$(psql -Atc "select count(*) from pg_tables where schemaname = 'public'" < /dev/null)
[ "$tables" = 0 ] || {
  echo "restore.sh: btadb already has $tables tables; delete the Cluster to restore again" >&2
  exit 1
}

latest=$(backup rclone lsf --files-only "r2:$bucket/$prefix/" < /dev/null | sort | tail -1)
[ -n "$latest" ] || { echo "restore.sh: no backup under $prefix/" >&2; exit 1; }
echo "== $prefix/$latest into $pod"

start=$(date +%s)
backup sh -c "rclone cat 'r2:$bucket/$prefix/$latest' | age -d -i \"\$SOPS_AGE_KEY_FILE\"" < /dev/null |
  kube kubectl -n bta exec -i "$pod" -c postgres -- pg_restore -d btadb --role=bta \
    --no-owner --no-privileges --exit-on-error
echo "== restored in $(($(date +%s) - start)) s"

start=$(date +%s)
psql -qc 'analyze' < /dev/null
echo "== analyzed in $(($(date +%s) - start)) s"
psql -x < "$here/../ansible/backup-counts.sql"
