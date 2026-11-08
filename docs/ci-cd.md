# CI/CD

> How code moves from a local branch to production: the CI pipeline, image build and push process, and automated deployment to the VPS.

---

## Overview

CI/CD is one GitLab pipeline, `.gitlab-ci.yml`, executed on a self-hosted runner (`wsl-local`, docker executor, host Docker socket mounted). It runs on every merge request and every push to `main`, and can be started by hand from the UI (`web`). On `main`, once the checks pass, it builds the production images, pushes them to the project's GitLab container registry, and deploys them to the VPS over SSH. Runner registration, CI/CD variables and the VPS-side setup are in [`gitlab-migration.md`](./gitlab-migration.md).

There is no separate staging environment. A push to `main` that passes CI goes straight to production.

`.github/workflows/` is kept for an eventual return to GitHub and is **not executed**; nothing in it describes what runs today.

---

## Pipeline structure

Three stages — `check`, `analyze`, `deploy` — and twenty-one jobs:

```
backend-lint ──────────┐
backend-test ──────────┼── sonarcloud     (analyze, advisory)
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
migration-immutability   (merge requests only, not a deploy gate)
squawk                   (merge requests only, advisory)
npm-audit                (advisory, not a deploy gate)
quality-report           (analyze, advisory)
ruff-report              (analyze, advisory)
```

Every `check` job runs in parallel. `sonarcloud` needs `backend-test` for its coverage report. `deploy` lists its fourteen gates explicitly in `needs:` rather than waiting on the whole stage, so the advisory jobs cannot hold a release.

Workflow rules accept three sources — `merge_request_event`, a push to `main`, and `web` — and end in `when: never`, which stops a branch with an open merge request from producing two pipelines per commit. Every job is `interruptible` so a superseded pipeline can be cancelled, except `deploy`: cancelling a compose `up` mid-flight could leave the VPS half-deployed.

The Node jobs extend a `.setup-app` template: an `APP_DIR` variable picks the project, `npm ci --cache .npm --prefer-offline` installs it, and the npm cache is keyed on that project's `package-lock.json`. Jobs that need more than one project (`openapi-drift`, `barrels-drift`) carry their own install steps and caches.

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

The scheduler's pytest suite, on `python:3.14-slim` (the scheduler image's base) with `requirements-dev.txt`, pip cache keyed on that file.

### openapi-drift

Builds the backend, regenerates `docs/openapi.json`, regenerates the frontend's `shared/types/api.generated.ts` from it, and fails if either differs from the commit. A DTO change cannot reach production without its regenerated contract.

### barrels-drift

`npm run barrels` regenerates every barrel and the job fails on any difference, after a `git add -A` so a barrel that should exist but was never committed counts as drift.

### migration-immutability

Merge requests only. Fails when the merge request modifies or deletes a file under `src/backend/prisma/migrations/` (additions are unrestricted), because `prisma migrate deploy` does not checksum applied migrations and would silently ignore the edit everywhere it already ran. A title containing `[refresh-static-data]` lets the sanctioned `make refresh-static-data` rewrite through, with a warning that the description must carry the catch-up SQL — see [`data-pipeline.md`](./data-pipeline.md).

### npm-audit

Runs `npm audit --json` against all three lockfiles — the root, `src/backend` and `src/frontend` — without `npm ci`, since `npm audit` resolves against the lockfile and the registry. Prints the counts per lockfile and **fails only on a `critical` advisory**, or when a report cannot be parsed (a network failure must not read as "clean"). High and moderate advisories are common in transitive devDependencies and mostly unreachable here; failing on them would turn the job permanently red.

It is **advisory** twice over: `allow_failure: true`, so a red audit is a warning rather than a failed pipeline, and absent from `deploy`'s `needs:`. A blocking audit would let a fresh advisory in a transitive devDependency stop unrelated work; a decorative one gets ignored (`sonarcloud`, also non-gating, once sat red for thirty days). Failing on `critical` only is the middle.

It runs with every pipeline, not on a timer. A newly published advisory needs no push to become true, so a weekly scheduled run would catch it sooner in a quiet week; that needs every other job excluded from `schedule` pipelines first, or a scheduled pipeline on `main` would run the deploy.

### squawk

Merge requests only. Lints the `migration.sql` files the merge request adds for statements that lock or break a running database (a constraint without `NOT VALID`, a dropped column), using `.squawk.toml`. Already-applied migrations are not linted: they cannot change. `allow_failure: true`, because a finding can be the right trade on a small table.

### backend-integration

