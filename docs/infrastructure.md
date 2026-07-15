# Infrastructure

> How Beyond The Arc is built, run, and served: VPS and DNS setup, Docker Compose configuration, individual service configurations, and Nginx.

---

## Overview

The entire stack runs on a single VPS as a set of Docker Compose containers. There is no Kubernetes, no container orchestration platform, and no horizontal scaling — the scope of the project does not require it, and the simplicity of a single-node setup makes it easier to reason about and operate.

All services share a single Docker bridge network (`my_network`) and communicate by service name. External traffic enters through Nginx, which runs on the VPS host and reverse-proxies to the frontend and backend containers.

---

## VPS

The server is a **Hetzner CX23** (2 vCPU, 4GB RAM, 40GB local disk) located in Nuremberg, Germany (eu-central). It runs Ubuntu and hosts all application and observability containers.

The Hetzner firewall allows inbound TCP on three ports only: 22 (SSH), 80 (HTTP), and 443 (HTTPS). All other ports — including the Docker service ports (3000, 4000, 5432, 9090, 3001) — are not exposed publicly. Nginx on the host is the sole external entry point; internal services are only reachable from within the VPS itself.

---

## DNS and TLS

DNS is managed through Cloudflare, which also acts as the nameserver authority for `beyondthearc.app`. The TLS setup is split depending on the subdomain:

**Main app (`beyondthearc.app`, `www.beyondthearc.app`)** — DNS records are proxied through Cloudflare (orange cloud). Cloudflare terminates TLS on its edge and forwards traffic to the VPS over HTTP. The server's real IP is hidden behind Cloudflare's proxy IPs.

**Grafana (`grafana.beyondthearc.app`)** — DNS record is DNS-only (grey cloud). TLS is terminated directly by Nginx on the VPS using a Let's Encrypt certificate managed by Certbot. The server's IP is publicly visible for this subdomain.

This split means two different certificate authorities are in play: Cloudflare for the main app, Let's Encrypt for Grafana. Cloudflare also provides DDoS protection and caching for the main app as a side effect of proxying.

---

## Compose file structure

The stack uses a base-plus-override pattern across four Compose files:

| File                       | Purpose                                                                         |
| -------------------------- | ------------------------------------------------------------------------------- |
| `docker-compose.yml`       | Base definitions: all services, ports, environment variables, networks, volumes |
| `docker-compose.dev.yml`   | Dev overrides: source-mounted volumes, dev build targets, hot reload            |
| `docker-compose.prod.yml`  | Prod overrides: prebuilt GHCR images, `NODE_ENV=production`, external volume    |
| `docker-compose.sonar.yml` | Standalone SonarQube instance for local code quality analysis                   |

In development, the base and dev files are merged:

```
docker-compose -f docker/docker-compose.yml -f docker/docker-compose.dev.yml --env-file .env up -d --build
```

In production, the base and prod files are merged instead. The prod override replaces the `build` directives with prebuilt images pulled from GHCR, so no build step runs on the VPS.

A `Makefile` wraps these commands for convenience — `make up-dev`, `make up-prod`, `make down`, and so on.

---

## Services

### frontend

A Next.js 15 application served on port 3000.

In development, the source directory is bind-mounted into the container and the dev server runs with hot reload. In production, the image is built in CI, pushed to GHCR, and pulled onto the VPS — no build happens on the server.

Three environment variables are passed as both build args and runtime env vars: `NEXT_PUBLIC_API_URL`, `INTERNAL_API_URL`, and `FRONTEND_URL`. The `NEXT_PUBLIC_` prefix makes the API URL available in the browser bundle. `INTERNAL_API_URL` is used for server-side rendering inside the Docker network, where the frontend container reaches the backend directly by service name rather than going through Nginx. `SENTRY_AUTH_TOKEN` is passed as a BuildKit secret mount, exposed only to the `npm run build` step — it is needed at build time for Sentry source map upload and never enters the image config or its layers (a build arg would persist in the image metadata on GHCR).

### backend

A NestJS 11 application served on port 4000.

In development, the source directory is bind-mounted and the NestJS dev server runs with watch mode. In production, the prebuilt image from GHCR is used.

The backend depends on `database` and receives `DATABASE_URL`, `FRONTEND_URL` (used for CORS), and `SENTRY_DSN` at runtime.

### database

The official `postgres:18` image, unmodified. Schema and static reference data are applied by the `migrate` service (below), not by the database container — standing up the stack for the first time still produces a fully seeded database with no additional steps, but the mechanism is Prisma Migrate rather than init scripts, so it also works against an *existing* database.

Data is persisted in a `postgres_data` named volume. In production this volume is declared `external: true`, which prevents `docker-compose down` or `docker-compose up --build` from recreating it. The volume must be created manually on the VPS before first deployment — this is a deliberate safeguard against accidental data loss.

### migrate

A one-shot service built from the backend Dockerfile's `migrate` target (the dependency stage plus `prisma migrate deploy` as the command). It waits for the database health check, applies any pending migrations, and exits; `backend` and `scheduler` declare `depends_on: service_completed_successfully` on it, so application code never runs against a schema that is behind it.

### scheduler

A Python 3.14 container running the long-running data pipeline. It connects directly to PostgreSQL via psycopg and handles season generation and match simulation. It has no exposed port — it is an internal worker only.

