#!/usr/bin/env bash
# Production's API server, from the maintainer's machine: infra/k8s/tunnel.sh up|down|check|kubeconfig
#
# k3s's API listens on bta-prod-k3s's port 6443, which the Hetzner firewall does not open.
# `up` forwards 127.0.0.1:16443 here to it over SSH, as the `ansible` user, in the
# background, through a control socket that `down` and `check` use. `kubeconfig` copies
# the host's admin kubeconfig to ~/.config/bta-k8s/production.kubeconfig (mode 0600),
# pointed at the tunnel and renamed from k3s's `default` to bta-prod, which is what
# `BTA_CLUSTER=production k.sh ...` reads. It holds the cluster's admin credentials.
#
# Runs on the machine itself, not in the k.sh image: ssh needs the keys and
# ~/.ssh/config's Host entry, which gives bta-prod-k3s its address.
set -euo pipefail

host=ansible@bta-prod-k3s
port=16443
state="${XDG_CONFIG_HOME:-$HOME/.config}/bta-k8s"
cache="${XDG_CACHE_HOME:-$HOME/.cache}/bta-k8s"
socket="$cache/production-tunnel.sock"
mkdir -p "$state" "$cache"

case "${1:-}" in
  up)
    if ssh -S "$socket" -O check "$host" 2> /dev/null; then
      echo "tunnel.sh: already up on 127.0.0.1:$port"
      exit 0
    fi
    ssh -f -N -M -S "$socket" -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 \
      -L "127.0.0.1:$port:127.0.0.1:6443" "$host"
    echo "tunnel.sh: up on 127.0.0.1:$port"
    ;;
  down)
    ssh -S "$socket" -O exit "$host" 2> /dev/null || true
    echo "tunnel.sh: down"
    ;;
  check)
    ssh -S "$socket" -O check "$host"
    ;;
  kubeconfig)
    umask 077
    ssh "$host" sudo cat /etc/rancher/k3s/k3s.yaml |
      sed -e "s#https://127.0.0.1:6443#https://127.0.0.1:$port#" -e 's/: default$/: bta-prod/' \
        > "$state/production.kubeconfig.new"
    grep -q "server: https://127.0.0.1:$port" "$state/production.kubeconfig.new" ||
      { echo "tunnel.sh: the host's kubeconfig has no server line to point at the tunnel" >&2; exit 1; }
    mv "$state/production.kubeconfig.new" "$state/production.kubeconfig"
    echo "tunnel.sh: wrote $state/production.kubeconfig"
    ;;
  *)
    echo "usage: tunnel.sh up|down|check|kubeconfig" >&2
    exit 2
    ;;
esac
