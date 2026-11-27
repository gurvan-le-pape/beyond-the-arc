#!/usr/bin/env bash
# Restores the latest database backup into a throwaway PostgreSQL on this machine and
# compares it with production: infra/ansible/restore-test.sh [daily|weekly]
#
# A backup that has never been restored is not a backup. Run it after any change to
# the backup job, and monthly.
#
# Reads an R2 token with Object Read on bta-db-backups from
# ~/.config/bta-ansible/r2-backups-read.env (RCLONE_CONFIG_R2_* variables, see
# README.md), and decrypts with the age key in ~/.config/sops/age/keys.txt. The backup
# is streamed from R2 through age into pg_restore: the decrypted dump never touches the
# disk. Production is read over SSH (bta-prod-compose, as root), never written.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
prefix="${1:-daily}"
bucket=bta-db-backups
container=bta-restore-test
image=$(sed -n 's/^ *image: \(postgres:.*\)$/\1/p' "$here/../../docker/docker-compose.yml" | head -1)
env_file="$HOME/.config/bta-ansible/r2-backups-read.env"
[ -f "$env_file" ] || { echo "restore-test.sh: missing $env_file" >&2; exit 2; }
set -a
# shellcheck disable=SC1090
. "$env_file"
set +a

tools() { "$here/ansible.sh" "$@" < /dev/null; }

counts=$(< "$here/backup-counts.sql")

latest=$(tools rclone lsf --files-only "r2:$bucket/$prefix/" | sort | tail -1)
[ -n "$latest" ] || { echo "restore-test.sh: no backup under $prefix/" >&2; exit 1; }
echo "== $prefix/$latest ($image)"

trap 'docker rm -fv "$container" > /dev/null 2>&1 || true' EXIT
docker rm -fv "$container" > /dev/null 2>&1 || true
docker run -d --name "$container" -e POSTGRES_PASSWORD=restore-test -e POSTGRES_DB=btadb \
  "$image" > /dev/null
until docker exec "$container" pg_isready -q -U postgres -d btadb; do sleep 1; done
# The image's entrypoint restarts the server once initialisation is done.
sleep 3
until docker exec "$container" pg_isready -q -U postgres -d btadb; do sleep 1; done

start=$(date +%s)
tools sh -c "rclone cat 'r2:$bucket/$prefix/$latest' | age -d -i \"\$SOPS_AGE_KEY_FILE\"" |
  docker exec -i "$container" pg_restore -U postgres -d btadb --no-owner --no-privileges \
    --exit-on-error
echo "== restored in $(($(date +%s) - start)) s"

echo "== backup"
docker exec "$container" psql -U postgres -d btadb -x -c "$counts"
echo "== production now (it has kept running since the dump)"
ssh -o BatchMode=yes -l root bta-prod-compose \
  'docker exec -i docker-database-1 sh -c "psql -U \$POSTGRES_USER -d \$POSTGRES_DB -x"' \
  <<< "$counts"
