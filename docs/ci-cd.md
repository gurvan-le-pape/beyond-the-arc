# CI/CD

> How code moves from a local branch to production: the CI pipeline, image build and push process, and automated deployment to the VPS.

---

## Overview

CI/CD is GitHub Actions: `.github/workflows/ci.yml`, plus `audit.yml` for the dependency audit. Every job runs on self-hosted runners (see [Runners](#runners)). `ci.yml` runs on every pull request and every push to `main`, and can be started by hand (`workflow_dispatch`). On `main`, once the checks pass, it builds the production images, pushes them to the GitHub Container Registry (GHCR), and deploys them to the VPS over SSH.

There is no separate staging environment. A push to `main` that passes CI goes straight to production.

A ruleset on `main` refuses direct pushes, force-pushes and deletion: every change arrives through a pull request. It also requires the fourteen checks `deploy` waits for to pass on the pull request's latest commit, which does not have to be up to date with `main`. The ruleset names them by job `name:`, so renaming one blocks every merge until the ruleset is updated.

---

## Pipeline structure

`ci.yml` has twenty jobs:

```
backend-lint ──────────┐
backend-test ──────────┼── sonarcloud     (advisory)
backend-integration ───┤
backend-build ─────────┤
backend-boot ──────────┤
frontend-lint ─────────┤
frontend-typecheck ────┤
frontend-messages ─────┼────────────── deploy (main only)
frontend-test ─────────┤
frontend-build ────────┤
python-test ───────────┤
openapi-drift ─────────┤
barrels-drift ─────────┤
dependency-rules ──────┘
migration-immutability   (pull requests only, not a deploy gate)
squawk                   (pull requests only, advisory)
quality-report           (advisory)
ruff-report              (advisory)
```

Jobs run in parallel, as many at once as there are runners. `sonarcloud` needs `backend-test` and `frontend-test` for their coverage reports. `deploy` lists its fourteen gates in `needs:`, so the advisory jobs, which are `continue-on-error`, cannot hold a release.

A new commit on a pull request cancels the run in progress. Runs on `main` are never cancelled while running, since that could leave the VPS half-deployed. GitHub keeps one run waiting per group, so when several merges land during a run, the latest one replaces the others in the queue and carries their commits.

The Node jobs use the composite action `.github/actions/setup-app`, which installs Node 24 and runs `npm ci --prefer-offline` in the given directory. It has no `cache:`, because each runner's own `~/.npm` persists between jobs.

---

## CI jobs

### backend-lint

`prisma generate`, then `npm run lint` and `npm run format:check`. The generate step is not optional: the ESLint config is type-aware, the generated client is gitignored and Prisma 7 no longer creates it on install, so without it the whole Prisma surface types as `any` and rules like `no-floating-promises` go quiet on exactly the calls that matter.

### backend-test

`npm test -- --coverage --coverageReporters=lcov`. The `lcov.info` it writes is kept as an artifact for a week and consumed by `sonarcloud`.

### backend-build

`npm run build` (`prisma generate && nest build`), independent of the test run.

### frontend-lint, frontend-typecheck, frontend-messages, frontend-test, frontend-build

One script each: `npm run lint` + `npm run format:check`, `npm run typecheck`, `npm run check:messages` (the `en`/`fr` message catalogues agree), `npm run test` (Vitest), `npm run build`.

The build runs without `NEXT_PUBLIC_API_URL`, `FRONTEND_URL` and `SENTRY_AUTH_TOKEN` — those are only injected in `deploy`'s image build — and without a backend, which is why every page that fetches server-side is `force-dynamic` (see [`frontend.md`](./frontend.md)).

### python-test

The scheduler's pytest suite, on Python 3.14 (the version of the scheduler image's base) with `requirements-dev.txt`.

### openapi-drift

Builds the backend, regenerates `docs/openapi.json`, regenerates the frontend's `shared/types/api.generated.ts` from it, and fails if either differs from the commit. A DTO change cannot reach production without its regenerated contract.

### barrels-drift

`npm run barrels` regenerates every barrel and the job fails on any difference, after a `git add -A` so a barrel that should exist but was never committed counts as drift.

### migration-immutability

Pull requests only. Fails when the pull request modifies or deletes a file under `src/backend/prisma/migrations/` (additions are unrestricted), because `prisma migrate deploy` does not checksum applied migrations and would silently ignore the edit everywhere it already ran. A title containing `[refresh-static-data]` lets the sanctioned `make refresh-static-data` rewrite through, with a warning that the description must carry the catch-up SQL — see [`data-pipeline.md`](./data-pipeline.md).

### npm-audit

The one job of `audit.yml`. Runs `npm audit --json` against all three lockfiles — the root, `src/backend` and `src/frontend` — without `npm ci`, since `npm audit` resolves against the lockfile and the registry. Writes the counts to the run summary and **fails only on a `critical` advisory**, or when a report cannot be parsed (a network failure must not read as "clean"). High and moderate advisories are common in transitive devDependencies and mostly unreachable here; failing on them would turn the job permanently red.

It cannot gate `deploy`, which is in the other workflow. A blocking audit would let a fresh advisory in a transitive devDependency stop unrelated work; a decorative one gets ignored (`sonarcloud`, also non-gating, once sat red for thirty days). Failing on `critical` only is the middle.

It runs on pull requests and on Mondays at 07:00 UTC, because a newly published advisory needs no push to become true. It is a separate workflow so that the schedule does not start every job of `ci.yml`.

### squawk

Pull requests only. Lints the `migration.sql` files the pull request adds for statements that lock or break a running database (a constraint without `NOT VALID`, a dropped column), using `.squawk.toml`. Already-applied migrations are not linted: they cannot change. Advisory, because a finding can be the right trade on a small table.

### backend-integration

Runs the suites under `src/backend/test/integration` against a `postgres:18.4` container, the version production runs, started in the runner's network namespace (see [Runners](#runners)). `prisma migrate deploy` builds the schema from the migrations, so the CHECK constraints and indexes under test are the ones production runs. The unit run excludes these suites and needs no database.

`match-constraints` and `team-constraints` drive the CHECK constraints and keys with SQL, each test in a transaction it rolls back. `list-queries` runs the list services through real Prisma, and `box-score-reads` the services that read box scores, on fixtures they commit and remove. `it.failing` marks known bugs: such a test fails the suite once the behaviour is fixed, so it has to become a plain `it`.

To run them locally, against a throwaway database:

```bash
docker run -d --rm --name integ-pg -e POSTGRES_PASSWORD=test -e POSTGRES_DB=beyondthearc_test -p 55434:5432 postgres:18.4
cd src/backend
export DATABASE_URL=postgres://postgres:test@localhost:55434/beyondthearc_test
npx prisma migrate deploy && npm run test:integration
```

The harness refuses a database whose name does not end in `_test`, so a stray `DATABASE_URL` cannot reach the dev or production data.


### backend-boot

Builds the `prod` and `migrate` targets of `docker/backend/Dockerfile` on the host Docker daemon, migrates a throwaway `postgres:18.4`, starts the production image and requests `/api/health/live` and `/api/leagues` (`scripts/ci/backend-boot-check.sh`). A container that exits or doesn't answer within 60 s fails the job, which prints its logs.

This is the only check that runs what ships. Every other job has dev dependencies installed and none starts the app, so they miss a crash at startup, a package missing from the production dependencies and a file the `prod` stage strips by hand.

It uses `/api/health/live` rather than `/api/health` because the full check includes a disk threshold, which would make the job depend on free space on the runner. To run it locally, from the repo root: `sh scripts/ci/backend-boot-check.sh`.

### dependency-rules

Runs `npm run quality:deps` from the repo root: dependency-cruiser (`.dependency-cruiser.cjs`) over each application, failing on a cycle, on `shared/utils` importing `shared/components`, or on `common` importing `modules`. Type-only imports count. Needs only the root install.

### quality-report, ruff-report

Measurements, read in the job log. `quality-report` runs `npm run quality` from the repo root: knip (unused files, exports, dependencies; `knip.json` in each application) and jscpd (`.jscpd.json`). `ruff-report` runs ruff's pyflakes and complexity checks over the scheduler (`src/backend/db/python/ruff.toml`). Findings do not fail either job. The one exception is duplication above jscpd's 3% threshold, which `continue-on-error` keeps from failing the run, as it does a tool that crashes. To make one of them blocking, remove `--no-exit-code` (knip) or `--exit-zero` (ruff), and add the job to `deploy`'s `needs:`.

### The lint baseline

`no-unnecessary-condition`, `complexity` (10), `max-lines-per-function` (80), `max-params` (4), `max-depth` (3) and `no-nested-conditional` are `error` in both ESLint configs, for application code. The violations that predate them are recorded in `eslint-suppressions.json` in each application, as a count per file and rule, and ESLint reads that file by default, so the lint jobs need no flag. The file is written by ESLint and ignored by Prettier.

- **More violations than the count**, in a listed file or a new one, fail lint and report every occurrence in that file for that rule.
- **Fewer violations than the count** make lint exit 2, until `npm run lint:prune` lowers the count and the file is committed. The baseline can only shrink.
- **Renaming a listed file** moves it out of the baseline: its violations are reported under the new path. Fix them, or record them again with `npx eslint <path> --suppress-rule <rule>` from the application directory. `lint:prune` then drops the entry for the old path, which lint does not report on its own.

Lint output no longer shows baselined violations. `eslint-suppressions.json` is where to read them.

`next build` does not read that file, so `next.config.js` turns its own ESLint pass off with `eslint.ignoreDuringBuilds`. It still type-checks. Linting belongs to `frontend-lint`, which `deploy` waits on.

### sonarcloud

`SonarSource/sonarqube-scan-action` with full git history (`fetch-depth: 0`) and both coverage artifacts, from `backend-test` and `frontend-test`. Configuration lives in `sonar-project.properties`; the project is `gurvan-le-pape_beyond-the-arc`. It runs while the repository variable `SONAR_ENABLED` is `true`, is `continue-on-error`, and is absent from `deploy`'s `needs:` — a failed quality gate reports without blocking a release.

**The frontend is measured.** `frontend-test` runs Vitest with `--coverage` and keeps `src/frontend/coverage/lcov.info`, whose paths start at the repository root (`src/frontend/app/…`) because that is where Sonar resolves them. Its harness renders components and hooks, so a pull request's new frontend lines can meet `new_coverage >= 80` like the backend's. Sonar's frontend coverage scope matches what Vitest measures — `app/`, `features/`, `lib/`, `shared/` — by excluding the root-level bootstrap and config files and the test support (`testing/`, `*Fixtures.ts`); `sonar-project.properties` gives the reasoning inline.

### deploy

`main` only, after its fourteen gates pass, and only while the repository variable `DEPLOY_ENABLED` is `true`. It deploys to the GitHub environment `production`, so each run is recorded as a deployment, and it holds the `production` concurrency group: one deploy at a time. The host Docker socket means builds reuse a long-lived daemon's layer cache — no buildx builder, no cache export.

1. **Log in** to GHCR with the job's `GITHUB_TOKEN` (`packages: write`).
2. **Build four images**, each tagged `:<commit sha>` and `:latest` under `ghcr.io/gurvan-le-pape/beyond-the-arc`: `backend` (`prod` target of `docker/backend/Dockerfile`), `backend-migrate` (`migrate` target of the same file, sharing its cached layers), `scheduler` (`docker/python-script/Dockerfile`) and `frontend` (`prod` target, with `NEXT_PUBLIC_API_URL` and `FRONTEND_URL` as build args and `SENTRY_AUTH_TOKEN` as a BuildKit secret — never a build arg, which would persist in the pushed image config).
3. **Push** this commit's two tags by name, never `--all-tags` (the long-lived daemon would re-send every SHA it has ever built), then drop the local SHA tag.
4. **Deploy over SSH** — plain `ssh`, no third-party action. The job strips CRLF from `VPS_SSH_KEY` and restores a missing final newline, because OpenSSH rejects both with the same unhelpful `error in libcrypto`, and fails early if the key is still unusable. The host key is pinned from `VPS_HOST_KEY`, never learned with `ssh-keyscan`. The job then runs `docker/deploy.sh` in the server's clone, with the commit SHA, registry host and registry user as arguments and the registry token as the first line of stdin — never an argument, which would show in `ps` on the server.

The site answers 502 for under a minute while the containers are replaced: `frontend` waits for `backend` to be healthy before it starts.

---

## Deploy script

`docker/deploy.sh`, run on the VPS as `deploy` from the clone at `/opt/beyondthearc`, under `set -e`:

```bash
deploy.sh <commit-sha> <registry-host> <registry-user>   # token, if any, on stdin
pre_pull_head=$(git rev-parse HEAD)
git fetch origin && git reset --hard "$COMMIT_SHA"   # exactly this commit, never the branch tip
exec bash docker/deploy.sh "$@"   # the rest runs from that commit's copy
echo "$REGISTRY_TOKEN" | docker login "$REGISTRY_HOST" -u "$REGISTRY_USER" --password-stdin
export IMAGE_TAG="$COMMIT_SHA"   # read by docker-compose.prod.yml; beats .env
docker compose … pull frontend backend migrate scheduler
sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$COMMIT_SHA/" .env   # appended if absent; only after a good pull
docker compose … up -d
docker image prune -af   # after the pull, never before
# restart prometheus + blackbox-exporter if their config changed in this pull,
# then loki + promtail, then grafana if its alerting or datasource provisioning changed
# nginx -t then reload nginx (sudo -n) if docker/nginx/ changed and sites-enabled links into this clone
# poll backend /api/health/ready and frontend /en, 12 × 5 s each —
# exit 1 (failing the job) and print the last 50 log lines if either never answers
docker system prune -f   # only after both health checks pass
```

(`…` is `--env-file .env -f docker/docker-compose.yml -f docker/docker-compose.prod.yml`.)

The script lives in the `docker/` directory because that is all the server's sparse clone holds. It moves the clone to the deployed commit, then re-runs that commit's copy of itself, so a deploy that changes the script is carried out by the new version; the whole body sits in one `main` function, which bash parses before running any of it, so the checkout rewriting the file mid-run cannot change what the old copy does.

**A reset to the SHA, not a pull.** `git pull` follows the branch: a deploy started for one commit could pick up the configs of a later one, so the images and the files on disk came from different commits. It also refuses to run on a detached `HEAD` or over a local edit to a file the incoming commit touches — exactly the state a hand rollback leaves — which turned the next deploy into a second outage. `git fetch` then `git reset --hard <sha>` lands on the requested commit whatever the clone looked like, discards local edits to tracked files, and leaves `.env` alone (untracked and ignored). A SHA missing from `origin` fails before anything changes. The commit SHA must be 40 hex characters, or the script exits `2` before touching anything. Run by hand with nothing piped in, it skips the registry login and reuses the one the last deploy stored.

The checkout updates the Compose files and config before the images, so the running configuration always matches the deployed commit. The registry login uses a token of its own (`DEPLOY_REGISTRY_TOKEN`, a classic token with `read:packages`) rather than the job's `GITHUB_TOKEN`, which dies with the job and would break a later manual `pull`. The `database` service runs the official `postgres` image and is untouched by the pull. `up -d` runs the one-shot `migrate` service (`prisma migrate deploy`) before `backend` and `scheduler` start, and recreates only containers whose image or configuration changed.

**Pull first, prune second.** Every deploy pins `:SHA` tags, which are never dangling, so old images accumulate until the disk fills (this tripped the 90% disk threshold in July 2026) and `docker image prune -af` has to run. Run before the pull, a refused login or a missing tag would land on a host whose previous images are already gone — production down with nothing local to roll back to. After a successful pull, the same failure is a red run on an untouched host. Every tag stays in the registry, so rollback re-pulls by `IMAGE_TAG`.

**Conditional restarts.** Prometheus, the blackbox exporter, Loki, Promtail and Grafana's alerting and datasource provisioning read bind-mounted files only at startup, and `up -d` does not hash a mounted file's contents, so a changed scrape job or alert rule would land on disk and never load. The script diffs those paths between `pre_pull_head` and the new `HEAD` and restarts only what changed — Prometheus first, because an alert whose series does not exist yet reads NoData and the availability rules treat NoData as alerting. Unconditional restarts would also reset the alert `for:` clocks on every unrelated deploy. Nginx, which runs on the host, follows the same rule: when `docker/nginx/` changed and `/etc/nginx/sites-enabled/beyondthearc` links into this clone, the script runs `nginx -t` and then reloads Nginx, both through `sudo -n`.

**Retried health checks.** The frontend check is a retry loop like the backend's, and has to be: `frontend` waits for the backend to be healthy, so it starts *after* the first loop succeeds, and a single curl against a socket not yet listening would kill the script under `set -e` before it could report anything.

### The deploy account

The script above runs as **`deploy`**, an unprivileged account that owns `/opt/beyondthearc` and belongs to the `docker` group. That group membership is what lets it run every `docker` and `docker compose` command in the script; the `git fetch` works because `origin` is an HTTPS remote on a public repository, so no credential is involved.

One property of this worth knowing before relying on it: **`docker` group membership is root-equivalent.** Anyone who can talk to the Docker socket can start a container that bind-mounts `/`. So `deploy` is an audit-trail and accident-blast-radius boundary — a stray `rm` in the script hits only files it owns — and **not** a containment boundary against a leaked `VPS_SSH_KEY`. Bounding what a stolen key can *do* needs an `authorized_keys` forced command restricting it to a fixed script.

### The VPS `.env`

`/opt/beyondthearc/.env` holds the Grafana admin password, the Gmail app password and `DATABASE_URL`. It is owned by `deploy` and **must be mode `600`** — on a rebuilt VPS, `chmod 600` it as soon as it is created:

```bash
chmod 600 /opt/beyondthearc/.env
```

The default `644` is not merely untidy here. `node-exporter` mounts `/:/rootfs:ro` (`docker/docker-compose.yml`) and runs as `nobody` (uid 65534), so at `644` a container whose job is host CPU and disk metrics can read every secret in that file; at `600` it cannot, and it never needed to. Nothing legitimate loses access — no service declares `env_file`, the file is not bind-mounted into any container, and the deploy script reaches it as `deploy`, which owns it. The script's `sed -i` rewrite of `IMAGE_TAG` preserves the mode (GNU sed replaces the file but copies its permissions across), so the setting survives every deploy rather than reverting at the next one.

---

## Secrets and variables

Repository settings → Secrets and variables → Actions.

| Secret | Purpose |
| --- | --- |
| `VPS_HOST` | VPS address |
| `VPS_USER` | `deploy`, the unprivileged account described above |
| `VPS_SSH_KEY` | Private deploy key |
| `VPS_HOST_KEY` | Pinned host key material only (`ssh-ed25519 AAAA…`), not a `known_hosts` line |
| `DEPLOY_REGISTRY_USER` | GitHub username the VPS logs in to GHCR with |
| `DEPLOY_REGISTRY_TOKEN` | Classic token, `read:packages` only |
| `NEXT_PUBLIC_API_URL`, `FRONTEND_URL` | Frontend build args |
| `SENTRY_AUTH_TOKEN` | Source map upload, passed as a BuildKit secret |
| `SONAR_TOKEN` | SonarCloud |

| Variable | Purpose |
| --- | --- |
| `DEPLOY_ENABLED` | `deploy` is skipped unless it is `true` |
| `SONAR_ENABLED` | `sonarcloud` is skipped unless it is `true` |

---

## Image versioning and rollback

Every deploy pushes each image with two tags: `latest` and the git commit SHA. `docker-compose.prod.yml` references `${IMAGE_TAG:-latest}`, and the deploy script persists `IMAGE_TAG=<git sha>` into the VPS `.env` — so production always runs a pinned, recorded image, and a later manual `compose up` cannot silently jump to a newer `latest`.

**Rollback** — GitHub → **Actions → CI**, open an earlier `main` run that deployed and re-run its **Deploy to VPS** job, which GitHub allows for 30 days. Because the script resets the server's clone to the job's SHA, that commit's **images, Compose files and configs — the Nginx site included — come back together**; the conditional restarts compare against the commit being left, so a config the rollback reverts is reloaded. Returning to the latest is the same on the newest run. The next merge deploys `main` again.

The job rebuilds that commit's four images before deploying them. When minutes matter, the same rollback runs directly on the VPS, for a commit whose images are in GHCR; the stored login is reused:

```bash
bash /opt/beyondthearc/docker/deploy.sh <previous-sha> ghcr.io gurvan-le-pape
```

The images `docker/deploy.sh` needs are in GHCR only for commits deployed since 2026-11-24.

One thing a rollback does not undo:

- **Database migrations.** `prisma migrate deploy` only moves forward. Rolling the images back past a migration runs the old code against the new schema; a migration that drops or renames something the old code reads needs its own revert migration, shipped forward.

---

## Runners

Four containers, `wsl-1` to `wsl-4`, on the developer's machine, selected with `runs-on: [self-hosted, wsl]`. Their Compose project is `~/github-runner/` in WSL, outside the repository: GitHub's `actions-runner` image plus `dirmngr`, which the SonarQube scan action needs to verify the scanner's signature.

- **Start them with `./start.sh`**, never a bare `docker compose up`: it fetches the registration token and passes the Docker socket's group. A runner registers on its first start only; the registration lives in its `/home/runner` volume.
- **Each takes one job at a time.** A job queued while WSL is down waits up to 24 hours, `audit.yml`'s Monday run included.
- **They persist between jobs.** The npm, Node and Python caches stay warm, and a secret written under the home directory would outlive its job, so the deploy writes its credentials under `$RUNNER_TEMP`, which is emptied after each job.
- **They mount the host Docker socket,** which is root-equivalent on that machine. Workflows from outside contributors' forks need approval before they run, and the default `GITHUB_TOKEN` is read-only. Never approve a fork's run without reading its changes.
- **`services:` does not work on them.** A service's port is published on the Docker host, which is not a containerised runner's localhost. `backend-integration` starts PostgreSQL in the runner's own network namespace instead.
- **No job may use `ubuntu-latest`.** GitHub-hosted runners are not used. `.github/actionlint.yaml` declares the `wsl` label.

---

## GitLab fallback

`.gitlab-ci.yml` holds the same jobs for `gitlab.com/gurvan-le-pape/beyond-the-arc`, on its own runner (`wsl-local`). Nothing is mirrored there, and its `deploy` is skipped unless the CI/CD variable `GITLAB_DEPLOY` is `true`.

To deploy from GitLab: set GitHub's `DEPLOY_ENABLED` to `false`, push `main` to GitLab, and on the VPS set `REGISTRY_IMAGE` in `.env` to `registry.gitlab.com/gurvan-le-pape/beyond-the-arc` and the clone's `origin` to GitLab. Then set `GITLAB_DEPLOY` to `true` and run a pipeline on `main`. Never leave both variables on: both would deploy.

---

## Known limitations

**No staging deployment.** The deploy job targets production directly. There is no equivalent job that deploys to a staging environment first, because no hosted staging environment exists.

**The database image is not pushed to the registry.** It is the official `postgres` image, pulled from Docker Hub by the base Compose file, so it needs no build step here. The other four — frontend, backend, migrate and scheduler — are all published and pinned.

**Health check, not automatic rollback.** The deploy script fails the job if the new containers don't come up healthy (backend readiness endpoint polled for 60s, frontend page render checked) and says where to roll back from, but someone has to press the button. Rolling back automatically on a failed check would be the next step if that proves too slow in practice.

**Frontend build in CI does not use production build args.** The `frontend-build` job builds without `NEXT_PUBLIC_API_URL` and related vars. If a build failure is caused by a missing env var rather than a code error, it would only surface in the `deploy` job rather than the earlier `frontend-build` check.

**Images in GHCR are never removed.** Every deploy pushes four `:SHA` tags and nothing deletes the old ones.

**A `high` advisory stops nothing.** `npm-audit` fails only on `critical`, and it cannot gate `deploy` at all. As of 2026-11-03 that leaves 26 high-severity advisories standing (root 0, backend 14, frontend 12), most of them in transitive devDependencies. They are printed in the log of every run and nothing forces them to be addressed — the accepted cost of not blocking unrelated deploys on them.
