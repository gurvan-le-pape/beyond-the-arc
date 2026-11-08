# API

> Design decisions, conventions, and endpoint reference for the Beyond The Arc REST API.

---

## Overview

The backend exposes a REST API built with NestJS 11, consumed exclusively by the Next.js frontend. It is read-only — there are no write endpoints. All routes are prefixed with `/api` except `/metrics`, which is excluded from the global prefix and exposed directly for Prometheus scraping.

The API is fully public: there is no authentication or authorisation. This reflects the nature of the platform — all data is competition information that should be openly accessible.

Interactive documentation is available at `/api/docs` (Swagger UI), served by `@nestjs/swagger`. The UI opts into the global `api` prefix (`useGlobalPrefix: true`) so it is served under the same path prefix that Nginx proxies to the backend, making it reachable in production.

---

## Base URL

| Environment | Base URL                       |
| ----------- | ------------------------------ |
| Production  | `https://beyondthearc.app/api` |
| Local       | `http://localhost:4000/api`    |

---

## Request conventions

**Validation** is handled globally by NestJS's `ValidationPipe` with `transform: true`, `whitelist: true`, and `forbidNonWhitelisted: true`. Unknown query parameters are rejected with a `400`. Path parameters that expect integers are parsed with `ParseEntityIdPipe` (`common/pipes`) — a non-numeric value returns a `400` immediately, and so does one outside the PostgreSQL `int4` range that every `@id` column uses. The range check is the reason the pipe exists rather than Nest's own `ParseIntPipe`, which has no upper bound: an id like `2147483648` parses cleanly, reaches Prisma, and comes back as a `ValueOutOfRange` — a `500` and a Sentry event for what is a client mistake. Every `@Query()` argument binds a validated DTO class (never a primitive with an inline pipe), so whitelist protection applies uniformly; integer query params use `@Type(Number) @IsInt`, and enum-valued params (`category`, `gender`, `level`, …) use `@IsEnum` against the constant lists in `common/constants` — invalid values are rejected with `400`, never silently ignored or clamped.

**CORS** allows exactly one origin in production — the `FRONTEND_URL` environment variable, which is therefore **required** there: the backend refuses to boot without it rather than serving an allowlist that matches nothing. Outside production `http://localhost:3000` is allowed as well, because dev is the only configuration where the browser is genuinely cross-origin (page on `:3000`, API on `:4000`); in production Nginx serves both under one origin. The allowlist is built by `resolveCorsOrigins()` (`common/utils`). **Credentials are not allowed** — the API has no auth, sets no cookies and reads no `Authorization` header, so there is no credentialed contract to grant.

**Pagination** is uniform across all paginated endpoints: query DTOs extend the shared `PaginationQueryDto` (`1 ≤ page ≤ 100 000`, `1 ≤ limit ≤ 100`, both optional), and services apply defaults through `resolvePagination()` (`page: 1`, `limit: 50`). Out-of-bounds values return `400` — there is no silent clamping. **`search` is capped at 100 characters** wherever it appears, which is above the longest name in the dataset and bounds what a caller can put into a cache key. Paginated payloads always have the shape `{ items, total, page, limit, totalPages }`. **A paginated query's `orderBy` ends with `id`.** Pages are `OFFSET`/`LIMIT` slices, and Postgres returns rows that tie on the sort key in no fixed order, so without a unique last key consecutive pages overlap and some rows are never returned — on a match day where thousands of matches share a kick-off time, over a third of them.

**Name search** uses the `search` query parameter everywhere it exists (clubs, teams, players, matches) — case-insensitive partial match.

**404 policy**: only by-id lookups return `404`. List endpoints return `200` with an empty array (or an empty `items` page) when nothing matches — a filter that matches nothing is not an error.

These conventions are mechanically enforced by `src/backend/app.conventions.spec.ts` (query DTO rules) and `src/backend/app.swagger.spec.ts` (schema fidelity) — both run in CI.

---

## Response envelope

All responses are wrapped by a global `TransformInterceptor` that produces a consistent envelope:

