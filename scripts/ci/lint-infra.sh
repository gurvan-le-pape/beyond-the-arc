#!/usr/bin/env bash
# Lints the workflows (actionlint, zizmor) and the shell scripts (shellcheck).
# Every linter runs even if an earlier one failed. Run from the repo root.
#
# The files are copied into each container instead of mounted: a CI runner is itself
# a container, so its paths mean nothing to the Docker daemon, and its volumes hold
# the Docker socket and the runner's credentials. No linter gets a network.
set -euo pipefail

actionlint=rhysd/actionlint:1.7.12@sha256:b1934ee5f1c509618f2508e6eb47ee0d3520686341fec936f3b79331f9315667
shellcheck=koalaman/shellcheck:v0.11.0@sha256:61862eba1fcf09a484ebcc6feea46f1782532571a34ed51fedf90dd25f925a8d
zizmor=ghcr.io/zizmorcore/zizmor:1.33.1@sha256:ecd3ffe6158de1322e05a044ed43749bee12b1dccb7e1a7859bc6ac4b2a1c516

mapfile -t workflows < <(git ls-files '.github/workflows/*.yml')
mapfile -t scripts < <(git ls-files '*.sh')
failed=0
container=""
trap '[ -z "$container" ] || docker rm -fv "$container" > /dev/null' EXIT

lint() {
  local name="$1" image="$2"
  shift 2
  echo "== $name"
  container=$(docker create --network none -w /repo "$image" "$@")
  git ls-files -z -- .github "${scripts[@]}" |
    tar --null -T - --transform 's,^,repo/,' -cf - |
    docker cp -q - "$container:/"
  docker start -a "$container" || failed=1
  docker rm -fv "$container" > /dev/null
  container=""
}

lint actionlint "$actionlint" -color=false -config-file .github/actionlint.yaml "${workflows[@]}"
lint shellcheck "$shellcheck" "${scripts[@]}"
# Offline: no token, and no failure when GitHub is down. Low findings are style hints,
# left out.
lint zizmor "$zizmor" --offline --no-progress --min-severity medium .github

exit "$failed"
