# Observability

> How Beyond The Arc is monitored in production: structured logging, error tracking, metrics, log aggregation, dashboards, and alerting.

---

## Overview

The observability stack is built from five tools that cover different concerns:

| Concern         | Tool               | Scope                               |
| --------------- | ------------------ | ----------------------------------- |
| Structured logs | Pino + nestjs-pino | Backend only                        |
| Error tracking  | Sentry             | Frontend and backend, independently |
| Metrics         | Prometheus         | Backend + host (node-exporter)      |
| Log aggregation | Loki + Promtail    | All containers                      |
| Dashboards      | Grafana            | Metrics and logs unified            |
| Alerting        | Grafana Alerting   | Email via Gmail SMTP                |

OpenTelemetry and distributed tracing are intentionally excluded — the single-node architecture does not produce cross-service traces worth collecting, and the added complexity is not justified at this scale.

---

## Structured logging — Pino

The NestJS backend uses [Pino](https://github.com/pinojs/pino) via `nestjs-pino` for structured JSON logging. All `console.log` calls are replaced with the injected Pino logger.

### Configuration

`LoggerModule` is registered globally in `AppModule`:

- **Level**: `debug` in development, `info` in production
- **Transport**: `pino-pretty` in development (colourised, human-readable); raw JSON to stdout in production
- **Header allowlist**: a custom `req` serializer (`serializeRequestLog`, `common/utils`) emits `id`, `method`, `url` and **only** the headers named in `LOGGED_REQUEST_HEADERS` — `host`, `user-agent`, `content-type`, `accept`. pino-http's default serializer emits the whole header block plus `remoteAddress`/`remotePort`; behind Cloudflare and Nginx that put the visitor's IP (`cf-connecting-ip`, `x-forwarded-for`, `x-real-ip`) on every line for the full 31-day retention, contradicting the `sendDefaultPii: false` policy written three files away in `instrument.ts`. It is an allowlist rather than an extension of pino's `redact` paths because a redact list allows everything except what it names, so it cannot cover a header a future proxy adds; an allowlist fails closed. `authorization` and `cookie` are simply not in it, which is what replaced the two redact paths that used to be here. The exception filter logs no `ip` for the same reason — Express has no `trust proxy` setting, so `request.ip` only ever held the proxy's address. The URL keeps its query string: search terms stay in the logs deliberately, since the dataset is public and, with the IP gone, a search term is attached to nobody
- **Request ID**: each request is assigned an id via `genReqId`, sourced from the `x-request-id` header or a generated UUID if absent. `nestjs-pino` binds it to that request's logger, so it appears as **`req.id`** on every line emitted during the request — pinoHttp's own completion line and anything the application or the exception filter logs. There is one name for it, so one query reconstructs the request: `{service="backend"} | json | req_id="…"` (Loki's `| json` flattens `req.id` to `req_id`)

HTTP request logging (method, path, status, duration) is handled automatically by `pinoHttp`. Error logging is handled by the global exception filter. Application code only injects the logger when it needs to record a business-level event — a user action, an external call, a state change.

### Log format

In production, every log line is a JSON object on stdout. Docker captures this and Promtail ships it to Loki.

**Loki indexes labels, not fields.** The only labels on these streams are `container`, `service` and `service_name` (set by Promtail's `relabel_configs`); every other field is read at query time by parsing the line, e.g. `{service="backend"} | json | statusCode=500`. That is a filter over the matched streams, not an index lookup, so narrow by label first.

The one field Loki does interpret on its own is the level: it derives `detected_level` from a level *string*, which is why the logger emits `"level": "warn"` rather than pino's numeric `40`. With the numeric default every line arrived as `detected_level="unknown"` and the log panel rendered them uncoloured.

A real line (`res`/`responseTime` also appear on the completion line and are trimmed here). `req` is now short enough to print whole — that is the header allowlist above, and it is most of why a request line went from ~920 bytes to ~500:

```json
{
  "level": "info",
  "time": 1786303522618,
  "pid": 1,
  "hostname": "c0ba1eb632be",
  "req": {
    "id": "1871d672-be27-49e0-b392-544ee6da7cda",
    "method": "GET",
    "url": "/api/matches/team/661/events",
    "headers": {
      "host": "backend:4000",
      "user-agent": "Mozilla/5.0 …",
      "accept": "application/json"
    }
  },
  "msg": "request completed"
}
```

`query` and `params` are gone from that object: both were a second copy of what `url` already carries.

There is no `traceId` and no `userId`: the correlation id is `req.id` and the API has no authenticated users.

---

## Error tracking — Sentry

Sentry captures unhandled exceptions with full stack traces, request context, and breadcrumbs. The frontend and backend use separate Sentry projects to keep alerts and ownership distinct.

### Backend

The backend uses `@sentry/nestjs`. `instrument.ts` is imported as the very first line of `main.ts`, before any other module, so Sentry is initialised before the NestJS application bootstraps. There is no profiling integration — `@sentry/profiling-node` is not a dependency.

Unhandled exceptions reach Sentry through the project's own `common/filters/all-exceptions.filter.ts`, registered as `APP_FILTER` in `AppModule`. There is no `SentryGlobalFilter`. That filter owns the response envelope and the Sentry hand-off together, which is what keeps "no internal detail in the body" enforced in one place — see [`api.md`](./api.md).

Tracing is off: no runtime sets `tracesSampleRate`. That is the same decision recorded at the top of this document, not an oversight.

`instrument.ts` reads three variables from the environment:

| variable         | supplied by                                          | effect                                              |
| ---------------- | ---------------------------------------------------- | --------------------------------------------------- |
| `SENTRY_DSN`     | `.env` on the VPS, via Compose                       | where events go; unset disables Sentry entirely      |
| `NODE_ENV`       | the image (`production`) or the dev Compose overlay  | becomes Sentry's `environment` tag                   |
| `SENTRY_RELEASE` | `IMAGE_TAG`, the deploy's commit SHA                 | names the build an event came from                   |

**`environment` is set explicitly because `@sentry/core` defaults it to the literal string `production`.** Left unset it does not mean "untagged": the dev Compose overlay inherits `SENTRY_DSN` from the base service definition, so every local error was filed into the production project indistinguishably from a real one.

Backend source maps are emitted by `tsconfig.build.json` and ship next to `dist/*.js` in the runtime image rather than being uploaded, so no build-time Sentry token is needed. The prod stage runs `node --enable-source-maps`; **without that flag Node does not apply source maps to `Error.stack` and the `.map` files are inert**, which is the difference between a frame reading `dist/…/parse-entity-id.pipe.js:31` and `common/…/parse-entity-id.pipe.ts:30`.

### Frontend

The frontend uses `@sentry/nextjs` in its v10 multi-runtime layout: `instrumentation-client.ts` (browser), `sentry.server.config.ts` (Node) and `sentry.edge.config.ts` (edge), registered by `instrumentation.ts`. There is deliberately **no `sentry.client.config.ts`** — that is the pre-v10 location and v10 does not read it. A `global-error.tsx` component wraps the root layout as an error boundary, capturing React rendering errors that would otherwise be swallowed before reaching Next.js's error handling.

The frontend DSN is a literal in each of the three init files. A DSN identifies a project and is not a credential; anything in a browser bundle is public by construction. Source maps are handled by `withSentryConfig`'s build plugin, which injects debug IDs, so the frontend needs no `release` of its own. `environment` is set from `NODE_ENV` in all three, for the same reason as the backend.

---

## Metrics — Prometheus

Prometheus scrapes every 15 seconds and retains data for 15 days (`--storage.tsdb.retention.time=15d`). It scrapes the backend, `node-exporter` for host-level metrics, and itself.

### Backend metrics

The backend exposes metrics at `GET /metrics` using `@willsoto/nestjs-prometheus` with `prom-client`. Default metrics are enabled — these cover Node.js process memory, CPU usage, event loop lag, and active handles. Custom counters and histograms are registered in `AppModule` and populated by `HttpMetricsInterceptor`, tracking request rates, error rates, and latency by route and status code.

The route sits outside the `/api` global prefix and is not published by Nginx, so it is reachable from inside the Docker network only — externally `/metrics` falls through to the frontend's locale routing (307) and `/api/metrics` is a 404. That is required, not incidental: a public metrics endpoint on an app with no authentication is a free description of its internals.

### Host metrics — node-exporter

`node-exporter` runs as a sidecar service and exposes CPU, memory, disk, and network metrics from the host. It mounts `/proc`, `/sys`, and the root filesystem read-only. It has no exposed port — Prometheus reaches it internally by service name.

### Prometheus config

`docker/config/prometheus.yml` defines three scrape jobs, all on the global 15-second interval:

| job          | target                | notes                                       |
| ------------ | --------------------- | ------------------------------------------- |
| `backend`    | `backend:4000/metrics` | the application's own counters and histograms |
| `node`       | `node-exporter:9100`  | host CPU, memory, disk, network              |
| `prometheus` | `localhost:9090`      | Prometheus scraping itself                   |

**The host job is named `node`, not `node-exporter`.** That is the `job` label value, so it is what a query or an alert expression has to match — `up{job="node"}`, not `up{job="node-exporter"}`.

Nothing scrapes the frontend, the database, the scheduler, Loki, Promtail or Grafana — three of the ten Compose services are covered, and *Service Down* alerts on the backend alone. If the frontend container dies, nothing notifies: the site is down and every backend metric stays green.

---

## Log aggregation — Loki + Promtail

### Promtail

Promtail runs as a Docker Compose service and ships all container logs to Loki. It discovers containers automatically by mounting the Docker socket read-only (`/var/run/docker.sock`). For each container, it attaches two labels: `container` (from the container name) and `service` (from the `com.docker.compose.service` label), making logs queryable by service name in Grafana.

### Loki

Loki stores and indexes the log stream. It is configured for single-node operation — no replication, in-memory ring, `tsdb` index (schema `v13`, via `tsdb_shipper`) with filesystem chunk storage. Log retention is 31 days (`retention_period: 744h`) and is enforced: the compactor runs with `retention_enabled: true`. Configuration is mounted from `docker/config/loki.yml`.

Loki runs as user `10001:10001` as required by the official Grafana image and has a 0.5 CPU / 512MB RAM resource limit to prevent the observability stack from crowding out application services on the constrained CX23.

---

## Dashboards — Grafana

Grafana is available at `grafana.beyondthearc.app` and serves as the single interface for logs and metrics. Both datasources — Prometheus and Loki — are provisioned automatically from `docker/config/grafana/provisioning/datasources/datasources.yml` on container start, so no manual setup is required after deployment.

### Dashboards

Dashboards are provisioned as code from `docker/config/grafana/provisioning/dashboards/`. They are committed to the repository and loaded automatically, meaning they survive container recreation without manual export or re-import.

There is **one** dashboard, `backend-overview.json`, titled *Backend Overview*. It holds nine panels:

| Panel             | Source     | Query                                                                                                                                          |
| ----------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| HTTP Request Rate | Prometheus | `rate(http_requests_total[5m])`                                                                                                                |
| Error Rate        | Prometheus | `rate(http_requests_total{status_code=~"5.."}[5m])`                                                                                            |
| P95 Latency       | Prometheus | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))`                                                        |
| Memory Usage      | Prometheus | `process_resident_memory_bytes{job="backend"} / 1024 / 1024`                                                                                    |
| Backend Logs      | Loki       | `{service="backend"}`                                                                                                                          |
| Health Status     | Prometheus | `up{job="backend"}`                                                                                                                            |
| Host CPU Usage    | Prometheus | `clamp_min(100 * (1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m]))), 0)`                                                                  |
| Host Memory Usage | Prometheus | `(1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes) * 100`                                                                       |
| Host Disk Usage   | Prometheus | `(node_filesystem_size_bytes{mountpoint="/"} - node_filesystem_avail_bytes{mountpoint="/"}) / node_filesystem_size_bytes{mountpoint="/"} * 100` |

Two things about that table are load-bearing rather than incidental. **The Backend Logs panel carries no line filter.** It streams every backend line and leans on `detected_level` (see Log format above) to distinguish them. A `|= "error"` would not do what it looks like it does on JSON output: it matches any line containing that word anywhere — a URL, a message, a header — while matching no pino error line by virtue of its level, since the level is a field rather than the literal text. And **Host Disk Usage is the *Disk Full* alert's own expression and selector, scaled to a percentage**, so the panel and the alert cannot report different numbers for the same filesystem; each host panel also draws its alert threshold as a dashed line.

`backend-overview.json` is a **schema v2 document** (`apiVersion: dashboard.grafana.app/v2`): panels live in `spec.elements` and their placement in a separate `spec.layout`. Adding a panel means writing both — an element with no `GridLayoutItem` does not render, and an invalid document is dropped silently at provisioning time. Load an edit into a running Grafana and read it back before trusting it.

### Access

Grafana runs on port 3001 inside the Docker network and is reverse-proxied by Nginx at `grafana.beyondthearc.app`. The Nginx block includes `Upgrade` and `Connection` headers to support Grafana's WebSocket connections for live dashboard updates. The subdomain uses a Let's Encrypt certificate managed by Certbot rather than Cloudflare proxying — see [`infrastructure.md`](./infrastructure.md) for the TLS split.

---

## Alerting

Grafana Alerting fires email notifications via Gmail SMTP when thresholds are crossed. SMTP credentials (`GF_SMTP_*`) are injected at runtime from the `.env` file on the VPS and are never committed to the repository. `GF_SERVER_ROOT_URL` is set in the production Compose override so that alert notification emails contain correct links back to Grafana.

### Alert rules

| Alert           | Fires when                                                                | For  |
| --------------- | ------------------------------------------------------------------------- | ---- |
| Service Down    | `up{job="backend"} < 1` — Prometheus cannot scrape the backend             | 2m   |
| High Error Rate | `rate(http_requests_total{status_code=~"5.."}[5m]) > 0.01`                 | 5m   |
| High Latency    | backend P95 request duration > 2s                                          | 5m   |
| Memory Pressure | backend RSS > 400MB                                                        | 10m  |
| Disk Full       | root filesystem > 85% used                                                 | 5m   |

**`High Error Rate` measures an absolute rate, not a percentage.** `0.01` is 0.01 5xx responses per second — roughly one every 100 seconds — and nothing divides by the total request rate, so the name, this table's older wording and the rule's own `summary` annotation all promise a ratio that is not computed. What it actually catches is "5xx responses are being served at all, steadily". Changing it to a real percentage means a second query and a new threshold, which is a decision rather than a correction, so it is recorded here rather than quietly reworded.

The rules are provisioned from `docker/config/grafana/provisioning/alerting/rules.yml`. **Grafana reads that file only at startup.** `docker compose up -d` recreates a container only when its *configuration* changes, and the provisioning directory is a bind mount whose file contents are not part of that hash — so an alerting change reaches the VPS and does nothing until Grafana restarts. The deploy therefore restarts Grafana when, and only when, a deploy actually changes anything under `provisioning/alerting/`; a restart resets the `for:` clocks, which run 2–10 minutes, so it is not done unconditionally.

Dashboards need no equivalent: their provider sets no `updateIntervalSeconds`, so Grafana's own poll picks up changes to the dashboard JSON without a restart.

The backend exposes three health endpoints under `/api/health`:

| Endpoint            | Checks                                    | Called by                                     |
| ------------------- | ----------------------------------------- | --------------------------------------------- |
| `GET /health`       | Database, memory heap (300MB), disk (90%) | **nothing**                                   |
| `GET /health/live`  | None — always returns 200                 | nothing                                       |
| `GET /health/ready` | Database only                             | the deploy job's post-deploy check             |

`/health` returns `200` when all three checks pass and `503` when any fail. `/health/live` and `/health/ready` follow the standard Kubernetes probe split — liveness confirms the process is up, readiness confirms it can handle requests. The project does not use Kubernetes, but the endpoints are wired up correctly if that changes.

**Grafana alerting does not call `/health`.** *Service Down* evaluates `up{job="backend"}`, which is Prometheus's own scrape of `/metrics` — so it detects a backend that has stopped answering, but the database, heap and disk checks inside `/health` are never run by anything. Closing that needs a caller: a Compose `healthcheck`, a Prometheus blackbox job, or a Grafana rule.

---

## Known limitations

**No distributed tracing.** There is no OpenTelemetry or Tempo integration. For a single-node, single-process backend this is an acceptable omission, but it means there is no way to trace a request across the frontend SSR layer and the backend API in a unified view.

**Grafana subdomain leaks the VPS IP.** Because `grafana.beyondthearc.app` is DNS-only (not proxied through Cloudflare), the VPS IP is publicly resolvable via that record. This is a deliberate tradeoff — Cloudflare proxying of WebSocket-heavy Grafana traffic adds latency and complexity — but it means the server IP is not fully hidden.

**Availability is only monitored for the backend.** `up` covers `backend`, `node` and `prometheus`; the frontend, database, scheduler, Loki, Promtail and Grafana are scraped by nothing, and `/health`'s database, heap and disk checks have no caller. See the Metrics and health sections above.

**No alerting on scheduler failures.** The Python scheduler logs to stdout (captured by Loki) but there are no Grafana alert rules targeting scheduler log output. A failed match or a crashed scheduler would not trigger a notification — it would only be visible by inspecting Loki logs or the database directly.