```json
{
  "data": <payload>,
  "timestamp": "2024-02-05T10:00:00Z",
  "path": "/api/committees?leagueId=1",
  "statusCode": 200
}
```

List endpoints additionally include a `meta` object with a `count` field:

```json
{
  "data": [...],
  "meta": { "count": 42 },
  "timestamp": "2024-02-05T10:00:00Z",
  "path": "/api/leagues",
  "statusCode": 200
}
```

Paginated endpoints (clubs, championships, teams, players, matches) nest the pagination metadata inside `data` — **and also send a `meta`**, which is the one place the two halves differ: `data.total` is the size of the full result set, `meta.count` is the length of the page in hand.

```json
{
  "data": {
    "items": [...],
    "total": 150,
    "page": 1,
    "limit": 50,
    "totalPages": 3
  },
  "meta": { "count": 50, "page": 1, "limit": 50, "totalPages": 3 },
  "timestamp": "2024-02-05T10:00:00Z",
  "path": "/api/players?page=1",
  "statusCode": 200
}
```

`meta` is absent entirely from a single-object response — the key is not sent, rather than sent as null.

### The envelope is in the contract

All three shapes are described in `docs/openapi.json`, and therefore in the generated frontend types. They come from `ApiEnvelopeDto` + `ApiListMetaDto` / `ApiPageMetaDto` in `@common/dto`, composed onto a concrete `data` schema by the three decorators in `@common/decorators`:

| decorator                                | `data`                                    | `meta`                               |
| ---------------------------------------- | ----------------------------------------- | ------------------------------------ |
| `@ApiEnvelope(Dto, description)`         | one object                                | absent                               |
| `@ApiEnvelopeList(Dto, description)`     | array                                     | `{ count }`                          |
| `@ApiEnvelopePage(ItemDto, description)` | `PaginatedResponseDto` with typed `items` | `{ count, page, limit, totalPages }` |

**A new 200 on an `/api` route uses one of these, not a bare `@ApiResponse`.** `@SkipTransform` is applied in exactly one place — `/metrics`, which is outside the global prefix and serves Prometheus text — so every other route is enveloped, and a hand-written `@ApiResponse({ type: Dto })` documents a body the API does not send. That was true of all 34 of them before this was introduced: the document described the unwrapped payload while the API had never sent one.

Note for the two `@HealthCheck()` routes: Terminus's decorator registers its own 200 and 503 schemas describing the bare health result as the whole body, and it outranks anything declared below it. They pass `swaggerDocumentation: false` (and must re-pass `noCache: true`, which the option object replaces rather than merges) so the envelope decorators are the only declaration.

---

## Error responses

Errors are handled by a global `AllExceptionsFilter` (which also forwards to Sentry). An error body is **not** enveloped — it is the body itself, described by `ApiErrorResponseDto`:

```json
{
  "statusCode": 404,
  "message": "Player with ID 999 not found",
  "error": "Not Found",
  "path": "/api/players/999",
  "timestamp": "2024-02-05T10:00:00Z"
}
```

`error` is the HTTP status name, derived from the status code — never the exception class name. The health routes are the exception to the exception: their 503 goes through `HealthCheckExceptionFilter` and _is_ enveloped, carrying the Terminus result under `data`.

**Every response carries an `x-request-id` header** — success and error alike — and it is the same id the backend logs that request under. It is the value to quote in a bug report, and the one thing that ties a failure seen by a caller to the server-side line that explains it (`{service="backend"} | json | req_id="…"`). It is not part of the error body above; it is a header, and a well-formed inbound `x-request-id` is reused rather than replaced so an id can be propagated from further upstream. See `docs/observability.md`.

Validation errors return an array of messages:

```json
{
  "statusCode": 400,
  "message": [
    "level must be either \"regional\" or \"departmental\"",
    "clubId must be a valid number"
  ],
  "error": "Bad Request",
  "path": "/api/players?level=invalid&clubId=abc",
  "timestamp": "2024-02-05T10:00:00Z"
}
```

---

## Caching

