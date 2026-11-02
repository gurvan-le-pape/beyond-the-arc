# CI/CD

> How code moves from a local branch to production: the CI pipeline, image build and push process, and automated deployment to the VPS.

---

## Overview

CI/CD is handled entirely by a single GitHub Actions workflow (`.github/workflows/ci.yml`). It runs on every push and pull request, executes all checks in parallel, and — on a successful push to `main` — builds production Docker images, pushes them to GitHub Container Registry (GHCR), and deploys them to the VPS over SSH.

Every job runs on four self-hosted runners on the developer's machine (see [Runners](#runners)); none uses GitHub's hosted runners.

There is no separate staging environment. A push to `main` that passes CI goes straight to production.

---

## Runners

The runners are four containers, `wsl-1` to `wsl-4`, from GitHub's official `ghcr.io/actions/actions-runner` image, run by a Compose project in `~/github-runner/` inside WSL — outside this repository, like any machine's runner config. Jobs select them with `runs-on: [self-hosted, wsl]`; `.github/actionlint.yaml` declares the `wsl` label. A runner takes one job at a time, so four containers is four jobs in parallel.

- **Start them with `./start.sh`**, not a bare `docker compose up`: it fetches a one-hour registration token through `gh` and passes the host Docker socket's group id. A runner registers only on its first start; the registration lives in its `/home/runner` volume, so restarts and WSL reboots (`restart: unless-stopped`) need no token. To add a fifth, add a `wsl-5` service and run `./start.sh` again.
- **Persistent, not ephemeral.** The home directory survives between jobs, which keeps `~/.npm`, the setup-node/setup-python tool cache and the Docker layer cache warm — hence no `cache:` on `setup-node`. It also means a secret written under `~` would outlive the job, so the deploy writes its SSH key, `known_hosts`, Docker credentials and the Sentry token under `$RUNNER_TEMP`, which the runner empties after every job.
- **The host Docker socket is mounted**, so `deploy` builds against the host daemon and its layer cache, with plain `docker build` — no buildx builder, no cache export. The socket is root-equivalent on the host, so the runners must never run code from strangers: the repository requires approval for every workflow run from an outside contributor's fork, and the default `GITHUB_TOKEN` is read-only.
- **They only run while WSL is up.** A job queued while it is down waits for a runner, for up to 24 hours. That includes `audit.yml`'s Monday cron.
- **They update themselves** when GitHub publishes a new runner version; the image tag in `compose.yml` is only what a new volume starts from.

---

## Workflow structure

There are two workflows. `ci.yml` is composed of fourteen jobs — thirteen checks and the deploy:

```
backend-lint ──────────┐
backend-test ──────────┼── sonarcloud
backend-build ─────────┤
frontend-lint ─────────┤
frontend-typecheck ────┤
frontend-messages ─────┼────────────── deploy (main only)
frontend-test ─────────┤
frontend-build ────────┤
python-test ───────────┤
openapi-drift ─────────┤
barrels-drift ─────────┘
migration-immutability   (PRs only, not a deploy gate)
```

All check jobs run in parallel, four at a time. `sonarcloud` depends on `backend-test` to consume the coverage report; it is **not** a deploy gate (`continue-on-error`), and neither is `migration-immutability`. `deploy` depends on the eleven jobs shown feeding into it and only runs on a push to `main`.

`audit.yml` is the second workflow and holds one job, `npm-audit`. It is separate for the sake of its `schedule` trigger: a newly published advisory needs no push to become true, and putting a `schedule` on `ci.yml` would run all eleven of its jobs weekly to reach this one.

---

## CI jobs

### backend-lint

