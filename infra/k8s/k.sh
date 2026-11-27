#!/usr/bin/env bash
# Runs a Kubernetes tool in the pinned image: infra/k8s/k.sh <command> <args...>
#   infra/k8s/k.sh k3d cluster create --config lab/cluster.yaml
#   infra/k8s/k.sh kubectl get nodes
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
flags=(--rm -i -u "$(id -u):$(id -g)" --network host -e HOME=/tmp
  -e XDG_CONFIG_HOME="$state" -e XDG_CACHE_HOME="$cache" -e KUBECONFIG="$state/kubeconfig"
  -v "$state:$state" -v "$cache:$cache" -v "$(dirname "$(dirname "$here")"):/repo" -w /repo/infra/k8s)
[ ! -t 0 ] || flags+=(-t)

if [ "$1" = k3d ]; then
  socket=/var/run/docker.sock
  # k3d pulls its tools image by the tag of its own version unless told otherwise.
  flags+=(-v "$socket:$socket" --group-add "$(stat -c %g "$socket")"
    -e K3D_IMAGE_TOOLS=ghcr.io/k3d-io/k3d-tools:5.9.0@sha256:c57abce697e66feeb826922718738fe186b47779312d49d4e51e6fb9b8a6f34d)
fi

exec docker run "${flags[@]}" "$image" "$@"
