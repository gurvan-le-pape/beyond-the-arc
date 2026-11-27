#!/usr/bin/env bash
# Validates the Kubernetes manifests under infra/k8s against the API schemas of the lab's
# Kubernetes version, with kubeconform in strict mode (an unknown field is an error).
# Runs in the k.sh image, from infra/k8s: `infra/k8s/k.sh ./validate.sh` locally, and in
# CI through scripts/ci/lint-infra.sh.
#
# The schemas are downloaded from yannh/kubernetes-json-schema at a pinned commit, so a
# run needs a network but reads the same schemas every time. The version comes from the
# k3s image tag in lab/cluster.yaml, which is k3d's configuration and not a manifest.
set -euo pipefail

cd "$(dirname "$0")"
version=$(sed -n 's/^image: rancher\/k3s:v\([0-9.]*\)-k3s.*/\1/p' lab/cluster.yaml)
[ -n "$version" ] || { echo "validate.sh: no k3s version in lab/cluster.yaml" >&2; exit 1; }
schemas=https://raw.githubusercontent.com/yannh/kubernetes-json-schema/e62c03bd5a52fd34ff6ac28d083e2a300e0ae7c1

mapfile -t manifests < <(find . -path ./lab/cluster.yaml -prune -o \
  -type f \( -name '*.yaml' -o -name '*.yml' \) -print | sort)
if [ "${#manifests[@]}" -eq 0 ]; then
  echo "validate.sh: no manifests yet"
  exit 0
fi

exec kubeconform -strict -summary -kubernetes-version "$version" \
  -schema-location "$schemas/{{.NormalizedKubernetesVersion}}-standalone{{.StrictSuffix}}/{{.ResourceKind}}{{.KindSuffix}}.json" \
  "${manifests[@]}"