Response caching is applied at the route level using a custom `CacheInterceptor` backed by NestJS's global `CacheModule` (in-memory, bounded at `CACHE_MAX_ENTRIES` = 500 entries). Three TTL tiers are in use:

| Tier            | TTL        | Applied to                                                             |
| --------------- | ---------- | ---------------------------------------------------------------------- |
| `STATIC_DATA`   | 10 minutes | Leagues, club stats by region — rarely changes                         |
| `MODERATE_DATA` | 5 minutes  | List endpoints, filter values, pool matches, player shots              |
| `DYNAMIC_DATA`  | 60 seconds | Platform stats and recent pools — they move with every simulated round |

Endpoints that return a single resource by ID (e.g. `GET /clubs/:id`, `GET /matches/:matchId`) are generally not cached, as they are accessed less frequently and may reflect recent changes.

---

## API contract & type generation

The OpenAPI document is load-bearing, not just documentation:

- `docs/openapi.json` is the committed snapshot, produced by `src/backend/scripts/generate-openapi.ts` from the nest build (so `@nestjs/swagger` CLI-plugin metadata is included). Regenerate with:

  ```bash
  cd src/backend && npm run build && node dist/scripts/generate-openapi.js
  ```

- The frontend generates `shared/types/api.generated.ts` from that snapshot via `openapi-typescript` (`npm run typegen` in `src/frontend`). Feature types alias the generated schemas — see `features/organizations/committees/types/Committees.ts` for the pattern:

  ```ts
  export type Committee = components["schemas"]["CommitteeResponseDto"];
  ```

- The `openapi-drift` CI job regenerates both files and fails when either differs from what is committed, and the deploy depends on it — a backend DTO change cannot reach production without its regenerated contract.

Response DTO rules that keep the generated types truthful:

- No `@ApiProperty({ type: Object })` — every nested shape is a real DTO class (enforced by `app.swagger.spec.ts`).
- Nullable-but-always-present fields use `@ApiProperty({ nullable: true })`, **not** `@ApiPropertyOptional` — optional means "key may be absent", which the API never does for response fields.
- Enum-valued fields document `enum:` from `common/constants` instead of bare `String`.

### New-endpoint checklist

1. Query params: one DTO class in `dto/`, extending `PaginationQueryDto` if paginated, or `CompetitionScopeQueryDto` if it also takes level, committee, league, category and gender with their standard descriptions. The controller passes it to the service as is, and the service takes that DTO as its parameter type, so there is no parallel filter type where a field could be dropped; `@IsInt` for integers, `@IsEnum` for enum values, `search` for name search. No inline pipes on `@Query()`.
2. Response: real DTO classes for every nested shape; enums and nullability per the rules above.
3. List endpoints return `[]` when empty; only by-id endpoints throw `NotFoundException`.
4. Paginated: the `orderBy` ends with `{ id: "asc" }`.
5. Barrel imports for `@common/*` (`@common/dto`) and the file-path header comment — both lint-enforced. A feature's own DTOs are imported by file, `./dto/x.dto`.
6. Pick the cache TTL tier that matches the data (see Caching above).
7. Regenerate `docs/openapi.json` and run `npm run typegen` in `src/frontend`; commit both (CI fails otherwise).
8. `app.conventions.spec.ts` and `app.swagger.spec.ts` pick the new route up automatically — if they fail, the message names the offending property.

---

## Endpoints

### Leagues — `/api/leagues`

| Method | Path           | Description          | Cached |
| ------ | -------------- | -------------------- | ------ |
| GET    | `/leagues`     | All regional leagues | 10 min |
| GET    | `/leagues/:id` | Single league by ID  | No     |

Leagues are the top level of the French basketball hierarchy. The list is stable enough to cache aggressively.

---

### Committees — `/api/committees`

| Method | Path              | Description                                         | Cached |
| ------ | ----------------- | --------------------------------------------------- | ------ |
| GET    | `/committees`     | All committees, optionally filtered by `leagueId`   | 5 min  |
| GET    | `/committees/:id` | Single committee by ID, with every one of its clubs | No     |

