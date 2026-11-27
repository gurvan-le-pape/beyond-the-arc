# Infrastructure

> How Beyond The Arc is built, run, and served: VPS and DNS setup, Docker Compose configuration, individual service configurations, and Nginx.

---

## Overview

The entire stack runs on a single VPS as a set of Docker Compose containers. There is no Kubernetes, no container orchestration platform, and no horizontal scaling — the scope of the project does not require it, and the simplicity of a single-node setup makes it easier to reason about and operate.

All services share a single Docker bridge network (`my_network`) and communicate by service name. External traffic enters through Nginx, which runs on the VPS host and reverse-proxies to the frontend and backend containers.

---

## VPS

The server is a **Hetzner CX23** (2 vCPU, 4GB RAM, 40GB local disk) located in Nuremberg, Germany (eu-central). It runs Ubuntu and hosts all application and observability containers.

Docker's named volumes live on a separate **89 GB Hetzner volume** mounted at `/var/lib/docker/volumes`, so the database, Loki's log store and metrics grow on that disk, not on the root one. The root disk holds the OS, the images, the containers' writable layers and the containers' own stdout/stderr logs (`/var/lib/docker/containers`); image buildup is what filled it before (see the deploy prune in [`ci-cd.md`](./ci-cd.md)). Those stdout logs are capped per service by the `x-logging` block in `docker/docker-compose.yml` (`local` driver, 5 × 20 MB): Docker's default keeps them unbounded until the container is removed, and the deploy never recreates the observability services. Check both disks with `df -h / /var/lib/docker/volumes`.

Two independent controls keep the Docker service ports (3000, 4000, 5432, 9090, 3001) off the internet, and it takes both:

