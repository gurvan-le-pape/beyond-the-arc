# CI/CD

> How code moves from a local branch to production: the CI pipeline, image build and push process, and automated deployment to the VPS.

---

## Overview

CI/CD is handled entirely by a single GitHub Actions workflow (`.github/workflows/ci.yml`). It runs on every push and pull request, executes all checks in parallel, and — on a successful push to `main` — builds production Docker images, pushes them to GitHub Container Registry (GHCR), and deploys them to the VPS over SSH.

There is no separate staging environment. A push to `main` that passes CI goes straight to production.

---

## Workflow structure

The workflow is composed of eight jobs:

```
backend-lint ───────┐
backend-test ───────┼── sonarcloud ─┐
backend-build ──────┤               ├── deploy (main only)
frontend-lint ──────┤               │
frontend-typecheck ─┤───────────────┘
frontend-build ─────┘
```

All check jobs run in parallel. `sonarcloud` depends on `backend-test` to consume the coverage report. `deploy` depends on all six check jobs and only runs on a push to `main`.

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

Downloads the `backend-coverage` artifact and runs a SonarCloud scan using the `SonarSource/sonarcloud-github-action`. The scan uses `fetch-depth: 0` on checkout so SonarCloud has full git history for accurate blame and new-code analysis. Requires the `SONAR_TOKEN` repository secret.

### deploy

Runs only on push to `main`, after all six check jobs pass. It has four steps:

1. **Log in to GHCR** — authenticates using `GITHUB_TOKEN` (automatically available, no manual secret needed).
2. **Build and push backend image** — builds the `prod` target of `docker/backend/Dockerfile` and pushes `ghcr.io/<repository>/backend:latest` plus a `:<git sha>` tag.
3. **Build and push frontend image** — builds the `prod` target of `docker/frontend/Dockerfile` with two build args from repository secrets (`NEXT_PUBLIC_API_URL`, `FRONTEND_URL`) and `SENTRY_AUTH_TOKEN` passed as a BuildKit secret, and pushes `ghcr.io/<repository>/frontend:latest` plus a `:<git sha>` tag.
4. **Deploy via SSH** — connects to the VPS using `appleboy/ssh-action` and runs a deploy script (10-minute timeout).

---

## Deploy script

The SSH deploy step runs the following sequence on the VPS:

```bash
cd /opt/beyondthearc
git pull
echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
# pin this commit's images (IMAGE_TAG is read by docker-compose.prod.yml)
sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=<git sha>/' .env   # appended if absent
docker compose --env-file .env \
  -f docker/docker-compose.yml \
  -f docker/docker-compose.prod.yml \
  pull frontend backend
docker compose --env-file .env \
  -f docker/docker-compose.yml \
  -f docker/docker-compose.prod.yml \
  up -d
docker system prune -f
```

`git pull` updates the Compose files and any config on the VPS before pulling images — this ensures the running configuration always matches the repository state. Only the `frontend` and `backend` images are pulled; the `database` and `scheduler` images are built from source and are not stored in GHCR, so they are not affected by the pull step. `docker system prune -f` removes dangling images and unused build cache to keep disk usage in check on the 40GB local disk.

The `up -d` command restarts only containers whose image has changed. Containers running unchanged images (database, scheduler, observability stack) are left running.

---

## Secrets

| Secret                | Used by    | Purpose                                                                   |
| --------------------- | ---------- | ------------------------------------------------------------------------- |
| `GITHUB_TOKEN`        | deploy     | Authenticate with GHCR to push and pull images (auto-provided by Actions) |
| `SONAR_TOKEN`         | sonarcloud | Authenticate with SonarCloud                                              |
| `SENTRY_AUTH_TOKEN`   | deploy     | Upload source maps to Sentry during frontend image build                  |
| `NEXT_PUBLIC_API_URL` | deploy     | Public API URL baked into the frontend bundle at build time               |
| `FRONTEND_URL`        | deploy     | Frontend origin URL passed to the frontend build                          |
| `VPS_HOST`            | deploy     | IP address or hostname of the VPS                                         |
| `VPS_USER`            | deploy     | SSH username on the VPS                                                   |
| `VPS_SSH_KEY`         | deploy     | Private SSH key for VPS access                                            |

`GITHUB_TOKEN` is automatically provided by GitHub Actions and does not need to be created manually. All other secrets are configured in the repository settings under Actions secrets.

---

## Image versioning and rollback

Every deploy pushes each image with two tags: `latest` and the git commit SHA. `docker-compose.prod.yml` references `${IMAGE_TAG:-latest}`, and the deploy script persists `IMAGE_TAG=<git sha>` into the VPS `.env` — so production always runs a pinned, recorded image, and a later manual `compose up` cannot silently jump to a newer `latest`.

**Rollback** — on the VPS, set `IMAGE_TAG` in `/opt/beyondthearc/.env` to any previous commit SHA, then:

```bash
docker compose --env-file .env -f docker/docker-compose.yml -f docker/docker-compose.prod.yml pull frontend backend
docker compose --env-file .env -f docker/docker-compose.yml -f docker/docker-compose.prod.yml up -d
```

Note that this rolls back the images only — if the bad deploy also changed Compose files or Nginx config, those need reverting separately (`git checkout <sha>` in the repo clone).

---

## Known limitations

**No staging deployment.** The deploy job targets production directly. There is no equivalent job that deploys to a staging environment first, because no hosted staging environment exists.

**Database and scheduler images are not pushed to GHCR.** These images are built from source on the VPS via `docker compose up --build` (or rebuilt manually). This is acceptable for the database image (which changes rarely) but means scheduler changes require a manual rebuild step on the VPS rather than the same pull-and-restart flow used for the frontend and backend.

**No smoke test after deployment.** The pipeline has no post-deploy health check. A failed deployment (container crash, misconfigured env var) would not be caught by CI — it would surface through Sentry or Grafana alerting instead.

**Frontend build in CI does not use production build args.** The `frontend-build` job builds without `NEXT_PUBLIC_API_URL` and related vars. If a build failure is caused by a missing env var rather than a code error, it would only surface in the `deploy` job rather than the earlier `frontend-build` check.