`restart: unless-stopped` ensures the scheduler comes back after crashes or VPS reboots. The pipeline is designed to be restart-safe: on startup it resets any matches left in `generating` state from a previous crash, then resumes polling. See [`data-pipeline.md`](./data-pipeline.md) for the full pipeline architecture.

The scheduler runs as a non-root user (`appuser`) created in the Dockerfile.

### prometheus

Scrapes metrics from the backend and `node-exporter`. Retains data for 15 days (`--storage.tsdb.retention.time=15d`). Configuration is mounted from `docker/config/prometheus.yml`.

Resource limits are set to 0.5 CPU and 512MB RAM to prevent the observability stack from crowding out the application services on the single VPS.

### loki

Receives logs forwarded by Promtail and stores them in a persistent volume. Configuration is mounted from `docker/config/loki.yml`. Runs as a non-root user (`10001:10001`) as required by the official Grafana image.

Same 0.5 CPU / 512MB resource limits as Prometheus.

### promtail

Ships container logs to Loki. Mounts the Docker socket (`/var/run/docker.sock`) read-only to discover container log streams automatically. Also mounts `/var/log` for system logs. Configuration is mounted from `docker/config/promtail.yml`.

### grafana

Serves dashboards and alerting on port 3001. Datasources and dashboards are provisioned automatically from `docker/config/grafana/provisioning`, so the Grafana instance comes up fully configured — no manual setup required after deployment.

SMTP is configured via environment variables (`GF_SMTP_*`) to enable email alerting through Gmail. In production, `GF_SERVER_ROOT_URL` is also set (via the prod override) so that Grafana generates correct URLs in alert notifications.

Resource limit: 0.5 CPU / 256MB RAM.

### node-exporter

Exposes host-level metrics (CPU, memory, disk, network) to Prometheus. Mounts `/proc`, `/sys`, and the root filesystem read-only. Has no exposed port — Prometheus scrapes it internally by service name.

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

The Compose dev override sets `build.target: dev` to select the dev stage. The prod override bypasses the build entirely by substituting a prebuilt GHCR image.

The backend Dockerfile additionally runs `npx prisma generate` in the base stage so the Prisma client is generated as part of the dependency installation layer.

### migrations — Prisma Migrate

Migrations live in `src/backend/prisma/migrations/` — `0_init` (the full baseline, including trigger and partial-index SQL that Prisma's schema language cannot express) and `1_seed_static_data` (the reference-data seed), plus one directory per schema change after that. `prisma migrate deploy` (run by the `migrate` service) applies whatever the `_prisma_migrations` table says is missing, which is what makes schema changes reach an already-provisioned database — the failure mode where a change only exists on freshly-built databases is gone by construction.

### scheduler — non-root Python

The scheduler Dockerfile creates a dedicated `appuser` group and user and sets `PYTHONPATH` so that all Python package imports resolve from the pipeline root without needing relative imports or `sys.path` manipulation.

---

## Networking

All containers share a single Docker bridge network (`my_network`). Services communicate by container name. The frontend container uses `INTERNAL_API_URL` (resolving to `http://backend:4000` inside the network) for server-side API calls, while browser-side calls use `NEXT_PUBLIC_API_URL` (the public URL via Nginx).

---

## Nginx

Nginx runs on the VPS host (not as a Docker container) and reverse-proxies inbound traffic to the appropriate container. The backend is not on a separate subdomain — it is proxied under the `/api/` path on the main domain.

| Request                     | Proxied to                      |
| --------------------------- | ------------------------------- |
| `beyondthearc.app/`         | `localhost:3000` (frontend)     |
| `beyondthearc.app/api/`     | `localhost:4000/api/` (backend) |
| `grafana.beyondthearc.app/` | `localhost:3001` (Grafana)      |

All HTTP traffic is redirected to HTTPS. Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Strict-Transport-Security`) are set on the main app server block.

The Grafana block additionally sets `Upgrade` and `Connection` headers to support WebSocket connections, which Grafana uses for live dashboard updates.

TLS certificates for `beyondthearc.app` and `grafana.beyondthearc.app` are issued by Let's Encrypt and stored under `/etc/letsencrypt/live/beyondthearc.app/`. For the main app, these certificates are only used when traffic arrives directly at the server (bypassing Cloudflare) — in normal operation Cloudflare terminates TLS on its edge before the request reaches Nginx.

---

## Volumes

| Volume            | Service    | Notes                                                              |
| ----------------- | ---------- | ------------------------------------------------------------------ |
| `postgres_data`   | database   | Declared `external: true` in prod to prevent accidental recreation |
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

**External volume requires manual creation.** The `postgres_data` volume must exist on the VPS before first deployment. This is documented but not automated — a bootstrap script would reduce the risk of a failed first deployment.

**Nginx config is not version-controlled.** The reverse proxy configuration lives on the VPS host outside of the repository. Changes are applied manually and are not tracked alongside the application code.

**No resource limits on application containers.** Only the observability services (Prometheus, Loki, Grafana) have CPU and memory limits defined. The application services (frontend, backend, scheduler) do not, which means a runaway process could starve the observability stack on the constrained CX23.

**Grafana subdomain leaks the server IP.** Because `grafana.beyondthearc.app` is DNS-only (not proxied through Cloudflare), the VPS IP is publicly resolvable via that record. Proxying it through Cloudflare would hide the IP consistently across all subdomains.