- **The compose file binds them to loopback.** Every published port in `docker/docker-compose.yml` carries a `127.0.0.1:` / `[::1]:` host address, so the listener exists only on the VPS itself. Both loopback families are published because Nginx proxies to `localhost`, which `/etc/hosts` resolves to `127.0.0.1` *and* `::1` — an IPv4-only bind would leave half of that resolution without a listener.
- **The Hetzner Cloud firewall (`firewall-1`) allows inbound TCP on three ports only**: 22 (SSH) from anywhere, and 80 (HTTP) and 443 (HTTPS) from [Cloudflare's published ranges](https://www.cloudflare.com/ips/) only — 15 IPv4 and 7 IPv6 blocks, the same list on both rules. Every hostname served here is proxied, so a visitor never connects to the origin directly; a request sent straight to the server's IP times out instead of skipping Cloudflare's crawler blocks and the Access gate in front of Grafana. SSH stays open to all because the CI deploy runs from a machine without a fixed address. The rules live in the Hetzner console, not this repository, and the Cloudflare list is copied by hand — the same list as `docker/nginx/cloudflare-realip.conf`: if Cloudflare adds a range, traffic through it is refused until the rule is updated, and Nginx logs that edge's address instead of the visitor's until the file is.

The firewall alone was not enough to rely on: Docker writes its published-port rules into `iptables` ahead of host firewalls such as `ufw`, so a `0.0.0.0` bind put the Postgres superuser port and an unauthenticated Prometheus one cloud-console rule away from the public internet — a rule this repository neither contains nor tests, on a host whose address stays in public DNS history. The loopback bind makes that guarantee local instead of remote.

Nginx on the host is the sole external entry point; internal services are only reachable from within the VPS itself.

### SSH

Port 22 is the one open port that answers with a service the internet can talk to, and it is under continuous automated attack — the current `auth.log` holds tens of thousands of failed password attempts. **Both accounts authenticate with keys only**, enforced in `/etc/ssh/sshd_config.d/10-disable-password-auth.conf`:

```
PasswordAuthentication no
KbdInteractiveAuthentication no
```

`PermitRootLogin` is `without-password`, so `root` accepts a key and never a password; `root` does hold a password, but only for the Hetzner console. The `ssh_hardening` Ansible role writes that drop-in (see *Host setup* below). Neither setting can be left to the defaults: sshd ships with `PasswordAuthentication` **on**, and it was on here — not because anything enabled it, but because nothing had turned it off. That was safe only by accident, since no account with a usable password also accepted password auth; the day one is given a password it becomes a remote login on a publicly-resolvable address (see the Grafana subdomain below).

Two mechanics make this easy to get wrong. `sshd_config` is **first-value-wins**, the opposite of most config systems, and `Include /etc/ssh/sshd_config.d/*.conf` sits at the top of the main file — so drop-ins beat it, and among drop-ins the lexically *first* one wins. A file named to sort after an existing one that sets the same keyword is silently inert. And `sshd_config` is not the effective config: read it with `sshd -T`, which resolves drop-ins and defaults. Validate with `sshd -t` and apply with `systemctl reload ssh` — never `restart` — so a rejected config leaves the running daemon serving the old one.

The root password is the way back in when SSH is unusable — a bad sshd drop-in, a firewall rule, a lost key — so it belongs in a password manager, and a login through the Hetzner console is the only proof it works. The console types as a **US QWERTY** keyboard whatever the local layout is: a password with symbols, or letters that move between layouts (`a`/`q`, `z`/`w`, `m`), fails there while being correct.

### Host setup

Everything below lives on the VPS, outside the containers and outside the deploy, and **the Ansible playbook `infra/ansible/playbooks/compose.yml` applies all of it**, one role per step, from the maintainer's machine (`infra/ansible/README.md`):

```bash
infra/ansible/ansible.sh ansible-playbook playbooks/compose.yml --check --diff   # report what differs, change nothing
infra/ansible/ansible.sh ansible-playbook playbooks/compose.yml --diff           # apply
```

Each task compares the host with the role and changes only what differs, so a second run reports `changed=0`; on the live server, run `--check --diff` first. It never overwrites what it did not write — an `fstab` entry for the volume that points elsewhere, a path where the Nginx symlink belongs that is not our link, a clone that is not sparse on `docker/` — the run stops on it and leaves it; and it never formats a disk. The volume's device and the deploy key are in `infra/ansible/inventory/group_vars/compose/main.yml`. What it cannot do from the host is in *Rebuilding the server from zero* below.

What it sets, and why each one is there:

**Data volume, mounted by its stable name.** The kernel's `sdX` names follow discovery order and are not guaranteed across boots; Hetzner's `by-id` name is. `nofail` keeps the server bootable and reachable over SSH when the volume is missing — without it a missing volume drops the boot into emergency mode, reachable from the console only.

```
# /etc/fstab
/dev/disk/by-id/scsi-0HC_Volume_<volume-id> /var/lib/docker/volumes ext4 defaults,nofail 0 2
```

`nofail` alone would let Docker start on the empty `/var/lib/docker/volumes` directory of the root disk, and Postgres initialise a fresh database there. A drop-in, `/etc/systemd/system/docker.service.d/require-volumes.conf` (`RequiresMountsFor=/var/lib/docker/volumes` under `[Unit]`), makes Docker refuse to start until the volume is mounted. The `volume` role runs first, so on a new server Docker is never installed, and never started, before the volume is in place. Check with `findmnt --verify` and `systemctl show docker -p RequiresMountsFor`; a reboot is the only end-to-end test.

**Swap.** A 2 GB `/swapfile` in `fstab`, so a memory spike slows the box down instead of sending the OOM killer after Postgres; `vm.swappiness=10` (`/etc/sysctl.d/99-swappiness.conf`) keeps the kernel from paging out while RAM is still free.

**journald capped at 500 MB** (`/etc/systemd/journald.conf.d/size.conf`, `SystemMaxUse=500M`). The default ceiling is 10% of the filesystem, about 4 GB of the root disk; the journal held 1.4 GB when the cap went in. A few weeks of host logs still fit; the containers' logs are not in the journal (see the `x-logging` block above).

**Packages.** Docker Engine and the compose plugin from Docker's own apt repository, Nginx, Certbot with its Nginx plugin, git and `unattended-upgrades` — only the missing ones are installed, so a re-run never upgrades anything. `snapd`, `open-vm-tools` (VMware's agent, on a KVM host), `lxd-agent-loader`, `lxd-installer` and `docker-model-plugin` are purged: nothing here uses them, and `snapd` ran permanently with no snap installed. `/etc/apt/preferences.d/no-snapd` pins `snapd` to priority -1, so a package's recommends cannot bring it back. `multipath-tools` and `open-iscsi` stay although nothing uses them either: they sit in the storage path, and a few megabytes are not worth a risk to the volume's mount.

**Unattended security upgrades.** `APT::Periodic::Update-Package-Lists` and `APT::Periodic::Unattended-Upgrade` both `"1"` — Ubuntu's default, checked rather than assumed, since a fix like the Nginx one of 2026-11-18 lands through it.

