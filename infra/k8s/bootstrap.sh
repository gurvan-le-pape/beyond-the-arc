#!/usr/bin/env bash
# Installs Argo CD in the lab cluster and hands it the root Application, after which
# Argo CD keeps itself and everything else from Git. Runs in the k.sh image, from
# infra/k8s:
#   infra/k8s/k.sh ./bootstrap.sh              # follow main
#   infra/k8s/k.sh ./bootstrap.sh my-branch    # follow a pushed branch, to try it whole
#
# Argo CD is installed from the chart rendered by helm template and applied server-side,
# not by helm install: once the argocd Application syncs, Argo CD owns those objects, and
# a Helm release beside it would be a second record of them going stale. Running it again
# is safe: it re-applies the same objects (taking back fields Argo CD has since set, which
# its next sync settles) and moves root to the given revision.
set -euo pipefail

cd "$(dirname "$0")"
revision="${1:-main}"
chart_version=$(sed -n '/^argocd:/,/^[^ ]/s/^  chartVersion: *//p' apps/values.yaml)
[ -n "$chart_version" ] || { echo "bootstrap.sh: no argocd.chartVersion in apps/values.yaml" >&2; exit 1; }

kubectl create namespace argocd --dry-run=client -o yaml | kubectl apply -f -
helm template argocd argo-cd --repo https://argoproj.github.io/argo-helm \
  --version "$chart_version" --namespace argocd -f argocd/values.yaml |
  kubectl apply --server-side --force-conflicts --field-manager=bootstrap -n argocd -f -
kubectl -n argocd rollout status deployment,statefulset --timeout=300s

# The revision is patched in every time, main included, so that a run on main undoes an
# earlier run on a branch.
kubectl apply -f root.yaml
patch=$(printf '{"spec":{"source":{"targetRevision":"%s","helm":{"parameters":[{"name":"targetRevision","value":"%s"}]}}}}' \
  "$revision" "$revision")
kubectl -n argocd patch application root --type merge -p "$patch"
echo "bootstrap.sh: root follows $revision"
