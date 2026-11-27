# Ansible

Configures the servers Terraform imports (`../terraform/hetzner`). It is replacing
`docker/provision/provision.sh`, one role per section of that script; until the last
role lands, the script stays the reference and only the Ansible side changes.

| Group | Host | Role in the platform | Connects as |
|---|---|---|---|
| `compose` | `bta-prod-compose` (CX23) | production today, Docker Compose | `root`, until the cutover |
| `k3s` | `bta-prod-k3s` (CX33) | production after the cutover, k3s | `root`, until the `ansible` user exists |

On `bta-prod-compose`, a playbook runs with `--check --diff` only, unless the maintainer
has said otherwise for that run.

## Running it

Ansible runs only on the maintainer's machine, through `ansible.sh`, in the image built
from `Dockerfile`: Python and openssh from a base image pinned by digest, Ansible and
ansible-lint pinned by hash in `requirements.txt`. CI builds the same image and runs
`ansible-lint` and `--syntax-check` with no network and no access to a server
(`scripts/ci/lint-infra.sh`).

```bash
infra/ansible/ansible.sh ansible-playbook playbooks/ping.yml
infra/ansible/ansible.sh ansible-lint
```

The inventory names hosts and nothing else. Each name is a `Host` entry in
`~/.ssh/config`, which `ansible.sh` mounts read-only:

```
Host bta-prod-compose
  HostName <IPv4 of the CX23>
  IdentityFile ~/.ssh/hetzner_vps
  IdentitiesOnly yes
```

and the same for `bta-prod-k3s`. The addresses are the servers' primary IPv4s (Hetzner
console, or `../terraform/tf.sh hetzner state show` on a primary IP). Host keys are
checked against `~/.ssh/known_hosts`, which the container cannot write: a first
connection to a host is made with plain `ssh` beforehand.

## Updating Ansible or ansible-lint

Edit `requirements.in`, then regenerate the hashes in the base image:

```bash
docker run --rm -u "$(id -u):$(id -g)" -e HOME=/tmp -v "$PWD/infra/ansible:/w" -w /w \
  "$(sed -n 's/^FROM //p' infra/ansible/Dockerfile)" sh -c \
  'pip install -q --user pip-tools && ~/.local/bin/pip-compile -q --generate-hashes \
   --strip-extras --no-header --allow-unsafe -o requirements.txt requirements.in'
```