**SSH, keys only.** The drop-in from *SSH* above, checked alone with `sshd -t -f` before it is written and with the whole configuration (`sshd -t`) before `systemctl reload ssh`; the run then asserts on `sshd -T` that the effective settings are the intended ones, since another drop-in sorting first would override it.

**The `deploy` user.** The CI deploys as `deploy`, never as root: an unprivileged account that owns the clone and is in the `docker` group. That group is root-equivalent, so the account bounds accidents and gives an audit trail, not containment. Its `authorized_keys` holds one key, `github-actions-deploy`, whose private half is the `VPS_SSH_KEY` secret on GitHub; the `deploy_user` role adds that key when it is missing and never removes one. The sudoers rule the deploy reloads Nginx with (see *Nginx* below) is written alongside, checked with `visudo -c` before it lands.

The deploy logs `deploy` into GHCR on every run, so no registry login is set up by hand.

**The deploy clone — `docker/` only.** The images come from the registry; the server needs the compose files and the configs they mount, and nothing else. A sparse checkout (`git clone --sparse`, then `git sparse-checkout set --cone docker`) keeps the deploy's `git fetch`, `git reset` and `git diff` working while writing only `docker/` (plus the repository's root-level files, which cone mode always keeps) to `/opt/beyondthearc`, owned by `deploy`.

`/opt/beyondthearc/.env` is not in git, and the run only reports it missing: start from `.env.example` and fill in each value. `SENTRY_AUTH_TOKEN` stays out of it — only the CI build uses that token, and no running container does.

**The database volume.** `postgres_data` is `external: true` in the prod overlay, so `docker compose down -v` cannot delete it — and so compose will not create it either. The `app` role creates it when it is missing.

**Nginx version.** `server_tokens off;` in `/etc/nginx/nginx.conf` (Ubuntu ships the line commented out; the `nginx` role uncomments it). Without it, every response that reaches Nginx directly — any request to the server's IP — announces the exact Nginx and distribution version.

**The Nginx site.** `/etc/nginx/sites-enabled/beyondthearc`, a symlink into the clone (see *Nginx* below). The `nginx` role links it only once the certificate the file names exists, since `nginx -t` rejects the file before that, and removes the link again if `nginx -t` fails.

**SSH host key.** Not Ansible's job — it is how the CI side checks the server. The deploy pins the server's ed25519 host key in the `VPS_HOST_KEY` secret (see the comment in `.github/workflows/ci.yml`). A key copied from a first SSH connection is only as trustworthy as that connection, so compare it over a channel that is not SSH — the Hetzner console:

```bash
ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub          # on the server, from the console
glab variable get VPS_HOST_KEY | ssh-keygen -lf -          # locally
```

The two `SHA256:` fingerprints must match. A rebuilt server has a new host key, so `VPS_HOST_KEY` has to be replaced, and checked this way, before the first deploy.

### Rebuilding the server from zero

From an empty Hetzner project to a serving site, in order. No data is restored: the static data is a migration and the match data is regenerated by the scheduler (see [`data-pipeline.md`](./data-pipeline.md)). The order matters in two places — the volume before Docker, the certificate before the Nginx site — and the playbook enforces both.

1. **Hetzner console.** Create a CX23 running Ubuntu 24.04 with your SSH key for `root`. Create a volume formatted ext4 with **manual** mounting — automatic mounting writes its own `fstab` line under `/mnt`, a second mount of the same disk — and attach it; its id is in `ls /dev/disk/by-id/` (`scsi-0HC_Volume_<id>`). Attach `firewall-1`, or recreate it from the rules in *VPS* above.
2. **Root password.** Reset it from the console (Rescue → Reset root password), store it in the password manager, and log in once through the console to prove it works (see the keyboard-layout trap in *SSH*). It is the way back in when SSH breaks.
3. **Provision.** From the maintainer's machine: give the new address to the `bta-prod-compose` entry in `~/.ssh/config` and connect once with plain `ssh` to record its host key; set the new volume's device in `infra/ansible/inventory/group_vars/compose/main.yml`; then

   ```bash
   infra/ansible/ansible.sh ansible-playbook playbooks/compose.yml --diff
   ```

   Two `WARNING` lines are expected on this first run: no `.env`, no certificate. A volume Hetzner did not format stops the run instead of being formatted: on a new, empty volume run `mkfs.ext4 /dev/disk/by-id/scsi-0HC_Volume_<id>` on the server, then the playbook again. The `postgres_backup` role needs nothing more: its token is in the SOPS-encrypted group vars.

