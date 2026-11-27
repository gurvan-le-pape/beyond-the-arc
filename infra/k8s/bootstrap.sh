#!/usr/bin/env bash
# Installs Argo CD in a cluster and hands it the root Application, after which Argo CD
# keeps itself and everything else from Git. Runs in the k.sh image, from infra/k8s:
#   infra/k8s/k.sh ./bootstrap.sh              # the lab, following main
#   infra/k8s/k.sh ./bootstrap.sh my-branch    # the lab, following a pushed branch
#   BTA_CLUSTER=production infra/k8s/k.sh ./bootstrap.sh
#
# The cluster is k.sh's BTA_CLUSTER. On production, root renders the apps chart with
# apps/values-production.yaml on top of its defaults; on the lab, with the defaults
# alone.
#
# Argo CD is installed from the chart rendered by helm template and applied server-side,
# not by helm install: once the argocd Application syncs, Argo CD owns those objects, and
# a Helm release beside it would be a second record of them going stale. Running it again
# is safe: it re-applies the same objects (taking back fields Argo CD has since set, which
# its next sync settles) and moves root to the given revision.
set -euo pipefail

cd "$(dirname "$0")"
revision="${1:-main}"
case "${BTA_CLUSTER:-lab}" in
  lab) value_files='[]' ;;
  production) value_files='["values-production.yaml"]' ;;
  *) echo "bootstrap.sh: BTA_CLUSTER is lab or production" >&2; exit 2 ;;
esac
chart_version=$(sed -n '/^argocd:/,/^[^ ]/s/^  chartVersion: *//p' apps/values.yaml)
[ -n "$chart_version" ] || { echo "bootstrap.sh: no argocd.chartVersion in apps/values.yaml" >&2; exit 1; }

kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
helm template argocd argo-cd --repo https://argoproj.github.io/argo-helm \
  --version "$chart_version" --namespace argocd -f argocd/values.yaml |
  kubectl apply --server-side --force-conflicts --field-manager=bootstrap -n argocd -f -
kubectl -n argocd rollout status deployment,statefulset --timeout=300s

# The revision and the values files are patched in every time, main included, so that
# a run on main undoes an earlier run on a branch.
kubectl apply -f root.yaml
patch=$(printf '{"spec":{"source":{"targetRevision":"%s","helm":{"valueFiles":%s,"parameters":[{"name":"targetRevision","value":"%s"}]}}}}' \
  "$revision" "$value_files" "$revision")
kubectl -n argocd patch application root --type merge -p "$patch"
echo "bootstrap.sh: ${BTA_CLUSTER:-lab}, root follows $revision"