`GET /committees` without a `leagueId` returns all departmental committees. Leagues and committees each carry a `clubCount`, which is what the map's region and department labels show. With `leagueId`, it returns only committees belonging to that league.

---

### Clubs — `/api/clubs`

| Method | Path         | Description                                   | Cached |
| ------ | ------------ | --------------------------------------------- | ------ |
| GET    | `/clubs`     | Paginated clubs with filters                  | 5 min  |
| GET    | `/clubs/all` | All clubs unfiltered (for map initialisation) | 5 min  |
| GET    | `/clubs/:id` | Single club with full team detail             | No     |

`GET /clubs` supports filtering by `level` (clubs with a team at that level), `committeeId`, `leagueId`, and `search` (club name, case-insensitive), with `page` and `limit` for pagination.

`GET /clubs/all` returns every club without filtering or pagination. It exists specifically for the interactive map, which needs all club coordinates in a single request to render pins on load.

`GET /clubs/:id` returns full detail including all of the club's teams, their pool, championship, and current rank and record in that pool.

**Note:** the `/clubs/all` route must be registered before `/:id` in the controller to avoid NestJS interpreting `all` as an ID parameter. It is.

---

### Championships — `/api/championships`

| Method | Path                 | Description               | Cached |
| ------ | -------------------- | ------------------------- | ------ |
| GET    | `/championships`     | Paginated championships   | 5 min  |
| GET    | `/championships/:id` | Single championship by ID | No     |

`GET /championships` supports filtering by `level`, `leagueId`, `committeeId`, `category`, and `gender`, with `page` and `limit` for pagination.

---

### Pools — `/api/pools`

| Method | Path            | Description                                      | Cached |
| ------ | --------------- | ------------------------------------------------ | ------ |
| GET    | `/pools/recent` | Up to 10 pools that played the most recent round | 60 sec |

A championship's pools come with it: `GET /championships/:id` lists each one's `id`, `letter` and `nbMatchdays`, by letter.

---

### Leaderboards — `/api/leaderboards`

| Method | Path            | Description                            | Cached |
| ------ | --------------- | -------------------------------------- | ------ |
| GET    | `/leaderboards` | A pool's standings (`poolId` required) | 5 min  |

Each row is a team's record in the pool — games played, won, lost and forfeited, points for and against, and competition points (2 for a win, 1 for a loss, 0 for a forfeit) — with its rank and recent form. Nothing stores the standings: `computeStandings` (`common/utils/standings.util.ts`) builds them from the pool's teams and completed matches on each request, sorted by competition points, then point difference. Tied teams share a rank. A club's detail ranks its teams with the same function.

---

### Matches — `/api/matches`

| Method | Path                              | Description                                     | Cached |
| ------ | --------------------------------- | ----------------------------------------------- | ------ |
| GET    | `/matches`                        | Paginated matches with filters                  | 5 min  |
| GET    | `/matches/pool/:poolId`           | All matches of a pool, unpaginated, by date     | 5 min  |
| GET    | `/matches/:matchId`               | Single match with full detail                   | No     |
| GET    | `/matches/:matchId/player-stats`  | Player statistics for a match, grouped by team  | No     |
| GET    | `/matches/:matchId/events`        | All events for a match, ordered by `occurredAt` | No     |
| GET    | `/matches/team/:teamId/shots`     | Every shot a team took across its matches       | No     |
| GET    | `/matches/player/:playerId/shots` | Every shot a player took across their matches   | 5 min  |

`GET /matches` supports the most extensive filter set in the API: `level`, `division`, `committeeId`, `leagueId`, `category`, `gender`, `poolId`, `matchday`, `date` (YYYY-MM-DD), and `search` (club name). Default pagination: `page: 1`, `limit: 50`, max `limit: 100`.

The two shot endpoints (`/team/:teamId/shots`, `/player/:playerId/shots`) return every shot with its coordinates and event type, and feed the shot charts on team and player pages. The team one is uncached on purpose: a season of team shots (~60 KB) exceeds the per-entry size the bounded cache was sized for.

---

### Teams — `/api/teams`

