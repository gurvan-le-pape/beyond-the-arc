#!/usr/bin/env bash
# Managed by Ansible (infra/ansible/roles/postgres_backup). Run by bta-db-backup.service.
#
# Dumps the whole database (pg_dump -Fc, zstd), encrypts the dump to the maintainer's
# age public key, and uploads it to R2 under daily/; on BACKUP_WEEKLY_ISODAY it is also
# copied under weekly/. Retention and deletion are the bucket's lifecycle and lock rules,
# not this script's. The dump goes to a file before the upload so that a pg_dump that
# fails half-way is never uploaded as if it were complete.
#
# On success it writes the node-exporter metrics the Grafana rule "Database Backup
# Missing" reads; on failure it writes nothing, and that rule fires after 26 hours.
set -euo pipefail

: "${BACKUP_CONTAINER:?}" "${BACKUP_AGE_RECIPIENT:?}" "${BACKUP_BUCKET:?}"
: "${BACKUP_WEEKLY_ISODAY:?}" "${BACKUP_TEXTFILE_DIR:?}"

start=$(date +%s)
name="btadb-$(date -u +%Y-%m-%dT%H%M%SZ).dump.age"
work=$(mktemp -d /var/tmp/bta-db-backup.XXXXXX)
trap 'rm -rf "$work"' EXIT

echo "dumping $BACKUP_CONTAINER to $name"
docker exec "$BACKUP_CONTAINER" sh -c \
  'nice -n 10 pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc -Z zstd:3' |
  age -r "$BACKUP_AGE_RECIPIENT" -o "$work/$name"
size=$(stat -c %s "$work/$name")
echo "dump done: $size bytes in $(($(date +%s) - start)) s"

rclone copyto --retries 3 "$work/$name" "r2:$BACKUP_BUCKET/daily/$name"
echo "uploaded daily/$name"
if [ "$(date -u +%u)" = "$BACKUP_WEEKLY_ISODAY" ]; then
  rclone copyto --retries 3 "r2:$BACKUP_BUCKET/daily/$name" "r2:$BACKUP_BUCKET/weekly/$name"
  echo "copied to weekly/$name"
fi

end=$(date +%s)
metrics="$BACKUP_TEXTFILE_DIR/bta_db_backup.prom"
cat > "$metrics.tmp" << EOF
# HELP bta_db_backup_last_success_timestamp_seconds When the last backup reached R2.
# TYPE bta_db_backup_last_success_timestamp_seconds gauge
bta_db_backup_last_success_timestamp_seconds $end
# HELP bta_db_backup_last_size_bytes Size of the last encrypted backup.
# TYPE bta_db_backup_last_size_bytes gauge
bta_db_backup_last_size_bytes $size
# HELP bta_db_backup_last_duration_seconds Dump, encryption and upload of the last backup.
# TYPE bta_db_backup_last_duration_seconds gauge
bta_db_backup_last_duration_seconds $((end - start))
EOF
mv "$metrics.tmp" "$metrics"
echo "backup done in $((end - start)) s"