Runs the suites under `src/backend/test/integration` against a `postgres:18` service: `prisma migrate deploy` builds the schema from the migrations, so the CHECK constraints and indexes under test are the ones production runs. The unit run excludes these suites and needs no database.

`match-constraints` and `team-constraints` drive the CHECK constraints and keys with SQL, each test in a transaction it rolls back. `list-queries` runs the list services through real Prisma, and `box-score-reads` the services that read box scores, on fixtures they commit and remove. `it.failing` marks known bugs: such a test fails the suite once the behaviour is fixed, so it has to become a plain `it`.

To run them locally, against a throwaway database:

```bash
docker run -d --rm --name integ-pg -e POSTGRES_PASSWORD=test -e POSTGRES_DB=beyondthearc_test -p 55434:5432 postgres:18
cd src/backend
export DATABASE_URL=postgres://postgres:test@localhost:55434/beyondthearc_test
npx prisma migrate deploy && npm run test:integration
```

The harness refuses a database whose name does not end in `_test`, so a stray `DATABASE_URL` cannot reach the dev or production data.


### backend-boot

Builds the `prod` and `migrate` targets of `docker/backend/Dockerfile` on the host Docker daemon, migrates a throwaway `postgres:18`, starts the production image and requests `/api/health/live` and `/api/leagues` (`scripts/ci/backend-boot-check.sh`). A container that exits or doesn't answer within 60 s fails the job, which prints its logs.

This is the only check that runs what ships. Every other job has dev dependencies installed and none starts the app, so they miss a crash at startup, a package missing from the production dependencies and a file the `prod` stage strips by hand.

It uses `/api/health/live` rather than `/api/health` because the full check includes a disk threshold, which would make the job depend on free space on the runner. To run it locally, from the repo root: `sh scripts/ci/backend-boot-check.sh`.

### dependency-rules

Runs `npm run quality:deps` from the repo root: dependency-cruiser (`.dependency-cruiser.cjs`) over each application, failing on a cycle, on `shared/utils` importing `shared/components`, or on `common` importing `modules`. Type-only imports count. Needs only the root install.

### quality-report, ruff-report

Measurements, read in the job log. `quality-report` runs `npm run quality` from the repo root: knip (unused files, exports, dependencies; `knip.json` in each application) and jscpd (`.jscpd.json`). `ruff-report` runs ruff's pyflakes and complexity checks over the scheduler (`src/backend/db/python/ruff.toml`). Findings do not fail either job. The one exception is duplication above jscpd's 3% threshold, which `allow_failure` turns into a warning, as it does a tool that crashes. To make one of them blocking, remove `--no-exit-code` (knip) or `--exit-zero` (ruff), and add the job to `deploy`'s `needs:`.

### The lint baseline

`no-unnecessary-condition`, `complexity` (10), `max-lines-per-function` (80), `max-params` (4), `max-depth` (3) and `no-nested-conditional` are `error` in both ESLint configs, for application code. The violations that predate them are recorded in `eslint-suppressions.json` in each application, as a count per file and rule, and ESLint reads that file by default, so the lint jobs need no flag. The file is written by ESLint and ignored by Prettier.

- **More violations than the count**, in a listed file or a new one, fail lint and report every occurrence in that file for that rule.
- **Fewer violations than the count** make lint exit 2, until `npm run lint:prune` lowers the count and the file is committed. The baseline can only shrink.
- **Renaming a listed file** moves it out of the baseline: its violations are reported under the new path. Fix them, or record them again with `npx eslint <path> --suppress-rule <rule>` from the application directory. `lint:prune` then drops the entry for the old path, which lint does not report on its own.

Lint output no longer shows baselined violations. `eslint-suppressions.json` is where to read them.

`next build` does not read that file, so `next.config.js` turns its own ESLint pass off with `eslint.ignoreDuringBuilds`. It still type-checks. Linting belongs to `frontend-lint`, which `deploy` waits on.

### sonarcloud

`sonar-scanner` (`sonarsource/sonar-scanner-cli:11`) with full git history (`GIT_DEPTH: 0`) and the backend coverage artifact. Configuration lives in `sonar-project.properties`. `allow_failure: true` and absent from `deploy`'s `needs:` — a failed quality gate reports without blocking a release.

**The frontend is excluded from coverage, deliberately.** Only the backend produces an lcov report, so without the exclusion every frontend line counts as uncovered and the gate's `new_coverage >= 80` condition fails on every merge request touching the frontend — a check that can never be green cannot report a regression in the conditions that do work. `sonar-project.properties` states the removal condition inline.

### deploy

`main` only, on `docker:28-cli`, after its fourteen gates pass. The runner's host Docker socket means builds reuse a long-lived daemon's layer cache — no buildx, no dind, no cache export.

