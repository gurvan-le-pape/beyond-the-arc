#!/usr/bin/env bash
# Lists the dependency updates Renovate would propose, grouped as renovate.json groups
# them, in the run summary. Run from the repo root. It changes nothing: Renovate runs on
# a copy of the tracked files, and has no Docker socket.
#
# RENOVATE_GITHUB_COM_TOKEN only reads the tags of public actions. Without it, they are not
# looked up and the script fails, rather than call them up to date.
set -euo pipefail

renovate=ghcr.io/renovatebot/renovate:44.263.1@sha256:0efa7b743c52015c08a5bd2bb98fbc16f735a4e684a45526c622eddce00be909

work=$(mktemp -d)
container=""
trap 'rm -rf "$work"; [ -z "$container" ] || docker rm -fv "$container" > /dev/null' EXIT

# The tree is copied, not mounted: a CI runner is itself a container, so its paths mean
# nothing to the Docker daemon.
container=$(docker create -w /tmp/repo -e RENOVATE_GITHUB_COM_TOKEN \
  -e LOG_LEVEL=warn -e RENOVATE_REPORT_TYPE=file -e RENOVATE_REPORT_PATH=/tmp/report.json \
  "$renovate" --platform=local --dry-run=lookup)
git ls-files -z | tar --null -T - --owner=12021 --group=0 --mode=u+rwX --transform 's,^,repo/,' -cf - |
  docker cp -q - "$container:/tmp"
docker start -a "$container"
docker cp -q "$container:/tmp/report.json" "$work/report.json"

report="$work/report.json"
jq -e '[.repositories[].packageFiles[][].deps[]] | length > 0' "$report" > /dev/null || {
  echo "::error::Renovate found no dependency."
  exit 1
}

jq -r '
  [ .repositories[].packageFiles | to_entries[] | .value[] | .packageFile as $file
    | .deps[] | . as $dep | .updates[]?
    | { group: (.branchName | ltrimstr("renovate/")), major: (.updateType == "major"), name: $dep.depName, file: $file,
        from: ($dep.lockedVersion // $dep.currentVersion // $dep.currentValue // "-"),
        to: (.newVersion // .newValue // (.newDigest // "-")[0:19]), type: .updateType } ] | unique as $all
  | def table: "| dependency | file | from | to | type |\n|---|---|---|---|---|\n"
      + (map("| \(.name) | \(.file) | \(.from) | \(.to) | \(.type) |") | join("\n")) + "\n";
  "## Updates Renovate would propose\n",
  ($all | map(select(.major | not)) | group_by(.group)[] | "### \(.[0].group) (\(length))\n\n\(table)"),
  ($all | map(select(.major)) | select(length > 0) | "### Major versions, on request (\(length))\n\n\(table)")
' "$report" > "$work/summary.md"
cat "$work/summary.md"
[ -z "${GITHUB_STEP_SUMMARY:-}" ] || cat "$work/summary.md" >> "$GITHUB_STEP_SUMMARY"

skipped=$(jq -r '.repositories[].packageFiles | to_entries[] | .key as $m | .value[] | .packageFile as $f | .deps[]
  | select(.skipReason == "github-token-required" or ((.warnings // []) | length > 0))
  | "\($m) \($f) \(.depName): \(.skipReason // .warnings[0].message)"' "$report")
if [ -n "$skipped" ]; then
  echo "$skipped"
  echo "::error::Some dependencies could not be looked up."
  exit 1
fi