4. **`.env`.** Create `/opt/beyondthearc/.env` (owner `deploy`, mode 600) from `.env.example`: `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_URL`, `FRONTEND_URL`, `NEXT_PUBLIC_API_URL`, `INTERNAL_API_URL`, `SENTRY_DSN`, `REGISTRY_IMAGE`, `GRAFANA_ROOT_URL`, `GRAFANA_PASSWORD`, `SMTP_HOST`, `GMAIL_ADDRESS`, `GMAIL_APP_PASSWORD`. The deploy writes `IMAGE_TAG` itself.
5. **DNS.** In Cloudflare, point the `beyondthearc.app`, `www` and `grafana` records at the new address, still proxied. The zone's settings — SSL/TLS Full (strict), the two Access applications, the crawler blocks — belong to the zone, not the server, and carry over; if the zone itself were lost, *DNS and TLS* below lists them, and the `Grafana ACME` bypass has to exist before the next step.
6. **Certificate.** `certbot certonly --nginx -d beyondthearc.app -d www.beyondthearc.app -d grafana.beyondthearc.app`. The `nginx` authenticator answers the HTTP-01 challenge on port 80, through Cloudflare, and renews the certificate the same way. Not yet exercised on a rebuild: if validation fails because the challenge cannot reach the origin, set the three records to DNS-only and open port 80 to all in `firewall-1` for the issuance, then put both back.
7. **Provision again.** The same command: it now links the Nginx site and reloads Nginx. A run with `--check --diff` must then report `changed=0` and no `WARNING`.
8. **GitHub Actions secrets.** `VPS_HOST` (the new address) and `VPS_HOST_KEY` (the new host key, checked through the console as in *SSH host key* above). `VPS_USER`, `VPS_SSH_KEY`, `DEPLOY_REGISTRY_USER` and `DEPLOY_REGISTRY_TOKEN` stay as they are when the same key and token are reused.
9. **Deploy.** Re-run the deploy of `main`'s latest pipeline (Operate → Environments → production). The `migrate` service creates the schema and seeds the static data; the scheduler starts generating matches. Check `https://beyondthearc.app/api/health`, Grafana through Access, and `certbot renew --dry-run`.

Not covered: the `planetcurio` site on the same Nginx belongs to another project and is rebuilt from that one.

---

## DNS and TLS

DNS is managed through Cloudflare, which also acts as the nameserver authority for `beyondthearc.app`. The TLS setup is split depending on the subdomain:

**Every record is proxied through Cloudflare (orange cloud)** — `beyondthearc.app`, `www.beyondthearc.app` and `grafana.beyondthearc.app`. The zone's SSL/TLS mode is **Full (strict)**: Cloudflare terminates the visitor's TLS on its edge, then opens a second TLS connection to Nginx and verifies the origin's Let's Encrypt certificate, so an expired or wrongly-named origin certificate takes the site down. Cloudflare talks HTTP/1.1 to the origin; Nginx has HTTP/2 off.

**Grafana sits behind Cloudflare Access.** A Zero Trust self-hosted application (`Grafana`, team `tiny-tree-2362`, Free plan) covers `grafana.beyondthearc.app`: a visitor must first prove an allowed email address with a one-time PIN on `tiny-tree-2362.cloudflareaccess.com`, then still logs in to Grafana itself. A second application, `Grafana ACME`, covers only the path `/.well-known/acme-challenge/` with a **Bypass / Everyone** policy, and has to stay: the one Let's Encrypt certificate covers all three names, Certbot's `nginx` authenticator answers the HTTP-01 challenge on each, and an Access login page in front of that path would fail the renewal for the main site too. Checked with `certbot renew --dry-run --cert-name beyondthearc.app` after Access was enabled. Both applications live in the Cloudflare dashboard (Zero Trust → Access controls → Applications), not in this repository.

---

## Compose file structure

The stack uses a base-plus-override pattern across four Compose files:

| File                       | Purpose                                                                         |
| -------------------------- | ------------------------------------------------------------------------------- |
| `docker-compose.yml`       | Base definitions: all services, ports, environment variables, networks, volumes |
| `docker-compose.dev.yml`   | Dev overrides: source-mounted volumes, dev build targets, hot reload            |
| `docker-compose.prod.yml`  | Prod overrides: prebuilt registry images, `NODE_ENV=production`, external volume |
| `docker-compose.sonar.yml` | Standalone SonarQube instance for local code quality analysis                   |

In development, the base and dev files are merged:

```
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml --env-file .env up -d --build
```

