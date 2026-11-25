#!/usr/bin/env bash
# Starts the production images against a migrated PostgreSQL and checks that they
# answer. Lint, tests and the application builds run with dev dependencies and never
# start anything, so they miss a crash at startup and a package or a file an image does
# not ship. Run from the repo root:
#
#   scripts/ci/boot-check.sh [<image-prefix> <tag>]
#
# With arguments it checks <image-prefix>/{backend,backend-migrate,scheduler,frontend}:<tag>,
# which must exist. Without, it builds them first and removes them afterwards.
set -euo pipefail

prefix="${1:-boot-check}"
tag="${2:-local}"
id="${BOOT_CHECK_ID:-local}"
network="boot-check-$id"
database="boot-check-db-$id"
app="boot-check-app-$id"
web="boot-check-web-$id"
database_url="postgres://postgres:boot@$database:5432/boot"
timeout_seconds=60

cleanup() {
  docker rm -fv "$web" "$app" "$database" > /dev/null 2>&1 || true
  docker network rm "$network" > /dev/null 2>&1 || true
}
trap cleanup EXIT
cleanup

fail() {
  echo "boot check failed: $1" >&2
  docker logs --tail 80 "$2" >&2 || true
  exit 1
}

# wait_for <container> <url>: the container must stay up and answer 2xx.
wait_for() {
  local elapsed=0
  until docker exec "$1" wget -q -O /dev/null "$2" 2> /dev/null; do
    if [ "$(docker inspect -f '{{.State.Running}}' "$1")" != "true" ]; then
      fail "the container exited during startup" "$1"
    fi
    elapsed=$((elapsed + 1))
    if [ "$elapsed" -ge "$timeout_seconds" ]; then
      fail "no 2xx from $2 after ${timeout_seconds}s" "$1"
    fi
    sleep 1
  done
  echo "$2 answered after ${elapsed}s"
}

if [ $# -eq 0 ]; then
  docker build -q -f docker/backend/Dockerfile --target prod -t "$prefix/backend:$tag" .
  docker build -q -f docker/backend/Dockerfile --target migrate -t "$prefix/backend-migrate:$tag" .
  docker build -q -f docker/python-script/Dockerfile -t "$prefix/scheduler:$tag" .
  docker build -q -f docker/frontend/Dockerfile --target prod -t "$prefix/frontend:$tag" .
  trap 'cleanup; docker image rm "$prefix"/{backend,backend-migrate,scheduler,frontend}:"$tag" > /dev/null 2>&1 || true' EXIT
fi

docker network create "$network" > /dev/null
docker run -d --name "$database" --network "$network" \
  -e POSTGRES_PASSWORD=boot -e POSTGRES_DB=boot postgres:18.4 > /dev/null

# Over TCP: during initialisation the server listens on its Unix socket only.
elapsed=0
until docker exec "$database" pg_isready -q -h 127.0.0.1 -U postgres -d boot; do
  elapsed=$((elapsed + 1))
  if [ "$elapsed" -ge "$timeout_seconds" ]; then
    fail "database not ready" "$database"
  fi
  sleep 1
done

docker run --rm --network "$network" -e DATABASE_URL="$database_url" "$prefix/backend-migrate:$tag"

# Imports every module and dependency; running it would set up a whole season.
docker run --rm --network "$network" -e DATABASE_URL="$database_url" "$prefix/scheduler:$tag" \
  python -c "import run_scheduler"

docker run -d --name "$app" --network "$network" \
  -e NODE_ENV=production -e DATABASE_URL="$database_url" \
  -e FRONTEND_URL=https://boot-check.invalid "$prefix/backend:$tag" > /dev/null
# Liveness rather than the full health check, whose disk threshold would depend on the
# runner. It touches no database; the second request goes through the Prisma client,
# whose runtime files the prod stage strips by hand.
wait_for "$app" http://127.0.0.1:4000/api/health/live
wait_for "$app" http://127.0.0.1:4000/api/leagues

docker run -d --name "$web" --network "$network" \
  -e INTERNAL_API_URL="http://$app:4000/api" "$prefix/frontend:$tag" > /dev/null
wait_for "$web" http://127.0.0.1:3000/en
wait_for "$web" http://127.0.0.1:3000/fr/organizations/leagues

echo "boot check passed"
