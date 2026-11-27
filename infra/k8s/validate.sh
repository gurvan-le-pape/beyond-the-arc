#!/usr/bin/env bash
# Validates the Kubernetes manifests under infra/k8s against the API schemas of the lab's
# Kubernetes version, with kubeconform in strict mode (an unknown field is an error).
# Runs in the k.sh image, from infra/k8s: `infra/k8s/k.sh ./validate.sh` locally, and in
# CI through scripts/ci/lint-infra.sh.
#
# What is validated is what reaches the cluster: the plain manifests as they are, the apps
# chart as helm template renders it, the application as its lab overlay builds it, and
# each upstream chart an Application installs, rendered at its pinned version with the
# values this repository gives it.
# Kubernetes' own kinds are checked against yannh/kubernetes-json-schema, custom resources
# against datreeio/CRDs-catalog, both at pinned commits, so a run needs a network but reads
# the same schemas every time. The version comes from the k3s image tag in
# lab/cluster.yaml, which is k3d's configuration and not a manifest.
set -euo pipefail

cd "$(dirname "$0")"
version=$(sed -n 's/^image: rancher\/k3s:v\([0-9.]*\)-k3s.*/\1/p' lab/cluster.yaml)
[ -n "$version" ] || { echo "validate.sh: no k3s version in lab/cluster.yaml" >&2; exit 1; }
kubernetes=https://raw.githubusercontent.com/yannh/kubernetes-json-schema/e62c03bd5a52fd34ff6ac28d083e2a300e0ae7c1
crds=https://raw.githubusercontent.com/datreeio/CRDs-catalog/d330ce2bbe064d75a1ff289d09f0a4dadb8f3f8e

rendered=$(mktemp -d)
trap 'rm -rf "$rendered"' EXIT
helm template apps apps > "$rendered/apps.yaml"
helm template apps apps -f apps/values-production.yaml > "$rendered/apps-production.yaml"
kubectl kustomize app/lab > "$rendered/app-lab.yaml"
kubectl kustomize app/production > "$rendered/app-production.yaml"
# observability/ reads production's files under docker/config/, as Argo CD lets it
# (argocd/values.yaml, kustomize.buildOptions).
kubectl kustomize --load-restrictor LoadRestrictionsNone observability > "$rendered/observability.yaml"

# An upstream chart, at the version apps/values.yaml pins for its Application, with the
# values that Application gives it:
# render <key in apps/values.yaml> <release> <repository> <chart> <namespace> [helm flags...]
# An oci:// repository is a registry path, which the chart's name completes.
render() {
  local key="$1" release="$2" repo="$3" chart="$4" namespace="$5" version
  shift 5
  version=$(sed -n "/^$key:/,/^[^ ]/s/^  chartVersion: *//p" apps/values.yaml)
  [ -n "$version" ] || { echo "validate.sh: no $key.chartVersion in apps/values.yaml" >&2; exit 1; }
  local source=("$chart" --repo "$repo")
  [[ $repo == oci://* ]] && source=("$repo/$chart")
  helm template "$release" "${source[@]}" --version "$version" --namespace "$namespace" \
    "$@" > "$rendered/$release.yaml"
}
render argocd argocd https://argoproj.github.io/argo-helm argo-cd argocd -f argocd/values.yaml
render cnpg cnpg https://cloudnative-pg.github.io/charts cloudnative-pg cnpg-system
# The values of apps/templates/cert-manager.yaml and sealed-secrets.yaml.
render certManager cert-manager https://charts.jetstack.io cert-manager cert-manager \
  --set crds.enabled=true --set startupapicheck.enabled=false
render sealedSecrets sealed-secrets https://bitnami.github.io/sealed-secrets sealed-secrets \
  kube-system --set fullnameOverride=sealed-secrets-controller --set-string keyrenewperiod=0
render kubePrometheusStack kps https://prometheus-community.github.io/helm-charts \
  kube-prometheus-stack monitoring -f apps/values/kube-prometheus-stack.yaml
render arc arc oci://ghcr.io/actions/actions-runner-controller-charts \
  gha-runner-scale-set-controller arc-systems -f apps/values/arc-controller.yaml
render arc bta-lab oci://ghcr.io/actions/actions-runner-controller-charts \
  gha-runner-scale-set arc-runners -f apps/values/arc-runners.yaml

# Plain manifests: every YAML file outside the charts, the values files, the Kustomize
# tree and k3d's config.
mapfile -t manifests < <(find . \( -path ./app -o -path ./apps -o -path ./argocd -o -path ./lab \
  -o -path ./observability \) -prune -o \
  -type f \( -name '*.yaml' -o -name '*.yml' \) -print | sort)

# CustomResourceDefinition is skipped: its schema is recursive (a CRD's schema describes
# schemas), so the schema repository has no standalone file for it. The CRDs here come
# unchanged from upstream charts; the resources they define are validated.
kubeconform -strict -summary -kubernetes-version "$version" -skip CustomResourceDefinition \
  -schema-location "$kubernetes/{{.NormalizedKubernetesVersion}}-standalone{{.StrictSuffix}}/{{.ResourceKind}}{{.KindSuffix}}.json" \
  -schema-location "$crds/{{.Group}}/{{.ResourceKind}}_{{.ResourceAPIVersion}}.json" \
  "${manifests[@]}" "$rendered"/*.yaml
