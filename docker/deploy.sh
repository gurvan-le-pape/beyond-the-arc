#!/usr/bin/env bash
# The production deploy, run on the VPS as `deploy` from the clone at
# /opt/beyondthearc. CI calls it over SSH after pushing this commit's images:
#
#   printf '%s\n' "$TOKEN" | ssh deploy@vps \
#     bash /opt/beyondthearc/docker/deploy.sh <commit-sha> <registry-host> <registry-user>
#
# The registry token is the first line of stdin, never an argument: arguments
# show in `ps` and in the SSH log. Run by hand with nothing piped in, no token
# is read and the login stored by the last deploy is reused.
#
# The script updates the clone itself, then runs the updated copy of itself:
# a deploy that changes this file is carried out by the new version. Every
# step is inside `main`, which bash parses whole before running a line of it,
# so `git pull` rewriting the file mid-run cannot change what this run does.

main() {
  set -e

  local tag="$1" registry_host="$2" registry_user="$3"
  if [[ ! "$tag" =~ ^[0-9a-f]{40}$ ]] || [ -z "$registry_host" ] || [ -z "$registry_user" ]; then
    echo "usage: deploy.sh <commit-sha> <registry-host> <registry-user>" >&2
    exit 2
  fi

  cd "$(dirname "$0")/.."

  if [ -z "${DEPLOY_PRE_PULL_HEAD:-}" ]; then
    # `|| true`: empty stdin (a manual run with no token piped) is not an
    # error, it means "reuse the stored login".
    if [ ! -t 0 ]; then
      read -r REGISTRY_TOKEN || true
      export REGISTRY_TOKEN
    fi
    # Remembered across the pull so the conditional restarts below can tell
    # whether this deploy changed any config they load.
    DEPLOY_PRE_PULL_HEAD=$(git rev-parse HEAD)
    export DEPLOY_PRE_PULL_HEAD
    git pull
    exec bash docker/deploy.sh "$@"
  fi
  local pre_pull_head="$DEPLOY_PRE_PULL_HEAD"

  if [ -n "${REGISTRY_TOKEN:-}" ]; then
    echo "$REGISTRY_TOKEN" | docker login "$registry_host" -u "$registry_user" --password-stdin
  fi

  # Pin the deployed images to this commit's tag. The exported value beats
  # .env for the pull, so a failed pull leaves .env naming the images that are
  # still running. Persisted in .env once pulled, so any later manual
  # `compose up` keeps running the same images instead of silently jumping to
  # whatever :latest points at.
  # Rollback = set IMAGE_TAG to a previous SHA and rerun pull + up.
  export IMAGE_TAG="$tag"
  echo "Disk before pull:" && df -h / | tail -1
  compose pull frontend backend migrate scheduler
  if grep -q '^IMAGE_TAG=' .env; then
    sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$tag/" .env
  else
    echo "IMAGE_TAG=$tag" >> .env
  fi
  compose up -d

  # Pull first, prune second. Every deploy pins :SHA tags, so old tagged
  # images accumulate until the disk health indicator trips (>90% of /) — they
  # do have to go. But pruning before the pull means a registry that refuses
  # the login, or a tag that was never pushed, lands on a host whose previous
  # images have already been deleted: production down, with nothing local to
  # roll back to. Pruning after a successful pull turns that same failure into
  # a red pipeline and an untouched host.
  #
  # Safe to run while the new containers are up: it removes images no
  # container references, and `up -d` above has already moved them onto the
  # new ones. All tags remain in the registry, so rollback re-pulls by
  # IMAGE_TAG and local copies of old images are not needed.
  echo "Disk before image prune:" && df -h / | tail -1
  docker image prune -af
  echo "Disk after image prune:" && df -h / | tail -1

  # Prometheus reads its scrape config only at startup, and `up -d` recreates
  # a container when its *configuration* changes — a bind-mounted file's
  # contents are not part of that hash. So a new scrape job lands on disk and
  # is never loaded.
  #
  # This must run BEFORE the Grafana restart below. An alert whose series does
  # not exist yet reads NoData, and the availability rules set
  # `noDataState: Alerting` on purpose — so restarting Grafana first would fire
  # a false alert for the two minutes it takes Prometheus to come back and
  # scrape.
  if ! git diff --quiet "$pre_pull_head" HEAD -- docker/config/prometheus.yml docker/config/blackbox.yml; then
    echo "Prometheus or blackbox config changed in this deploy — restarting both to load it"
    compose restart blackbox-exporter prometheus
  fi
  # Grafana reads provisioning/alerting/*.yml and provisioning/datasources/
  # only at startup, and the same configuration-hash rule applies. Conditional
  # rather than unconditional because a restart restarts the `for:` clocks,
  # which run 2-10 minutes here — an unrelated deploy should not delay a
  # pending Disk Full by ten minutes. Dashboards need no equivalent: their
  # provider sets no updateIntervalSeconds, so Grafana's own poll picks them up.
  if ! git diff --quiet "$pre_pull_head" HEAD -- docker/config/grafana/provisioning/alerting/ docker/config/grafana/provisioning/datasources/; then
    echo "Alerting or datasource provisioning changed in this deploy — restarting Grafana to load it"
    compose restart grafana
  fi

  # Fail the deploy if the new containers don't come up healthy — a
  # crash-looping container should be a red pipeline, not a Grafana alert.
  local backend_ok=""
  for _ in $(seq 1 12); do
    if curl -fsS -m 5 http://localhost:4000/api/health/ready > /dev/null 2>&1; then
      backend_ok=1
      break
    fi
    sleep 5
  done
  if [ -z "$backend_ok" ]; then
    echo "ERROR: Backend failed health check after 60s — deploy failed, prod may be degraded. Roll back via IMAGE_TAG in .env."
    compose logs --tail 50 backend
    exit 1
  fi
  echo "Backend healthy."

  # The same retry loop as the backend, and it has to be one.
  # `frontend.depends_on` waits for `service_healthy`, so the frontend starts
  # *after* the loop above succeeds — a single un-retried curl fires against a
  # socket that is not listening yet, exits 56, and `set -e` kills the deploy
  # before the `if` below can report a code.
  #
  # `frontend_code` is assigned inside the `if` condition on purpose: under
  # `set -e` a bare `x=$(curl ...)` that cannot connect aborts the script.
  local frontend_ok="" frontend_code=""
  for _ in $(seq 1 12); do
    if frontend_code=$(curl -s -o /dev/null -m 5 -w '%{http_code}' http://localhost:3000/en) \
       && [ "$frontend_code" = "200" ]; then
      frontend_ok=1
      break
    fi
    sleep 5
  done
  if [ -z "$frontend_ok" ]; then
    echo "ERROR: Frontend failed health check after 60s (last HTTP '$frontend_code') — deploy failed, prod may be degraded. Roll back via IMAGE_TAG in .env."
    compose logs --tail 50 frontend
    exit 1
  fi
  echo "Frontend healthy."

  # Prune only after the new containers proved healthy.
  docker system prune -f
}

compose() {
  docker compose --env-file .env -f docker/docker-compose.yml -f docker/docker-compose.prod.yml "$@"
}

main "$@"
exit