1. **Log in** to `$CI_REGISTRY` with the job's own `CI_REGISTRY_USER` / `CI_REGISTRY_PASSWORD`.
2. **Build four images**, each tagged `:$CI_COMMIT_SHA` and `:latest` under `$CI_REGISTRY_IMAGE`: `backend` (`prod` target of `docker/backend/Dockerfile`), `backend-migrate` (`migrate` target of the same file, sharing its cached layers), `scheduler` (`docker/python-script/Dockerfile`) and `frontend` (`prod` target, with `NEXT_PUBLIC_API_URL` and `FRONTEND_URL` as build args and `SENTRY_AUTH_TOKEN` as a BuildKit secret — never a build arg, which would persist in the pushed image config).
3. **Push** this commit's two tags by name, never `--all-tags` (the long-lived daemon would re-send every SHA it has ever built), then drop the local SHA tag.
4. **Deploy over SSH** — plain `ssh`, no third-party integration. `VPS_SSH_KEY` is a File variable; the job strips CRLF and restores a missing final newline before use, because OpenSSH rejects both with the same unhelpful `error in libcrypto`, and fails early with a readable message if the key is still unusable. The host key is pinned from `VPS_HOST_KEY`, never learned with `ssh-keyscan`. Secrets are never expanded into script text: the registry token is the first line of stdin, the non-secrets ride an env prefix on the ssh command.

---

## Deploy script

On the VPS, as `deploy`, under `set -e`:

```bash
cd /opt/beyondthearc
pre_pull_head=$(git rev-parse HEAD)
git pull
echo "$REGISTRY_TOKEN" | docker login "$REGISTRY_HOST" -u "$DEPLOY_REGISTRY_USER" --password-stdin
export IMAGE_TAG="$DEPLOY_TAG"   # read by docker-compose.prod.yml; beats .env
docker compose … pull frontend backend migrate scheduler
sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$DEPLOY_TAG/" .env   # appended if absent; only after a good pull
docker compose … up -d
docker image prune -af   # after the pull, never before
# restart prometheus + blackbox-exporter if their config changed in this pull,
# then grafana if its alerting provisioning changed
# poll backend /api/health/ready and frontend /en, 12 × 5 s each —
# exit 1 (failing the pipeline) and print the last 50 log lines if either never answers
docker system prune -f   # only after both health checks pass
```

(`…` is `--env-file .env -f docker/docker-compose.yml -f docker/docker-compose.prod.yml`.)

`git pull` updates the Compose files and config before the images, so the running configuration always matches the repository. The registry login uses a **deploy token** (`DEPLOY_REGISTRY_TOKEN`, `read_registry`) rather than the job token, which dies with the job and would break a later manual `pull`. The `database` service runs the official `postgres` image and is untouched by the pull. `up -d` runs the one-shot `migrate` service (`prisma migrate deploy`) before `backend` and `scheduler` start, and recreates only containers whose image or configuration changed.

**Pull first, prune second.** Every deploy pins `:SHA` tags, which are never dangling, so old images accumulate until the disk fills (this tripped the 90% disk threshold in July 2026) and `docker image prune -af` has to run. Run before the pull, a refused login or a missing tag would land on a host whose previous images are already gone — production down with nothing local to roll back to. After a successful pull, the same failure is a red pipeline on an untouched host. Every tag stays in the registry, so rollback re-pulls by `IMAGE_TAG`.

**Conditional restarts.** Prometheus, the blackbox exporter and Grafana's alerting provisioning read bind-mounted files only at startup, and `up -d` does not hash a mounted file's contents, so a changed scrape job or alert rule would land on disk and never load. The script diffs those paths between `pre_pull_head` and the new `HEAD` and restarts only what changed — Prometheus first, because an alert whose series does not exist yet reads NoData and the availability rules treat NoData as alerting. Unconditional restarts would also reset the alert `for:` clocks on every unrelated deploy.

**Retried health checks.** The frontend check is a retry loop like the backend's, and has to be: `frontend` waits for the backend to be healthy, so it starts *after* the first loop succeeds, and a single curl against a socket not yet listening would kill the script under `set -e` before it could report anything.

### The deploy account

The script above runs as **`deploy`**, an unprivileged account that owns `/opt/beyondthearc` and belongs to the `docker` group. That group membership is what lets it run every `docker` and `docker compose` command in the script; the `git pull` works because `origin` is an HTTPS remote on a public project, so no credential is involved.