Runs ESLint against the NestJS source. Uses Node.js 24 (matching the backend's runtime version) with `npm ci` and a dependency cache keyed to `src/backend/package-lock.json`.

### backend-test

Runs the backend test suite with coverage enabled (`--coverage --coverageReporters=lcov`). The resulting `lcov.info` file is uploaded as an artifact named `backend-coverage`, which the `sonarcloud` job downloads and passes to SonarCloud for coverage reporting.

### backend-build

Compiles the NestJS application (`npm run build`) to verify the TypeScript build succeeds independently of the test run.

### frontend-lint

Runs ESLint against the Next.js source. Uses Node.js 24 (the frontend's target version).

### frontend-typecheck

Runs `tsc --noEmit` (via `npm run typecheck`) as a separate job from the build. This provides a fast type-safety signal without waiting for the full Next.js build.

### frontend-build

Runs `next build` to verify the production build compiles and exports successfully. Note that this build runs without the `NEXT_PUBLIC_API_URL`, `FRONTEND_URL`, and `SENTRY_AUTH_TOKEN` build args — those are only injected in the `deploy` job's Docker build step where the actual production image is constructed.

### sonarcloud

Downloads the `backend-coverage` artifact and runs a SonarCloud scan using `SonarSource/sonarqube-scan-action` (successor of the deprecated `sonarcloud-github-action`). The scan uses `fetch-depth: 0` on checkout so SonarCloud has full git history for accurate blame and new-code analysis. Requires the `SONAR_TOKEN` repository secret.

**The frontend is excluded from coverage, and that is a deliberate, temporary exclusion.** Only the backend produces an lcov report, so without the exclusion every one of the frontend's ~24,000 lines counts as uncovered: project coverage sits at 25%, the gate's `new_coverage >= 80` condition fails on every PR touching the frontend, and the gate is permanently ERROR. A check that can never be green cannot report a regression in the five conditions that do work — that is the cost being paid, not the untested frontend itself, which is tracked separately. `sonar-project.properties` names the removal condition inline: `src/frontend/**` comes out of `sonar.coverage.exclusions` the moment a frontend test runner lands. The gate remains advisory either way (see the dependency graph above), so this changes what a red mark *means*, not what it blocks.

### npm-audit (workflow `audit.yml`)

Runs `npm audit` against all three lockfiles — the root, `src/backend` and `src/frontend`. Three separate runs, because there are no npm workspaces here. It skips `npm ci` entirely: `npm audit` resolves against the lockfile and the registry, not against an installed tree.

Triggers are `pull_request`, `workflow_dispatch`, and a **weekly schedule** (Mondays 07:00 UTC). The schedule is the reason this lives outside `ci.yml`: an advisory is published without anyone pushing, so the run that catches it has to be on a timer. Weekly rather than daily, because an advisory seen six days sooner is no more actionable in a project with no on-call, and a daily red badge becomes wallpaper.

Each run writes a severity table to the job summary and **fails only on a `critical` advisory**. High and moderate advisories are common in transitive devDependencies and mostly unreachable here, so failing on them would stop unrelated work every week until the badge meant nothing.

The job is **advisory**: it is in a different workflow from `deploy`, so it cannot gate it even by accident. The trade-off is deliberate and it is the whole design question — a blocking audit means a fresh advisory in a transitive devDependency blocks deploys of unrelated work, while a purely decorative one gets ignored (`sonarcloud`, which is also non-gating, sat red for thirty days). Failing on `critical` only is the middle: rare enough that a red check still means *go and look*.

### deploy

Runs only on push to `main` (or a manual `workflow_dispatch` on `main`), after the eleven check jobs in its `needs:` list pass. It has four steps:

1. **Log in to GHCR** — with `GITHUB_TOKEN` (`packages: write`), its credentials kept under `$RUNNER_TEMP` rather than the runner's persistent `~/.docker`.
2. **Build images** — plain `docker build` against the host daemon: the `prod` and `migrate` targets of `docker/backend/Dockerfile` (the second shares the first's cached layers), `docker/python-script/Dockerfile` for the scheduler, and the `prod` target of `docker/frontend/Dockerfile` with `NEXT_PUBLIC_API_URL` and `FRONTEND_URL` as build args and `SENTRY_AUTH_TOKEN` as a BuildKit secret. Each is tagged `ghcr.io/<repository>/<image>:latest` and `:<git sha>`. Without a build and an `image:` for the scheduler the VPS would run whatever it last built locally, with no tag to roll back to.
3. **Push images** — this commit's two tags of each image, by name, never `--all-tags`: the daemon is long-lived, so `--all-tags` would re-send every SHA tag it has ever built. The SHA tag is then removed locally; `:latest` keeps the image.
4. **Deploy via SSH** — plain `ssh` from the runner (no third-party action holds the key): the step normalises the deploy key (CRLF, missing final newline) and fails early if `ssh-keygen` cannot read it, pins the host key from the `VPS_HOST_KEY` secret (it is not discovered with `ssh-keyscan` — see *The deploy account* below), and pipes the deploy script to `bash -s` on the VPS as the `deploy` user (10-minute timeout). Secrets are passed as env vars, never expanded into the script text; the registry token travels as the first line of stdin.

---

## Deploy script

The SSH deploy step runs the following sequence on the VPS:

```bash
cd /opt/beyondthearc
git pull
echo "$DEPLOY_REGISTRY_TOKEN" | docker login ghcr.io -u "$DEPLOY_REGISTRY_USER" --password-stdin
# pin this commit's images (IMAGE_TAG is read by docker-compose.prod.yml)
sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=<git sha>/' .env   # appended if absent
docker compose --env-file .env \
  -f docker/docker-compose.yml \
  -f docker/docker-compose.prod.yml \
  pull frontend backend migrate scheduler
docker compose --env-file .env \
  -f docker/docker-compose.yml \
  -f docker/docker-compose.prod.yml \
  up -d
docker image prune -af   # drop previous deploys' :SHA-tagged images
# restart Prometheus/blackbox, then Grafana, if this deploy changed their config
# poll backend /api/health/ready (up to 60s) and check the frontend
# renders /en — exit 1 (failing the pipeline) if either is unhealthy
docker system prune -f   # only after the health checks pass
```

`git pull` updates the Compose files and any config on the VPS before pulling images — this ensures the running configuration always matches the repository state. The `frontend`, `backend`, `migrate` and `scheduler` images are pulled; the `database` service uses the official `postgres` image, so it is unaffected by the pull step. The subsequent `up -d` runs the one-shot `migrate` service (applying any pending Prisma migrations) before `backend` and `scheduler` start. `docker system prune -f` removes dangling images and unused build cache to keep disk usage in check on the 40GB local disk.

The `up -d` command restarts only containers whose image has changed. Containers running unchanged images (database, scheduler, observability stack) are left running.

### The deploy account

The script above runs as **`deploy`**, an unprivileged account that owns `/opt/beyondthearc` and belongs to the `docker` group. That group membership is what lets it run every `docker` and `docker compose` command in the script; the `git pull` works because `origin` is an HTTPS remote on a public repository, so no credential is involved.

One property of this worth knowing before relying on it: **`docker` group membership is root-equivalent.** Anyone who can talk to the Docker socket can start a container that bind-mounts `/`. So `deploy` is an audit-trail and accident-blast-radius boundary — a stray `rm` in the script hits only files it owns — and **not** a containment boundary against a leaked `VPS_SSH_KEY`. Bounding what a stolen key can *do* needs an `authorized_keys` forced command restricting it to a fixed script.

Two prunes with different jobs: `docker image prune -af` (after the pull and `up -d`) removes images not referenced by any container — necessary because every deploy pins `:SHA`-tagged images, which are never *dangling* and would otherwise accumulate one pair per merge until the disk fills (this is what tripped the 90% disk health threshold in July 2026). Images used by running or stopped containers are kept, and every tag remains in GHCR, so rollback via `IMAGE_TAG` still re-pulls fine. It runs after the pull, not before: pruning first means a registry that refuses the login, or a tag that was never pushed, lands on a host whose previous images are already gone — production down with nothing local to roll back to. `docker system prune -f` (after the health checks) clears dangling images and build cache produced by the deploy itself.

### The VPS `.env`

`/opt/beyondthearc/.env` holds the Grafana admin password, the Gmail app password and `DATABASE_URL`. It is owned by `deploy` and **must be mode `600`** — on a rebuilt VPS, `chmod 600` it as soon as it is created:

```bash
chmod 600 /opt/beyondthearc/.env
```

The default `644` is not merely untidy here. `node-exporter` mounts `/:/rootfs:ro` (`docker/docker-compose.yml`) and runs as `nobody` (uid 65534), so at `644` a container whose job is host CPU and disk metrics can read every secret in that file; at `600` it cannot, and it never needed to. Nothing legitimate loses access — no service declares `env_file`, the file is not bind-mounted into any container, and the deploy script reaches it as `deploy`, which owns it. The script's `sed -i` rewrite of `IMAGE_TAG` preserves the mode (GNU sed replaces the file but copies its permissions across), so the setting survives every deploy rather than reverting at the next one.

---

## Secrets

| Secret                | Used by    | Purpose                                                                   |
| --------------------- | ---------- | ------------------------------------------------------------------------- |
| `GITHUB_TOKEN`        | deploy     | Push images to GHCR from the runner (auto-provided by Actions)            |
| `DEPLOY_REGISTRY_USER`  | deploy   | GitHub username the VPS logs in to GHCR with                              |
| `DEPLOY_REGISTRY_TOKEN` | deploy   | Classic PAT with `read:packages` only, for the VPS's GHCR login           |
| `SONAR_TOKEN`         | sonarcloud | Authenticate with SonarCloud                                              |
| `SENTRY_AUTH_TOKEN`   | deploy     | Upload source maps to Sentry during frontend image build                  |
| `NEXT_PUBLIC_API_URL` | deploy     | Public API URL baked into the frontend bundle at build time               |
| `FRONTEND_URL`        | deploy     | Frontend origin URL passed to the frontend build                          |
| `VPS_HOST`            | deploy     | IP address or hostname of the VPS                                         |
| `VPS_USER`            | deploy     | SSH username on the VPS — the unprivileged `deploy` account               |
| `VPS_SSH_KEY`         | deploy     | Private SSH key for VPS access                                            |
| `VPS_HOST_KEY`        | deploy     | Pinned host key material (`ssh-ed25519 AAAA…`), not a `known_hosts` line  |

`GITHUB_TOKEN` is automatically provided by GitHub Actions and does not need to be created manually. It is not what the VPS logs in with: it expires with the job, and the VPS keeps its login, so a later manual `docker compose pull` there needs a token that is still valid — hence the separate `DEPLOY_REGISTRY_TOKEN`. All other secrets are configured in the repository settings under Actions secrets.

---

## Image versioning and rollback

Every deploy pushes each image with two tags: `latest` and the git commit SHA. `docker-compose.prod.yml` references `${IMAGE_TAG:-latest}`, and the deploy script persists `IMAGE_TAG=<git sha>` into the VPS `.env` — so production always runs a pinned, recorded image, and a later manual `compose up` cannot silently jump to a newer `latest`.

**Rollback** — on the VPS, set `IMAGE_TAG` in `/opt/beyondthearc/.env` to any previous commit SHA, then:

```bash
docker compose --env-file .env -f docker/docker-compose.yml -f docker/docker-compose.prod.yml pull frontend backend
docker compose --env-file .env -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up -d
```

This rolls back the **images** only. The other two things a bad deploy can change need separate handling, and they are not alike:

- **Compose files and anything else in the repo** — the VPS holds a clone at `/opt/beyondthearc` that the deploy script `git pull`s, so `git checkout <sha> -- docker/` restores them. **Undo it before the next deploy**, which starts with that `git pull`: the pull exits 1 both on a detached `HEAD` (`git checkout <sha>` with no path — "You are not currently on a branch") and on uncommitted local changes to a file the incoming commit touches. Either way the rollback becomes a second outage, in the deploy meant to end the first one.
- **Nginx** — not in this repository at all, so there is no committed previous version to return to and `git checkout` cannot reach it. It runs on the host from `/etc/nginx/sites-available/beyondthearc`; reverting means editing that file directly, then `nginx -t && systemctl reload nginx` as root. See [*Nginx config is not version-controlled*](./infrastructure.md#known-limitations).

---

## Known limitations

**No staging deployment.** The deploy job targets production directly. There is no equivalent job that deploys to a staging environment first, because no hosted staging environment exists.

**The database image is not pushed to GHCR.** It is the official `postgres` image, pulled from Docker Hub by the base Compose file, so it needs no build step here. The other four — frontend, backend, migrate and scheduler — are all published and pinned.

**Health check, not rollback.** The deploy script fails the pipeline if the new containers don't come up healthy (backend readiness endpoint polled for 60s, frontend page render checked), and prints the rollback instruction — but the rollback itself is manual (set `IMAGE_TAG` in `.env` to the previous SHA and rerun pull + up). Automatic rollback on health-check failure would be the next step if manual proves too slow in practice.

**Frontend build in CI does not use production build args.** The `frontend-build` job builds without `NEXT_PUBLIC_API_URL` and related vars. If a build failure is caused by a missing env var rather than a code error, it would only surface in the `deploy` job rather than the earlier `frontend-build` check.

**A `high` advisory stops nothing.** `npm-audit` fails only on `critical`, and it cannot gate `deploy` at all. As of 2026-08-13 that leaves 31 high-severity advisories standing across the three lockfiles (root 4, backend 16, frontend 11), most of them in transitive devDependencies and unreachable in this deployment. They are visible in the job summary of every run and nothing forces them to be addressed — which is the accepted cost of not blocking unrelated deploys on them.