In production, the base and prod files are merged instead. The prod override replaces the `build` directives with prebuilt images pulled from the container registry (`REGISTRY_IMAGE` in the VPS `.env`), so no build step runs on the VPS.

A `Makefile` wraps these commands for convenience — `make up-dev`, `make up-prod`, `make down`, and so on.

Every third-party image in the base file names an exact version (`postgres:18.7`, `grafana/grafana:13.0.13`, `prom/prometheus:v3.11.2`…), never `latest` or a bare major. The deploy pulls only the four application images, so a floating tag is not upgraded by deploys but by whichever later `pull` or server rebuild happens to run — a version nobody chose, at a time nobody picked. An upgrade is an MR that changes the tag; the deploy's `up -d` recreates the service on it. The CI's integration and boot-check Postgres use the same `postgres:18.7`, so tests run the version production does. Promtail is end-of-life upstream (superseded by Grafana Alloy) and stays pinned at its last 3.6 release until it is replaced.

---

## Services

### frontend

A Next.js 15 application served on port 3000.

In development, the source directory is bind-mounted into the container and the dev server runs with hot reload. In production, the image is built in CI, pushed to the container registry, and pulled onto the VPS — no build happens on the server.

`NEXT_PUBLIC_API_URL` and `FRONTEND_URL` are passed as both build args and runtime env vars; `INTERNAL_API_URL` is a runtime env var only. The `NEXT_PUBLIC_` prefix makes the API URL available in the browser bundle. `INTERNAL_API_URL` is used for server-side rendering inside the Docker network, where the frontend container reaches the backend directly by service name rather than going through Nginx. `SENTRY_AUTH_TOKEN` is passed as a BuildKit secret mount, exposed only to the `npm run build` step — it is needed at build time for Sentry source map upload and never enters the image config or its layers (a build arg would persist in the image metadata in the registry).

### backend

A NestJS 11 application served on port 4000.

In development, the source directory is bind-mounted and the NestJS dev server runs with watch mode. In production, the prebuilt image from the container registry is used.

The backend depends on `database` and receives `DATABASE_URL`, `FRONTEND_URL`, and `SENTRY_DSN` at runtime. `FRONTEND_URL` is the CORS allowlist and is **required in production** — it is the only origin allowed there, so the backend throws at boot when it is missing instead of starting with an allowlist no browser can match.

### database

The official `postgres:18.7` image, unmodified. Schema and static reference data are applied by the `migrate` service (below), not by the database container — standing up the stack for the first time still produces a fully seeded database with no additional steps, but the mechanism is Prisma Migrate rather than init scripts, so it also works against an *existing* database.

Data is persisted in a `postgres_data` named volume. In production this volume is declared `external: true`, which prevents `docker-compose down` or `docker-compose up --build` from recreating it. Compose therefore never creates it either — a deliberate safeguard against accidental data loss — so it must exist before the first deployment; the `app` Ansible role creates it (see *Host setup*).

It is backed up nightly at 04:00 Paris time to the Cloudflare R2 bucket `bta-db-backups` (EU jurisdiction): a full `pg_dump -Fc -Z zstd:3`, `match_events` included, encrypted on the host to the maintainer's age public key, so the host can write a backup and never read one. Measured on 2026-11-27: 270 s and 1.26 GB for a 9.7 GB database, with the 2 vCPU close to saturated meanwhile. Seven dailies (`daily/`) and four weeklies (`weekly/`, Monday's dump) are kept; the bucket's lock rules forbid deleting or overwriting a backup before the end of its retention, and its lifecycle rules delete it a day later. The host's token has object access to that bucket only and cannot change those rules. The job is the `postgres_backup` Ansible role (`infra/ansible/`); the bucket and its rules are in `infra/terraform/cloudflare/r2.tf`; the Grafana rule *Database Backup Missing* fires when no backup has succeeded for 26 hours; `infra/ansible/restore-test.sh` restores the latest one on the maintainer's machine and compares it with production.

### migrate

A one-shot service built from the backend Dockerfile's `migrate` target (the dependency stage plus `prisma migrate deploy` as the command). It waits for the database health check, applies any pending migrations, and exits; `backend` and `scheduler` declare `depends_on: service_completed_successfully` on it, so application code never runs against a schema that is behind it.

### scheduler

A Python 3.14 container running the long-running data pipeline. It connects directly to PostgreSQL via psycopg and handles season generation and match simulation. It has no exposed port — it is an internal worker only.

