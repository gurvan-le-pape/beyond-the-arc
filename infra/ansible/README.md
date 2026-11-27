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

## Playbooks

`playbooks/compose.yml` configures `bta-prod-compose`. Its roles port
`docker/provision/provision.sh` section by section, in the script's order, and keep its
guards: the data volume comes first so that Docker never starts without it; nothing
formats a disk; an fstab entry, a clone or a site path it did not write stops the run
instead of being rewritten.

| Role | provision.sh section |
|---|---|
| `volume` | Data volume (fstab, mount, Docker's `RequiresMountsFor`) |
| `swap` | Swap and swappiness |
| `journald` | journald size |
| `packages` | Packages (Docker's apt repository, wanted and unwanted packages, no snapd), Docker service |
| `unattended_upgrades` | Unattended security upgrades |
| `ssh_hardening` | SSH: keys only, checked on `sshd -T` |
| `deploy_user` | The deploy user, its key, its Nginx sudoers rule |
| `app` | Deploy clone, `.env` check, `postgres_data` volume |
| `nginx` | Nginx service, `server_tokens off`, site link |
| `postgres_backup` | (not in the script) nightly backup to R2 |

Until `provision.sh` is deleted, both describe the host; change the Ansible side only.
Both report no change on `bta-prod-compose` (`provision.sh --check` and
`compose.yml --check --diff`, 2026-11-27).

## Running it

Ansible runs only on the maintainer's machine, through `ansible.sh`, in the image built
from `Dockerfile`: Python, openssh, age and rclone from a base image pinned by digest,
Ansible and ansible-lint pinned by hash in `requirements.txt`, the `community.sops`
collection at the version in `requirements.yml`, and sops checked against its sha256. CI builds the same image and runs
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

## Secrets

Secrets are in `inventory/group_vars/<group>/*.sops.yml`, encrypted with SOPS to the
maintainer's age key (`.sops.yaml`). The `community.sops` vars plugin decrypts them when
a playbook loads the inventory, with the private key `ansible.sh` mounts read-only from
`~/.config/sops/age/keys.txt`. CI has no key: `ansible-lint` and `--syntax-check` never
decrypt. Edit a file in place, which opens `$EDITOR` on the clear text and re-encrypts
on save:

```bash
infra/ansible/ansible.sh sops edit inventory/group_vars/compose/backup.sops.yml
```

## Database backups

`postgres_backup` (on `compose`) installs `/usr/local/sbin/bta-db-backup` and a systemd
timer running it nightly at 04:00 Paris time: a full `pg_dump -Fc -Z zstd:3` streamed
into age (public key only) into a file under `/var/tmp`, then uploaded with rclone to
`r2:bta-db-backups/daily/`, and on Mondays copied to `weekly/`. Retention (7 dailies,
4 weeklies) is the bucket's lock and lifecycle rules in `../terraform/cloudflare/r2.tf`,
not the script's. On success it writes `bta_db_backup_last_success_timestamp_seconds`
for node-exporter; the Grafana rule *Database Backup Missing* fires after 26 hours
without one.

`backup.sops.yml` holds the host's R2 token: Object Read & Write on `bta-db-backups`
only (`postgres_backup_r2_access_key_id`, `postgres_backup_r2_secret_access_key`) and
the bucket's jurisdiction endpoint (`postgres_backup_r2_endpoint`,
`https://<account id>.eu.r2.cloudflarestorage.com`).

```bash
# On the host, as root: one run now, then its log.
systemctl start bta-db-backup.service
journalctl -u bta-db-backup.service -n 20
```

### Restore test

A backup that has never been restored is not a backup. `restore-test.sh` restores the
latest backup into a throwaway PostgreSQL, at the version Compose runs, on the
maintainer's machine, and prints its row counts next to production's. Run it after any
change to the backup job, and monthly:

```bash
infra/ansible/restore-test.sh          # latest under daily/
infra/ansible/restore-test.sh weekly   # latest under weekly/
```

It reads `~/.config/bta-ansible/r2-backups-read.env` (mode 600), from an R2 token with
Object Read only on `bta-db-backups`:

```
RCLONE_CONFIG_R2_TYPE=s3
RCLONE_CONFIG_R2_PROVIDER=Cloudflare
RCLONE_CONFIG_R2_ENDPOINT=https://<account id>.eu.r2.cloudflarestorage.com
RCLONE_CONFIG_R2_ACCESS_KEY_ID=...
RCLONE_CONFIG_R2_SECRET_ACCESS_KEY=...
RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true
```

The backup goes from R2 through `age -d` into `pg_restore` as a stream: the decrypted
dump is never written to disk. Production keeps running after the dump, so its counts
are equal or higher, never lower.

## Updating Ansible or ansible-lint

Edit `requirements.in`, then regenerate the hashes in the base image (collections:
`requirements.yml`; sops: `SOPS_VERSION` and `SOPS_SHA256` in `Dockerfile`, from the
release's `checksums.txt`):

```bash
docker run --rm -u "$(id -u):$(id -g)" -e HOME=/tmp -v "$PWD/infra/ansible:/w" -w /w \
  "$(sed -n 's/^FROM //p' infra/ansible/Dockerfile)" sh -c \
  'pip install -q --user pip-tools && ~/.local/bin/pip-compile -q --generate-hashes \
   --strip-extras --no-header --allow-unsafe -o requirements.txt requirements.in'
```
