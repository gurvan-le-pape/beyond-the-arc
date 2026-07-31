---
description: Logging, metrics, health checks, and error reporting — four signals, four tools.
paths:
  - "src/backend/**/*.ts"
---

# Backend — logging, metrics, health, errors

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

**Applies to:** `src/backend`. **Locked:** `pino@10.3.1`, `nestjs-pino@4.6.1`, `pino-pretty@13.1.3` (dev), `prom-client@15.1.3`, `@willsoto/nestjs-prometheus@6.1.0`, `@nestjs/terminus@11.0.0`, `@sentry/nestjs@10.47.0`. `[manifest]`

Four distinct signals, four tools. Do not use one to do another's job. `[manifest]`+`[principle]`

| signal | tool | question it answers |
|---|---|---|
| logs | `nestjs-pino` / `pino` | what happened in this request |
| metrics | `prom-client` / `@willsoto/nestjs-prometheus` | how is the system behaving in aggregate |
| health | `@nestjs/terminus` | should this instance receive traffic |
| errors | `@sentry/nestjs` | what broke, with enough context to fix it |

## Logging

- **Never use `console.log`.** The application has a structured logger; `console` output bypasses levels, redaction, and request correlation. `[manifest]`+`[principle]`
- Log through the injected logger so `nestjs-pino` attaches request context automatically. `[manifest]`+`[principle]`
- Logs are **structured**, not sentences. Put variables in fields, not in the message — the message stays a constant you can group and search by: `[principle]`

  ```ts
  // Wrong
  this.logger.log(`Widget ${id} failed after ${ms}ms`);

  // Right
  this.logger.error({ widgetId: id, durationMs: ms }, 'widget processing failed');
  ```
- Levels mean something: `error` = needs a human; `warn` = degraded but handled; `info` = notable state change; `debug` = diagnostic detail, off in production. Logging everything at `info` makes the level useless. `[principle]`
- **Never log secrets or personal data** — credentials, tokens, full request bodies, connection strings, email addresses. Configure pino's `redact` paths for the fields that could carry them, so a future field addition does not leak by default. `[principle]`
- Log an error **once**, at the point where it is handled. Logging at every catch-and-rethrow turns one failure into five entries that look like five failures. `[principle]`
- `pino-pretty` is a **devDependency** — human-readable output for local development only. Production emits JSON. `[manifest]`+`[principle]`

## Metrics

- `prom-client` exposes a Prometheus scrape endpoint via `@willsoto/nestjs-prometheus`. `[manifest]`
- **Never put unbounded values in a label** — no IDs, emails, URLs with parameters, or raw user input. Every distinct label combination is a separate time series, and high cardinality takes down the metrics backend, not just the dashboard. `[principle]`
- Pick the right instrument: counters for things that only increase, gauges for values that go up and down, histograms for durations and sizes. A counter that can decrease is a bug. `[principle]`
- Follow Prometheus naming: `widget_processing_duration_seconds`, `resource_requests_total` — base units (seconds, bytes), `_total` suffix on counters. `[principle]`
- Instrument what you would page on. A metric nobody alerts on or looks at is cost without benefit. `[principle]`
- The metrics endpoint must not be publicly exposed. `[principle]`

## Health checks

- `@nestjs/terminus@11` replaced the legacy `HealthIndicator` base class with **`HealthIndicatorService`**. Custom indicators must use the new API. `[upstream]`
- Distinguish liveness from readiness: liveness answers "is this process wedged" (restart me), readiness answers "can I serve traffic right now" (stop routing to me). Conflating them causes restart loops when a dependency is slow. `[principle]`
- Health checks must be cheap and must not depend on downstream services you cannot control, or one third party's outage marks your whole fleet unhealthy. `[principle]`
- A readiness check should verify the database connection, since that is the dependency the service cannot function without. `[manifest]`+`[principle]`

## Errors

- `@sentry/nestjs` captures unhandled exceptions. `[manifest]`
- Scrub personal data before capture — the same rule as logging, and Sentry payloads travel to a third party. `[principle]`
- Do not send expected, handled conditions to Sentry (a validation rejection, a 404). Noise there means nobody reads the real alerts. `[principle]`
- Attach context (request id, operation name, non-identifying parameters) rather than stuffing detail into the error message. `[principle]`
- Never swallow an error into an empty `catch`. Either handle it meaningfully or let it propagate to the error filter. `[principle]`
- Express 5 forwards rejected promises from async handlers automatically, so a handler that throws reaches the error pipeline without a manual `.catch(next)`. See `backend-nestjs.md`. `[upstream]`

## Correlation

- One request id should appear on the request's logs, its Sentry events, and any outbound call it makes. Without it, three tools each hold a third of the story. `[principle]`
- Do not invent a second correlation mechanism alongside the one `nestjs-pino` already provides. `[manifest]`+`[principle]`

> Request-id generation, pino redaction paths, the metrics route, and the Terminus health endpoints may already be wired. Find the existing setup before adding a parallel one — two correlation mechanisms are worse than one imperfect one.
