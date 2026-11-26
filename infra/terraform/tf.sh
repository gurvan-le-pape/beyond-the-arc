#!/usr/bin/env bash
# Runs Terraform for one stack, in the image CI uses: infra/terraform/tf.sh <stack> <args...>
#
# Credentials are read from ~/.config/bta-terraform (r2.env, then <stack>.env if present)
# and handed to the container by name, never on the command line. The container runs as
# the calling user so .terraform/ and the lock file are not left owned by root.
# TF_CONTAINER_NAME names the container, for the lock proof in README.md.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
stack="${1:?usage: tf.sh <stack> <terraform args...>}"
shift
[ -d "$here/$stack" ] || { echo "tf.sh: no stack '$stack'" >&2; exit 2; }
image=$(< "$here/.terraform-image")
config="$HOME/.config/bta-terraform"

set -a
# shellcheck disable=SC1091
[ ! -f "$config/r2.env" ] || . "$config/r2.env"
# shellcheck disable=SC1090
[ ! -f "$config/$stack.env" ] || . "$config/$stack.env"
set +a
if [ -z "${AWS_ENDPOINT_URL_S3:-}" ] && [ -n "${R2_ACCOUNT_ID:-}" ]; then
  export AWS_ENDPOINT_URL_S3="https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com"
fi

cache="${XDG_CACHE_HOME:-$HOME/.cache}/bta-terraform/plugins"
mkdir -p "$cache"
flags=(--rm -i -u "$(id -u):$(id -g)" -e HOME=/tmp -e TF_PLUGIN_CACHE_DIR=/plugins
  -v "$cache:/plugins" -v "$here/$stack:/work" -w /work)
[ ! -t 0 ] || flags+=(-t)
[ -z "${TF_CONTAINER_NAME:-}" ] || flags+=(--name "$TF_CONTAINER_NAME")
for var in AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_ENDPOINT_URL_S3 GITHUB_TOKEN \
  CLOUDFLARE_API_TOKEN HCLOUD_TOKEN; do
  flags+=(-e "$var")
done

exec docker run "${flags[@]}" "$image" "$@"
