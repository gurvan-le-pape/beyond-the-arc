#!/usr/bin/env bash
# Runs a Kubernetes tool in the pinned image: infra/k8s/k.sh <command> <args...>
#   infra/k8s/k.sh k3d cluster create --config lab/cluster.yaml
#   infra/k8s/k.sh kubectl get nodes
#   BTA_CLUSTER=production infra/k8s/k.sh kubectl get nodes
#
# BTA_CLUSTER picks the cluster, lab (the default) or production, by the kubeconfig the
# tools read: ~/.config/bta-k8s/kubeconfig for the lab, which k3d writes, and
# production.kubeconfig beside it, which `tunnel.sh kubeconfig` writes. Production's API
# is reached through the SSH tunnel tunnel.sh opens. BTA_CLUSTER is passed into the
# container, where bootstrap.sh reads it.
#
# The image is built from Dockerfile on first use and tagged by the hash of that file, so
# a version change rebuilds it. The container runs as the calling user on the host
# network, where the lab's API server listens (127.0.0.1:6550), with this directory as its
# working directory. The whole repository is mounted, at /repo: observability/ builds its
# ConfigMaps from production's files under docker/config/.
#
# State lives in ~/.config/bta-k8s (the kubeconfig, k3d's files, Helm's configuration) and
# ~/.cache/bta-k8s, mounted at the same paths inside: k3d bind-mounts files from its
# configuration directory into the node containers, and the Docker daemon resolves those
# paths on the host. Only k3d gets the Docker socket.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
[ "$#" -gt 0 ] || { echo "usage: k.sh <command> <args...>" >&2; exit 2; }

image="bta-k8s:$(sha256sum < "$here/Dockerfile" | cut -c1-12)"
if ! docker image inspect "$image" > /dev/null 2>&1; then
  echo "k.sh: building $image" >&2
  docker build -q -t "$image" "$here" > /dev/null
fi

state="${XDG_CONFIG_HOME:-$HOME/.config}/bta-k8s"
cache="${XDG_CACHE_HOME:-$HOME/.cache}/bta-k8s"
mkdir -p "$state" "$cache"

cluster="${BTA_CLUSTER:-lab}"
case "$cluster" in
  lab) kubeconfig="$state/kubeconfig" ;;
  production)
    kubeconfig="$state/production.kubeconfig"
    [ "$1" != k3d ] || { echo "k.sh: k3d manages the lab only" >&2; exit 2; }
    [ -f "$kubeconfig" ] || { echo "k.sh: no $kubeconfig; run infra/k8s/tunnel.sh kubeconfig" >&2; exit 2; }
    "$here/tunnel.sh" check > /dev/null 2>&1 || { echo "k.sh: production's tunnel is down; run infra/k8s/tunnel.sh up" >&2; exit 2; }
    ;;
  *) echo "k.sh: BTA_CLUSTER is lab or production, not $cluster" >&2; exit 2 ;;
esac

flags=(--rm -i -u "$(id -u):$(id -g)" --network host -e HOME=/tmp -e BTA_CLUSTER="$cluster"
  -e XDG_CONFIG_HOME="$state" -e XDG_CACHE_HOME="$cache" -e KUBECONFIG="$kubeconfig"
  -v "$state:$state" -v "$cache:$cache" -v "$(dirname "$(dirname "$here")"):/repo" -w /repo/infra/k8s)
[ ! -t 0 ] || flags+=(-t)

if [ "$1" = k3d ]; then
  socket=/var/run/docker.sock
  # k3d pulls its tools image by the tag of its own version unless told otherwise.
  flags+=(-v "$socket:$socket" --group-add "$(stat -c %g "$socket")"
    -e K3D_IMAGE_TOOLS=ghcr.io/k3d-io/k3d-tools:5.9.0@sha256:c57abce697e66feeb826922718738fe186b47779312d49d4e51e6fb9b8a6f34d)
fi

exec docker run "${flags[@]}" "$image" "$@"