`restart: unless-stopped` ensures the scheduler comes back after crashes or VPS reboots. The pipeline is designed to be restart-safe: on startup it resets any matches left in `generating` state from a previous crash, then resumes polling. See [`data-pipeline.md`](./data-pipeline.md) for the full pipeline architecture.

The scheduler runs as a non-root user (`appuser`) created in the Dockerfile.

### prometheus

Scrapes metrics from the backend, `node-exporter` and `cadvisor`, and drives the availability probes through `blackbox-exporter`. Retains data for 15 days (`--storage.tsdb.retention.time=15d`). Configuration is mounted from `docker/config/prometheus.yml`.

Resource limits are set to 0.5 CPU and 512MB RAM to prevent the observability stack from crowding out the application services on the single VPS.

### loki

Receives logs forwarded by Promtail and stores them in a persistent volume. Configuration is mounted from `docker/config/loki.yml`. Runs as a non-root user (`10001:10001`) as required by the official Grafana image.

Same 0.5 CPU / 512MB resource limits as Prometheus.

### promtail

Ships container logs to Loki. Mounts the Docker socket (`/var/run/docker.sock`) read-only to discover container log streams automatically. Also mounts `/var/log` for system logs. Configuration is mounted from `docker/config/promtail.yml`.

### grafana

Serves dashboards and alerting on port 3001. Datasources and dashboards are provisioned automatically from `docker/config/grafana/provisioning`, so the Grafana instance comes up fully configured — no manual setup required after deployment.

SMTP is configured via environment variables (`GF_SMTP_*`) to enable email alerting through Gmail. In production, `GF_SERVER_ROOT_URL` is also set (via the prod override) so that Grafana generates correct URLs in alert notifications.

Resource limit: 0.5 CPU / 512MB RAM, with `GOMEMLIMIT=400MiB`. **The two belong together** — Grafana is a Go process, and the Go runtime does not read the container's memory limit. Set only the cgroup limit and the runtime grows its heap past it until the kernel kills the process, which is what happened under the previous 256MB cap: 10 OOM kills in 11 days, every one at ~259 MB, while Grafana's actual steady state was 171 MB RSS on a 75 MB live heap. `GOMEMLIMIT` is the ceiling the garbage collector works to, so raising or lowering `memory` means moving it too.

### node-exporter

Exposes host-level metrics (CPU, memory, disk, network) to Prometheus. Mounts `/proc`, `/sys`, and the root filesystem read-only. Has no exposed port — Prometheus scrapes it internally by service name. Its textfile collector reads `/var/lib/node_exporter/textfile_collector/` on the host, where the database backup job writes its last success.

### cadvisor

Exposes per-container CPU, memory and OOM-kill metrics to Prometheus, labelled by Compose service. Runs unprivileged with `/dev/kmsg` passed as a device, mounts only `/sys` and `/var/run` (the Docker socket) read-only — not the host root, which as root it could read `.env` through — and is capped at 128 MB / 0.25 CPU. No exposed port. See `docs/observability.md` for what it measures and how it is trimmed.

### blackbox-exporter

Probes services that expose no metrics of their own, which is the only way they can be monitored at all: the frontend, the database and (were it ever added) the scheduler. Prometheus hands it a target per scrape and it reports `probe_success` — an HTTP GET for the frontend and the backend's `/api/health`, a TCP handshake for Postgres. Configuration is mounted from `docker/config/blackbox.yml`; no exposed port, scraped internally by service name.

No resource limit, matching `node-exporter` — it holds no data and does one request per target per scrape interval. Measured cost: **41 series** against a 2,361-series head.

### sonarqube (separate compose file)

SonarQube is defined in its own `docker-compose.sonar.yml` and is not part of the main application stack. It is used locally for code quality analysis and connects to `my_network` as an external network so it can reach the application containers if needed. It is never deployed to the VPS.

Resource limits are higher than the other observability services (2 CPU / 4GB RAM) because SonarQube's embedded Elasticsearch requires it.

---

## Dockerfiles

### frontend and backend — multi-stage builds

Both the frontend and backend Dockerfiles share a `base` stage and produce a minimal runtime image:

```
base  →  dev    (bind-mounted source, dev server)
      →  build  (copied source, compiled output)
      →  prod   (runtime artifacts only, non-root)
```

The `base` stage installs dependencies (`npm ci`) so they are cached separately from the source copy. In the `dev` target the source is not copied into the image at all — it is bind-mounted at runtime instead. The `build` stage copies the source in and runs `npm run build`. The `prod` stage starts from a fresh `node:24-alpine`, contains no build toolchain or source, and runs as the unprivileged `node` user:

