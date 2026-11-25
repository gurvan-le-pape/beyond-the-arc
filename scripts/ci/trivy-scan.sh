#!/usr/bin/env bash
# Scans images of the local Docker daemon for known vulnerabilities. Run from the repo
# root:
#
#   scripts/ci/trivy-scan.sh <image>...
#
# Prints the counts of high and critical ones and fails on a critical one that has a
# fix. REPORT_ONLY=true never fails on findings. Accepted ones are in .trivyignore.yaml.
#
# Each image is copied into Trivy's container as a file: Trivy gets neither the Docker
# socket nor, while it reads the image, a network. The vulnerability database is in a
# volume of its own, one per runner because two scans cannot share it.
set -euo pipefail

trivy=aquasec/trivy:0.76.2@sha256:8f6bb947dbc528902e11f2f5be52f7b519f6a39d5d148f41166f2040499768fb
cache="trivy-cache-${RUNNER_NAME:-local}"
work=$(mktemp -d)
container=""
trap 'rm -rf "$work"; [ -z "$container" ] || docker rm -fv "$container" > /dev/null' EXIT

docker run --rm -v "$cache:/cache" "$trivy" image --cache-dir /cache --download-db-only --quiet ||
  echo "::warning::The vulnerability database could not be updated; scanning with the last one."

summary="${GITHUB_STEP_SUMMARY:-/dev/null}"
printf '| image | critical | fixable | high | fixable |\n|---|---|---|---|---|\n' >> "$summary"

blocking=0
for image in "$@"; do
  docker save -o "$work/image.tar" "$image"
  container=$(docker create --network none -v "$cache:/cache" "$trivy" image --input /image.tar \
    --cache-dir /cache --cache-backend memory --skip-db-update --skip-java-db-update --offline-scan \
    --skip-version-check --scanners vuln --severity HIGH,CRITICAL --ignorefile /trivyignore.yaml \
    --format json --quiet)
  docker cp -q "$work/image.tar" "$container:/image.tar"
  docker cp -q .trivyignore.yaml "$container:/trivyignore.yaml"
  docker start -a "$container" > "$work/report.json"
  docker rm -fv "$container" > /dev/null
  container=""

  # A report without an image is not a clean one.
  jq -e '.ArtifactName' "$work/report.json" > /dev/null
  counts=$(jq -r '[.Results[]?.Vulnerabilities[]?] as $v
    | def n(s; f): [$v[] | select(.Severity == s and ((f | not) or (.FixedVersion // "") != ""))] | length;
    "\(n("CRITICAL"; false)) \(n("CRITICAL"; true)) \(n("HIGH"; false)) \(n("HIGH"; true))"' "$work/report.json")
  read -r critical fixable high high_fixable <<< "$counts"
  echo "$image: $critical critical ($fixable fixable), $high high ($high_fixable fixable)"
  echo "| \`$image\` | $critical | $fixable | $high | $high_fixable |" >> "$summary"
  jq -r '.Results[]? | .Target as $t | .Vulnerabilities[]?
    | select((.FixedVersion // "") != "")
    | "  \(.Severity) \(.VulnerabilityID) \(.PkgName) \(.InstalledVersion) -> \(.FixedVersion) (\($t))"' \
    "$work/report.json" | sort -u
  blocking=$((blocking + fixable))
done

if [ "$blocking" -gt 0 ]; then
  if [ "${REPORT_ONLY:-}" = "true" ]; then
    echo "::warning::$blocking fixable critical vulnerabilities (report only)."
  else
    echo "::error::$blocking fixable critical vulnerabilities. Update the package, or accept one in .trivyignore.yaml with an expiry date."
    exit 1
  fi
fi