One property of this worth knowing before relying on it: **`docker` group membership is root-equivalent.** Anyone who can talk to the Docker socket can start a container that bind-mounts `/`. So `deploy` is an audit-trail and accident-blast-radius boundary — a stray `rm` in the script hits only files it owns — and **not** a containment boundary against a leaked `VPS_SSH_KEY`. Bounding what a stolen key can *do* needs an `authorized_keys` forced command restricting it to a fixed script.

### The VPS `.env`

`/opt/beyondthearc/.env` holds the Grafana admin password, the Gmail app password and `DATABASE_URL`. It is owned by `deploy` and **must be mode `600`** — on a rebuilt VPS, `chmod 600` it as soon as it is created:

```bash
chmod 600 /opt/beyondthearc/.env
```

The default `644` is not merely untidy here. `node-exporter` mounts `/:/rootfs:ro` (`docker/docker-compose.yml`) and runs as `nobody` (uid 65534), so at `644` a container whose job is host CPU and disk metrics can read every secret in that file; at `600` it cannot, and it never needed to. Nothing legitimate loses access — no service declares `env_file`, the file is not bind-mounted into any container, and the deploy script reaches it as `deploy`, which owns it. The script's `sed -i` rewrite of `IMAGE_TAG` preserves the mode (GNU sed replaces the file but copies its permissions across), so the setting survives every deploy rather than reverting at the next one.

---

## Variables

The pipeline's CI/CD variables — VPS access, the pinned host key, the registry deploy token, the frontend build args, the Sentry and SonarCloud tokens — and what each is for are listed in [`gitlab-migration.md`](./gitlab-migration.md#cicd-variables). The registry push credentials (`CI_REGISTRY_USER`, `CI_REGISTRY_PASSWORD`) are injected by GitLab.

---

## Image versioning and rollback

Every deploy pushes each image with two tags: `latest` and the git commit SHA. `docker-compose.prod.yml` references `${IMAGE_TAG:-latest}`, and the deploy script persists `IMAGE_TAG=<git sha>` into the VPS `.env` — so production always runs a pinned, recorded image, and a later manual `compose up` cannot silently jump to a newer `latest`.

**Rollback** — on the VPS, set `IMAGE_TAG` in `/opt/beyondthearc/.env` to any previous commit SHA, then:

```bash
docker compose --env-file .env -f docker/docker-compose.yml -f docker/docker-compose.prod.yml pull frontend backend migrate scheduler
docker compose --env-file .env -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up -d
```

This rolls back the **images** only. The other two things a bad deploy can change need separate handling, and they are not alike:

- **Compose files and anything else in the repo** — the VPS holds a clone at `/opt/beyondthearc` that the deploy script `git pull`s, so `git checkout <sha> -- docker/` restores them. **Undo it before the next deploy**, which starts with that `git pull`: the pull exits 1 both on a detached `HEAD` (`git checkout <sha>` with no path — "You are not currently on a branch") and on uncommitted local changes to a file the incoming commit touches. Either way the rollback becomes a second outage, in the deploy meant to end the first one.
- **Nginx** — not in this repository at all, so there is no committed previous version to return to and `git checkout` cannot reach it. It runs on the host from `/etc/nginx/sites-available/beyondthearc`; reverting means editing that file directly, then `nginx -t && systemctl reload nginx` as root. See [*Nginx config is not version-controlled*](./infrastructure.md#known-limitations).

---

## Known limitations

**No staging deployment.** The deploy job targets production directly. There is no equivalent job that deploys to a staging environment first, because no hosted staging environment exists.

**The database image is not pushed to the registry.** It is the official `postgres` image, pulled from Docker Hub by the base Compose file, so it needs no build step here. The other four — frontend, backend, migrate and scheduler — are all published and pinned.

**Health check, not rollback.** The deploy script fails the pipeline if the new containers don't come up healthy (backend readiness endpoint polled for 60s, frontend page render checked), and prints the rollback instruction — but the rollback itself is manual (set `IMAGE_TAG` in `.env` to the previous SHA and rerun pull + up). Automatic rollback on health-check failure would be the next step if manual proves too slow in practice.

**Frontend build in CI does not use production build args.** The `frontend-build` job builds without `NEXT_PUBLIC_API_URL` and related vars. If a build failure is caused by a missing env var rather than a code error, it would only surface in the `deploy` job rather than the earlier `frontend-build` check.

**A `high` advisory stops nothing.** `npm-audit` fails only on `critical`, and it cannot gate `deploy` at all. As of 2026-11-03 that leaves 26 high-severity advisories standing (root 0, backend 14, frontend 12), most of them in transitive devDependencies. They are printed in the log of every run and nothing forces them to be addressed — the accepted cost of not blocking unrelated deploys on them.