- **backend** — copies `dist/` from the build stage and installs production dependencies only. `tsc-alias` rewrites the TypeScript path aliases at build time, so the app runs under plain `node dist/main` with no Nest CLI in the image. Prisma 7's CLI toolchain (declared as a production dependency of `@prisma/client` but unused at runtime) is stripped from `node_modules`, along with the WASM query compilers of databases other than PostgreSQL.
- **frontend** — uses Next.js `output: "standalone"`: the image contains the self-contained `server.js`, the traced subset of `node_modules`, `.next/static`, and `public/`, and runs `node server.js`.

The Compose dev override sets `build.target: dev` to select the dev stage. The prod override bypasses the build entirely by substituting a prebuilt registry image.

The backend Dockerfile additionally runs `npx prisma generate` in the base stage so the Prisma client is generated as part of the dependency installation layer.

### migrations — Prisma Migrate

Migrations live in `src/backend/prisma/migrations/` — `0_init` (the full baseline, including trigger and partial-index SQL that Prisma's schema language cannot express) and `1_seed_static_data` (the reference-data seed), plus one directory per schema change after that. `prisma migrate deploy` (run by the `migrate` service) applies whatever the `_prisma_migrations` table says is missing, which is what makes schema changes reach an already-provisioned database — the failure mode where a change only exists on freshly-built databases is gone by construction.

### scheduler — non-root Python

The scheduler Dockerfile creates a dedicated `appuser` group and user and sets `PYTHONPATH` so that all Python package imports resolve from the pipeline root without needing relative imports or `sys.path` manipulation.

---

## Networking

All containers share a single Docker bridge network (`my_network`). Services communicate by container name. The frontend container uses `INTERNAL_API_URL` (`http://backend:4000/api` inside the network) for server-side API calls, while browser-side calls use `NEXT_PUBLIC_API_URL` (the public URL via Nginx).

---

## Nginx

Nginx runs on the VPS host (not as a Docker container) and reverse-proxies inbound traffic to the appropriate container. The backend is not on a separate subdomain — it is proxied under the `/api/` path on the main domain.

The config is **`docker/nginx/beyondthearc.conf`** in this repository. `/etc/nginx/sites-enabled/beyondthearc` is a symlink to the deploy clone's copy, so a deploy puts the new file in place with everything else, and a rollback reverts it with everything else. When a deploy changes it, `docker/deploy.sh` runs `nginx -t` and then `systemctl reload nginx`; a file `nginx -t` rejects fails the deploy, and the running Nginx keeps serving the previous config. Edit it in the repository, never on the server: the next deploy resets the clone to the deployed commit and discards the edit. The `planetcurio` site on the same Nginx belongs to another project and is not in this repository.

The deploy runs as `deploy`, not root, so the reload needs one sudoers rule, in `/etc/sudoers.d/deploy-nginx`:

```
deploy ALL=(root) NOPASSWD: /usr/sbin/nginx -t, /usr/bin/systemctl reload nginx
```

Those two commands exactly, nothing else. It grants nothing `deploy` lacks — the account is already root-equivalent through the `docker` group — but it keeps the deploy from needing a root shell. The script reloads only while the symlink points into the clone, so a server set up without it keeps working, untouched.

| Request                     | Proxied to                      |
| --------------------------- | ------------------------------- |
| `beyondthearc.app/`         | `localhost:3000` (frontend)     |
| `beyondthearc.app/api/`     | `localhost:4000/api/` (backend) |
| `grafana.beyondthearc.app/` | `localhost:3001` (Grafana)      |

All HTTP traffic is redirected to HTTPS. Security headers are set on the main app server block, so they cover both the frontend and the API, and every one carries `always`, so error responses (a 404 from the API, a 502 while a container restarts) get them too — without it Nginx adds a header to 2xx and 3xx responses only: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-XSS-Protection: 0` (the legacy filter is switched off, as current browsers recommend) and a `Content-Security-Policy`:

```
default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https://a.tile.openstreetmap.org; connect-src 'self' https://a.tile.openstreetmap.org;
worker-src 'self' blob:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

The external origins are the OpenStreetMap tile server the clubs map draws from (`ClubsMap.tsx`) — MapLibre fetches tiles and paints them through `blob:` URLs and runs a `blob:` worker. Sentry needs no entry: it reports through the same-origin `/monitoring` tunnel. `'unsafe-inline'` in `script-src` is for the inline scripts Next.js emits without a nonce. A change that loads anything from another origin — a new tile server, a font, an analytics script — needs this header updated in the same step, or the browser blocks it.

**The visitor's address.** Every request reaches Nginx from a Cloudflare edge, so `$remote_addr` would be Cloudflare's address — in the access log and in the `X-Real-IP` header passed to the containers. `docker/nginx/cloudflare-realip.conf`, included in each server block, has Nginx take the visitor's address from `CF-Connecting-IP`, and only on connections from Cloudflare's ranges, so a client reaching the origin some other way cannot set it. Checked on `nginx:1.24`: the header from a listed source is logged as the client; the same header from an unlisted one is ignored. It is included per server block rather than at `http` level because the other site on this Nginx is not part of this repository.

**Grafana's headers come from two places, deliberately.** Grafana itself sends `X-Content-Type-Options: nosniff` and `X-Frame-Options: deny`, so its Nginx block adds only what Grafana lacks — `Referrer-Policy` and `Strict-Transport-Security`, both `always`; a second copy of a header Grafana already sends would arrive twice. Its session cookie's `Secure` flag and the switched-off legacy `X-XSS-Protection` are Grafana settings (`GF_SECURITY_COOKIE_SECURE`, `GF_SECURITY_X_XSS_PROTECTION=false`) in `docker-compose.prod.yml` only: locally Grafana runs over plain HTTP, where a `Secure` cookie would make the login impossible.

The Grafana block additionally sets `Upgrade` and `Connection` headers to support WebSocket connections, which Grafana uses for live dashboard updates.

TLS certificates for `beyondthearc.app` and `grafana.beyondthearc.app` are issued by Let's Encrypt and stored under `/etc/letsencrypt/live/beyondthearc.app/`. Every request uses them: in Full (strict) mode Cloudflare connects to Nginx over TLS and verifies this certificate. Certbot renews it with its `nginx` authenticator; see the Access bypass above for why the challenge path must stay reachable.

---

## Volumes

| Volume            | Service    | Notes                                                              |
| ----------------- | ---------- | ------------------------------------------------------------------ |
| `postgres_data`   | database   | Declared `external: true` in prod to prevent accidental recreation; one season of generated data is its bulk |
| `prometheus_data` | prometheus | Metric storage, 15-day retention                                   |
| `loki_data`       | loki       | Log storage                                                        |
| `grafana_data`    | grafana    | Dashboard state and provisioning                                   |

---

## Operational commands

The Makefile exposes several utility targets beyond the core up/down/build cycle:

| Target                      | Purpose                                               |
| --------------------------- | ----------------------------------------------------- |
| `make psql`                 | Open a PostgreSQL shell inside the database container |
| `make logs-scheduler`       | Tail scheduler logs                                   |
| `make reset-failed-matches` | Reset failed matches back to `scheduled` for retry    |
| `make season-progress`      | Show how many leagues have been fully seeded          |
| `make match-progress`       | Show match counts grouped by status                   |

---

## Known limitations

**No staging environment.** The dev environment is local and there is no hosted environment between it and production. Infrastructure changes (Compose config, Nginx, Prometheus rules) cannot be tested before going live on the VPS. See [`architecture.md`](./architecture.md) for more on this constraint.

**Host setup is applied by hand, not enforced.** The Ansible playbook reproduces it and `--check --diff` reports drift, but nothing runs it on a schedule or in CI (the runners hold no server access), so a change made on the server and not in the roles is found only by the next check. The Compose roles have run for real only in `--check` on this host, which was configured before them; their fresh-host paths (first `fstab` entry, first clone, first site link), the first certificate issuance through Cloudflare and a reboot remain untested. The roles shared with the k3s host (journald, packages, unattended upgrades, SSH) did run on a fresh server, the CX33, on 2026-11-27.


**No resource limits on application containers.** Only the observability services (Prometheus, Loki, Grafana, cAdvisor) have CPU and memory limits defined. The application services (frontend, backend, scheduler) do not, which means a runaway process could starve the observability stack on the constrained CX23.

**Cloudflare's ranges are two hand-kept copies.** The firewall's 80/443 rules and `docker/nginx/cloudflare-realip.conf` both list Cloudflare's IP ranges as they stood on 2026-11-18, and nothing checks either against https://www.cloudflare.com/ips/. A range Cloudflare adds later would see its traffic to the origin refused by the firewall — a partial outage with no error on our side — and, once the firewall is updated, logged under the edge's address until the Nginx file is too.
