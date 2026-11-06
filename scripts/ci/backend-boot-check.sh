#!/bin/sh
# Starts the backend's production image against a migrated PostgreSQL and checks
# that it answers. Lint, tests and `nest build` all run with dev dependencies and
# never start the app, so they miss a crash at startup and a package the prod
# stage does not ship. Run from the repo root.
set -eu

id="${CI_JOB_ID:-local}"
network="backend-boot-$id"
database="backend-boot-db-$id"
app="backend-boot-app-$id"
app_image="backend-boot:$id"
migrate_image="backend-boot-migrate:$id"
database_url="postgres://postgres:boot@$database:5432/boot"
live_url="http://127.0.0.1:4000/api/health/live"
query_url="http://127.0.0.1:4000/api/leagues"
timeout_seconds=60

cleanup() {
  docker rm -fv "$app" "$database" >/dev/null 2>&1 || true
  docker network rm "$network" >/dev/null 2>&1 || true
  docker image rm "$app_image" "$migrate_image" >/dev/null 2>&1 || true
}
trap cleanup EXIT

fail() {
  echo "backend boot check failed: $1" >&2
  docker logs --tail 80 "$app" >&2 || true
  exit 1
}

request() {
  docker exec "$app" wget -q -O /dev/null "$1" 2>/dev/null
}

docker build -q -f docker/backend/Dockerfile --target prod -t "$app_image" . >/dev/null
docker build -q -f docker/backend/Dockerfile --target migrate -t "$migrate_image" . >/dev/null

docker network create "$network" >/dev/null
docker run -d --name "$database" --network "$network" \
  -e POSTGRES_PASSWORD=boot -e POSTGRES_DB=boot postgres:18 >/dev/null

# Over TCP: during initialisation the server listens on its Unix socket only.
elapsed=0
until docker exec "$database" pg_isready -q -h 127.0.0.1 -U postgres -d boot; do
  elapsed=$((elapsed + 1))
  if [ "$elapsed" -ge "$timeout_seconds" ]; then
    echo "backend boot check failed: database not ready" >&2
    exit 1
  fi
  sleep 1
done

docker run --rm --network "$network" -e DATABASE_URL="$database_url" "$migrate_image"

docker run -d --name "$app" --network "$network" \
  -e NODE_ENV=production -e DATABASE_URL="$database_url" \
  -e FRONTEND_URL=https://boot-check.invalid "$app_image" >/dev/null

elapsed=0
until request "$live_url"; do
  if [ "$(docker inspect -f '{{.State.Running}}' "$app")" != "true" ]; then
    fail "the container exited during startup"
  fi
  elapsed=$((elapsed + 1))
  if [ "$elapsed" -ge "$timeout_seconds" ]; then
    fail "no answer on $live_url after ${timeout_seconds}s"
  fi
  sleep 1
done

# Liveness touches no database. This goes through the Prisma client, whose
# runtime files the prod stage strips by hand.
request "$query_url" || fail "$query_url did not answer 2xx"

echo "backend boot check passed in ${elapsed}s"
