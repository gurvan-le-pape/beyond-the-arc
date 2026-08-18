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
- **Header allowlist**: a custom `req` serializer (`serializeRequestLog`, `common/utils`) emits `id`, `method`, `url` and **only** the headers named in `LOGGED_REQUEST_HEADERS` — `host`, `user-agent`, `content-type`, `accept`. pino-http's default serializer emits the whole header block plus `remoteAddress`/`remotePort`; behind Cloudflare and Nginx that put the visitor's IP (`cf-connecting-ip`, `x-forwarded-for`, `x-real-ip`) on every line for the full 31-day retention, contradicting the `sendDefaultPii: false` policy written three files away in `instrument.ts`. It is an allowlist rather than an extension of pino's `redact` paths because a redact list allows everything except what it names, so it cannot cover a header a future proxy adds; an allowlist fails closed. `authorization` and `cookie` are simply not in it, so neither needs a redact path of its own. The exception filter logs no `ip` for the same reason — Express has no `trust proxy` setting, so `request.ip` only ever held the proxy's address. The URL keeps its query string: search terms stay in the logs deliberately, since the dataset is public and, with the IP gone, a search term is attached to nobody
- **Request ID**: each request is assigned an id by `resolveRequestId` (`common/utils`), wired into `genReqId` — an inbound `x-request-id` is reused when it is well-formed (word characters, dots and dashes, ≤128, so a UUID or an Nginx `$request_id` propagates), otherwise a UUID is minted. `nestjs-pino` binds it to that request's logger, so it appears as **`req.id`** on every line emitted during the request — pinoHttp's own completion line and anything the application or the exception filter logs. There is one name for it, so one query reconstructs the request: `{service="backend"} | json | req_id="…"` (Loki's `| json` flattens `req.id` to `req_id`)
- **The same id is returned to the caller** as the `x-request-id` response header, on every response — success, 404, validation 400, the unmatched-route 404, and `/metrics`. It hangs off `genReqId` rather than an interceptor for two reasons: that is where the id is derived, so nothing else has to agree about what it is; and an interceptor is bound to a route handler, so it never runs for a request matching no route (measured: `/api/no-such-thing` gets a 404 the global `HttpMetricsInterceptor` records no metric for) and `TransformInterceptor` in particular is skipped by `@SkipTransform` and never reaches its `map` when the handler throws. The one path with no header is `/api/docs`: `swagger-ui-express` is mounted straight onto the Express instance before Nest's global middleware, so those requests are not logged either and there is no id to hand out. An inbound id that fails the pattern above is replaced rather than echoed — measured on Node 24.15.0, `res.setHeader` throws for none of a tab, a high byte, an empty string or 9,000 characters, so without the check anything a caller sent would be reflected back and bound into every Loki line for the 31-day retention
- **CORS**: `main.ts` lists the header in `exposedHeaders`. That is inert in production, where Nginx serves the app and the API under one origin, and exists so the header is readable in dev — the one genuinely cross-origin configuration

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

**Joining a frontend failure to the backend line that caused it.** A server-side fetch failure is logged once, by `handleServerError` (`src/frontend/shared/utils`), and that line carries the backend's id — `[Server fetch failed x-request-id=…]`. The id goes in the message rather than only on the error object because the frontend logger is a `console.error` wrapper: an own property of the error prints in the block `util.inspect` writes after the stack, which Promtail ships as its own unattached line. So the pair is:

```
{service="frontend"} |= "<id>"
{service="backend"} | json | req_id="<id>"
```

The id is absent when the request never reached the backend — a network error or a timeout has no response, and therefore no header.

### Separating bugs from operational failures

Two very different 5xx failures produce otherwise identical log lines. A `TypeError` reading a property of `undefined` is a bug in application code; a Prisma connection timeout is the database being slow. Both are logged by `AllExceptionsFilter` at `error`, both carry `msg: "request failed"` — which is deliberately a constant, see above — and both carry a 5xx `statusCode`. Nothing in the line distinguishes them except the serialized `err`.

So the filter adds one field to the first kind:

```
{service="backend"} | json | programmerError="true"
```

The set it marks is deliberately conservative — `TypeError`, `RangeError`, `ReferenceError`, in `PROGRAMMER_ERROR_TYPES`. Application-level error classes are operational and are not in it.

**This is a query-time filter, not an alert.** No alert rule routes on it: all six rules in `provisioning/alerting/rules.yml` query Prometheus, and none queries Loki. It is also **not a Loki label** — Promtail attaches no pipeline stage, so nothing promotes it. It does not need to be one, and this is the general point made under "Log format" above: `| json` parses the line and filters on any field it finds, label or not. Labels select streams; fields filter within them.

Verified against a Loki instance rather than assumed. Three lines pushed to one `{service="backend"}` stream — a `TypeError` line carrying the flag, a Prisma-timeout 5xx without it, and a 404 — then queried:

| query | entries |
|---|---|
| `{service="backend"}` (control) | 3 |
| `{service="backend"} \| json \| programmerError="true"` | 1 — the `TypeError` |
| `{service="backend"} \| json \| programmerError!="true"` | 2 — the other two |

`/loki/api/v1/labels` over the same window returned `service` and `service_name` only, confirming the filter resolved with no label backing it.

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

Prometheus scrapes every 15 seconds and retains data for 15 days (`--storage.tsdb.retention.time=15d`). It scrapes the backend, `node-exporter` for host-level metrics, and itself, and it probes the frontend, the backend's health route and Postgres through `blackbox-exporter`.

### Backend metrics

The backend exposes metrics at `GET /metrics` using `@willsoto/nestjs-prometheus` with `prom-client`. Default metrics are enabled — these cover Node.js process memory, CPU usage, event loop lag, and active handles. Custom counters and histograms are registered in `AppModule` and populated by `HttpMetricsInterceptor`, tracking request rates, error rates, and latency by route and status code.

The route sits outside the `/api` global prefix and is not published by Nginx, so it is reachable from inside the Docker network only — externally `/metrics` falls through to the frontend's locale routing (307) and `/api/metrics` is a 404. That is required, not incidental: a public metrics endpoint on an app with no authentication is a free description of its internals.

### Host metrics — node-exporter

`node-exporter` runs as a sidecar service and exposes CPU, memory, disk, and network metrics from the host. It mounts `/proc`, `/sys`, and the root filesystem read-only. It has no exposed port — Prometheus reaches it internally by service name.

### Prometheus config

`docker/config/prometheus.yml` defines five scrape jobs, all on the global 15-second interval:

| job             | target                                              | notes                                         |
| --------------- | --------------------------------------------------- | --------------------------------------------- |
| `backend`       | `backend:4000/metrics`                              | the application's own counters and histograms  |
| `node`          | `node-exporter:9100`                                | host CPU, memory, disk, network                |
| `prometheus`    | `localhost:9090`                                    | Prometheus scraping itself                     |
| `blackbox-http` | `frontend:3000/`, `backend:4000/api/health`         | availability probes, via `blackbox-exporter`   |
| `blackbox-tcp`  | `database:5432`                                     | TCP handshake only — Postgres speaks no HTTP   |

**The host job is named `node`, not `node-exporter`.** That is the `job` label value, so it is what a query or an alert expression has to match — `up{job="node"}`, not `up{job="node-exporter"}`.

### Availability probing — blackbox-exporter

The three scrape jobs above only cover services that instrument themselves. The frontend, the database and the scheduler expose no metrics at all, so `up` could never say anything about them: if the frontend container died the site was down and every backend metric stayed green.

`blackbox-exporter` closes that by asking the only question available for an uninstrumented service — does a request to it succeed. Prometheus passes the target as a query parameter (`/probe?target=…&module=…`) and rewrites `__address__` to the exporter, which is what the `relabel_configs` in each blackbox job are doing; without them Prometheus would try to scrape the probed service directly.

**Two details are load-bearing rather than defaults left alone:**

- **`follow_redirects: true`.** The frontend's `/` answers **307** to `/en` — the next-intl locale middleware — so a probe that does not follow scores a perfectly healthy frontend as down. Measured with it off: `probe_success 0`, `probe_http_status_code 307`. Following it also makes the probe measure what a visitor gets, a rendered page rather than a middleware hop.
- **The backend is probed at `/api/health`, not `/metrics`.** That exercises the database ping, heap and disk indicators; `/metrics` exercises none of them.

**Cost, measured rather than assumed**: the probes add **41 series** against a head of **2,361** — 1.7 %. Prometheus's own RSS is dominated by the Go runtime and query workload at this scale, not by series count.

**Verified by killing the thing.** With `docker stop` on the frontend container, `probe_success{instance="http://frontend:3000/"}` went to **0** while **every `up` series stayed at 1** — which is precisely the gap this exists to close, demonstrated rather than argued. It returned to 1 on restart.

Loki, Promtail, Grafana and the scheduler are still unwatched. Grafana's `:3001/metrics` answers unauthenticated on the internal network and is the obvious next target if its memory curve is ever wanted.

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
| Backend 5xx Rate | `rate(http_requests_total{status_code=~"5.."}[5m]) > 0.01`                | 5m   |
| High Latency    | backend P95 request duration > 2s                                          | 5m   |
| Memory Pressure | backend RSS > 400MB                                                        | 10m  |
| Disk Full       | root filesystem > 85% used                                                 | 5m   |
| Endpoint Unreachable | `probe_success < 1` — any probed target stops answering               | 2m   |

**`Backend 5xx Rate` measures an absolute rate, and is now named for it.** `0.01` is 0.01 5xx responses per second — roughly one every 100 seconds, or about three in five minutes — and nothing divides by the total request rate. It was called *High Error Rate* and annotated "exceeded 1%" until 2026-08-16, promising a ratio that no part of the rule computed. The rule was kept and the label fixed, rather than the reverse, because at this deployment's volume a percentage is the wrong instrument rather than the right one worded badly:

- Guaranteed traffic is **0.1 req/s**, all 200s, and all of it counted: the blackbox probe hits `/api/health` every 15s and the backend's own Compose healthcheck every 30s (`1/15 + 1/30`). `HttpMetricsInterceptor` excludes only `/metrics`, not `/api/health`.
- So `0.01/s` is **≈ 10% of idle traffic** — the rule was an order of magnitude *less* trigger-happy than the 1% it advertised, not more.
- A true 1% ratio would fire on **a single 5xx in five minutes**, because one error in ~30 requests is 3.3%. The absolute and ratio forms only coincide at 1 req/s.

What it catches is "5xx responses are being served at all, steadily". The trade-off accepted is that absolute thresholds do not scale with traffic: if sustained volume ever clears ~1 req/s, this wants revisiting as a ratio with a minimum-volume guard, which needs a second query, a `$A / $B` expression and a floor.

The rules are provisioned from `docker/config/grafana/provisioning/alerting/rules.yml`. **Grafana reads that file only at startup.** `docker compose up -d` recreates a container only when its *configuration* changes, and the provisioning directory is a bind mount whose file contents are not part of that hash — so an alerting change reaches the VPS and does nothing until Grafana restarts. The deploy therefore restarts Grafana when, and only when, a deploy actually changes anything under `provisioning/alerting/`; a restart resets the `for:` clocks, which run 2–10 minutes, so it is not done unconditionally.

Dashboards need no equivalent: their provider sets no `updateIntervalSeconds`, so Grafana's own poll picks up changes to the dashboard JSON without a restart.

The backend exposes three health endpoints under `/api/health`:

| Endpoint            | Checks                                    | Called by                                     |
| ------------------- | ----------------------------------------- | --------------------------------------------- |
| `GET /health`       | Database, memory heap (300MB), disk (90%) | the backend's Compose `healthcheck`, every 30s |
| `GET /health/live`  | None — always returns 200                 | nothing                                       |
| `GET /health/ready` | Database only                             | the deploy job's post-deploy check             |

`/health` returns `200` when all three checks pass and `503` when any fail. `/health/live` and `/health/ready` follow the standard Kubernetes probe split — liveness confirms the process is up, readiness confirms it can handle requests. The project does not use Kubernetes, but the endpoints are wired up correctly if that changes.

**Two things call `/health` now, and neither is *Service Down*.** That alert evaluates `up{job="backend"}`, which is Prometheus's own scrape of `/metrics` — it detects a backend that has stopped answering, and it never touches the health route. What does: the Compose `healthcheck` below, and the `blackbox-http` probe, whose `probe_success` feeds *Endpoint Unreachable*. So the database, heap and disk indicators inside `/health` now run on a schedule **and** their failure reaches a notification, which was not true when they were filed as dead code reading as a control in place.

**A Compose `healthcheck` is now that caller**, on `backend` (`--spider` against `/api/health`) and on `frontend` (a request to `/`, which the next-intl middleware redirects to `/en`, so it exercises a real render rather than just the port). Both run every 30s.

**Be precise about what that buys, because it is less than it looks.** A Docker health status is not a metric and not an alert:

- **It does not restart anything.** Measured, not assumed: a container held unhealthy for 20 s under `restart: unless-stopped` reported `RestartCount 0` and an unchanged `StartedAt`. Docker's restart policy fires on process *exit*, not on health status — auto-restart on unhealthy needs Swarm mode or an autoheal sidecar, and neither is deployed here.
- **It notifies nobody.** Prometheus scrapes `/metrics`, not Docker's health status, so an unhealthy container produces no series, no `up` change and no alert.

What it does buy: the three indicators execute on a schedule rather than only during the deploy's post-deploy check, and their verdict shows in `docker compose ps` — so `Up 2 minutes (unhealthy)` is visible to anyone looking at the box. Turning that verdict into a *notification* is the `blackbox-http` probe's job: it requests the same routes over HTTP, so a failure becomes `probe_success 0` and fires *Endpoint Unreachable*. The healthcheck and the probe overlap deliberately — the healthcheck is what `docker compose ps` reads, the probe is what alerts.

Verified end to end: stopping the database moves the backend to `unhealthy` after ~92 s (three 30 s retries) with the probe log showing `0 0 1 1 1`, and restarting it recovers to `healthy` in ~32 s. Note the probe uses `--spider`, so it records *that* a check failed, not which indicator — read the endpoint directly to find out.

---

## Known limitations

**No distributed tracing.** There is no OpenTelemetry or Tempo integration. For a single-node, single-process backend this is an acceptable omission, but it means there is no unified view of a request crossing the frontend SSR layer and the backend API — only the two log streams and the `x-request-id` that joins them, one query each way.

**The correlation id stops at the API boundary.** It is minted per *backend* request, so the document request the browser made has no id of its own and one page render fans out into several unrelated ids. Nginx has a built-in `$request_id` that could be generated at the edge and passed both upstream and back to the client, which would also give a user something quotable when an SSR render fails — the error boundary never sees the backend's id, since a production build replaces a server-thrown error with a generic message plus a `digest` before the client receives it. That is a change to the Nginx config, which is not version-controlled (see `docs/infrastructure.md`).

**Grafana subdomain leaks the VPS IP.** Because `grafana.beyondthearc.app` is DNS-only (not proxied through Cloudflare), the VPS IP is publicly resolvable via that record. This is a deliberate tradeoff — Cloudflare proxying of WebSocket-heavy Grafana traffic adds latency and complexity — but it means the server IP is not fully hidden.

**Availability now covers the frontend, the backend and the database; the scheduler, Loki, Promtail and Grafana are still unwatched.** `up` covers only what instruments itself (`backend`, `node`, `prometheus`, and the exporter jobs), which is why the healthchecks alone never closed this: a Docker health status is not a metric and nothing read it. The `blackbox-http`/`blackbox-tcp` probes are what closed it, for the three services a user notices first — verified by stopping the frontend container, which took `probe_success` to 0 while every `up` series stayed at 1. The scheduler remains deliberate (`docs/data-pipeline.md`); Grafana's `:3001/metrics` is the obvious next target.

**No alerting on scheduler failures.** The Python scheduler logs to stdout (captured by Loki) but there are no Grafana alert rules targeting scheduler log output. A failed match or a crashed scheduler would not trigger a notification — it would only be visible by inspecting Loki logs or the database directly.
