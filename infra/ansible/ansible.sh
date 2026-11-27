#!/usr/bin/env bash
# Runs an Ansible command in the pinned image: infra/ansible/ansible.sh <command> <args...>
#   infra/ansible/ansible.sh ansible-playbook playbooks/ping.yml
#
# The image is built from Dockerfile on first use and tagged by the hash of its inputs,
# so a change to Dockerfile or requirements.txt rebuilds it. The container runs as the
# calling user, with ~/.ssh mounted read-only: the Host entries there give each
# inventory name its address, and the keys stay on this machine. A running ssh-agent
# is forwarded when SSH_AUTH_SOCK is set.
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
[ "$#" -gt 0 ] || { echo "usage: ansible.sh <command> <args...>" >&2; exit 2; }

uid=$(id -u)
gid=$(id -g)
tag=$(cat "$here/Dockerfile" "$here/requirements.txt" | sha256sum | cut -c1-12)
image="bta-ansible:$tag-$uid"
if ! docker image inspect "$image" > /dev/null 2>&1; then
  echo "ansible.sh: building $image" >&2
  docker build -q --build-arg UID="$uid" --build-arg GID="$gid" -t "$image" \
    -f "$here/Dockerfile" "$here" > /dev/null
fi

flags=(--rm -i -u "$uid:$gid" -e HOME=/home/ansible -e ANSIBLE_CONFIG=/work/ansible.cfg
  -e ANSIBLE_FORCE_COLOR -v "$here:/work" -w /work)
[ ! -t 0 ] || flags+=(-t)
[ ! -d "$HOME/.ssh" ] || flags+=(-v "$HOME/.ssh:/home/ansible/.ssh:ro")
if [ -n "${SSH_AUTH_SOCK:-}" ] && [ -S "$SSH_AUTH_SOCK" ]; then
  flags+=(-v "$SSH_AUTH_SOCK:/ssh-agent" -e SSH_AUTH_SOCK=/ssh-agent)
fi

exec docker run "${flags[@]}" "$image" "$@"