| Method | Path                 | Description                                  | Cached |
| ------ | -------------------- | -------------------------------------------- | ------ |
| GET    | `/teams`             | Paginated teams with filters                 | 5 min  |
| GET    | `/teams/:id`         | Single team with its roster and season stats | No     |
| GET    | `/teams/:id/matches` | Match history for a team, most recent first  | No     |

`GET /teams/:id` reads the team's completed box scores once and returns both each roster player's `seasonStats` and the team's own `seasonStats`. `GET /teams/:id/matches` returns the schedule and results only and reads no box score.

`GET /teams` filters by `poolId`; the teams filters take their division and pool options from `GET /championships`, like the matches filters. The team number is typed, so it has no options endpoint.

---

### Players — `/api/players`

| Method | Path                   | Description                                           | Cached |
| ------ | ---------------------- | ----------------------------------------------------- | ------ |
| GET    | `/players`             | Paginated players with filters                        | 5 min  |
| GET    | `/players/:id`         | Single player with team detail                        | No     |
| GET    | `/players/:id/matches` | Match history with per-match stats, most recent first | No     |

`GET /players` supports filtering by `level`, `clubId`, `teamNumber`, `number` (jersey), `committeeId`, `leagueId`, `category`, `gender`, and `search` (player name, case-insensitive).

`GET /players/:id/matches` returns each match the player appeared in, with their full stat line: points, rebounds (total, offensive, defensive), assists, steals, blocks, turnovers, fouls, three-point shooting, and `playtimeIntervals` — an array of `[start_sec, end_sec]` pairs representing their on-court stints.

---

### Stats — `/api/stats`

| Method | Path     | Description                 | Cached |
| ------ | -------- | --------------------------- | ------ |
| GET    | `/stats` | Platform-wide entity counts | 60 sec |

Returns aggregate counts for clubs, teams, players, matches, leagues, and committees. Used on the homepage, the about page and the organizations landing. Cached at 60 seconds rather than 5 minutes because match counts move with every simulated round.

---

### Health — `/api/health`

Documented in → [`observability.md`](./observability.md)

---

### Metrics — `/metrics`

Exposed at `/metrics` (outside the `/api` prefix) for Prometheus scraping. Returns default Node.js process metrics plus two custom metrics: `http_requests_total` (counter, labelled by method, route, status code) and `http_request_duration_seconds` (histogram, same labels, buckets from 10ms to 5s). Populated by the global `HttpMetricsInterceptor`.

---

## Known limitations

**No authentication.** The API is fully public. This is appropriate for a read-only competition data platform, but means there is no mechanism to restrict access to specific endpoints or rate-limit individual clients.

**In-memory cache only.** The cache is in-process with a maximum of 100 entries. It does not survive restarts and is not shared across hypothetical multiple instances. A Redis-backed cache would be needed for any multi-instance deployment.

**Inconsistent pagination envelope.** List endpoints return `meta.count` while paginated endpoints return `data.items`, `data.total`, `data.page`, etc. The two patterns are not unified, which means frontend consumers need to handle both shapes.

Sharper than it reads, now that the envelope is described in the contract rather than only in prose: a paginated endpoint sends the pagination numbers **twice**, once inside `data` and once in `meta`, and they are not the same numbers — `data.total` is the size of the result set while `meta.count` is the length of the page. `page`, `limit` and `totalPages` are straight duplicates. Unifying them is a breaking wire change and is not scheduled; until then, `ApiPageMetaDto`'s property descriptions say which is which.

**`/matches/team/:teamId/shots` and `/matches/player/:playerId/shots` are under `/matches`.** These endpoints are scoped to a team or player but live under the matches controller. This is a pragmatic grouping — they return match event data — but it is not immediately obvious from the URL that `/matches/team/:teamId/shots` and `/teams/:id/matches` are different resources serving different purposes.

**No search endpoint.** Global search across teams, players, and matches (as used by the frontend search page) is handled by multiple parallel requests to the filtered list endpoints rather than a dedicated search endpoint. This works at the current scale but is not efficient.
