# API

> Design decisions, conventions, and endpoint reference for the Beyond The Arc REST API.

---

## Overview

The backend exposes a REST API built with NestJS 11, consumed exclusively by the Next.js frontend. It is read-only — there are no write endpoints. All routes are prefixed with `/api` except `/metrics`, which is excluded from the global prefix and exposed directly for Prometheus scraping.

The API is fully public: there is no authentication or authorisation. This reflects the nature of the platform — all data is competition information that should be openly accessible.

Interactive documentation is available at `/docs` (Swagger UI), served by `@nestjs/swagger`.

---

## Base URL

| Environment | Base URL                       |
| ----------- | ------------------------------ |
| Production  | `https://beyondthearc.app/api` |
| Local       | `http://localhost:4000/api`    |

---

## Request conventions

**Validation** is handled globally by NestJS's `ValidationPipe` with `transform: true`, `whitelist: true`, and `forbidNonWhitelisted: true`. Unknown query parameters are rejected with a `400`. Path parameters that expect integers are parsed with `ParseIntPipe` — passing a non-numeric value returns a `400` immediately.

**CORS** is enabled for `http://localhost:3000` (development) and the `FRONTEND_URL` environment variable (production). Credentials are allowed.

**No pagination default** exists at the framework level — each endpoint that supports pagination defines its own defaults (typically `page: 1`, `limit: 50`).

---

## Response envelope

All responses are wrapped by a global `TransformInterceptor` that produces a consistent envelope:

```json
{
  "data": <payload>,
  "timestamp": "2024-02-05T10:00:00Z",
  "path": "/api/pools?championshipId=1",
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

Paginated endpoints (clubs, teams, players, matches) nest the pagination metadata inside `data` rather than `meta`:

```json
{
  "data": {
    "items": [...],
    "total": 150,
    "page": 1,
    "limit": 50,
    "totalPages": 3
  },
  "timestamp": "2024-02-05T10:00:00Z",
  "path": "/api/players?page=1",
  "statusCode": 200
}
```

---

## Error responses

Errors are handled by a global `AllExceptionsFilter` (which also forwards to Sentry). The error envelope mirrors the success envelope:

```json
{
  "statusCode": 404,
  "message": "Player with ID 999 not found",
  "error": "NotFoundException",
  "path": "/api/players/999",
  "timestamp": "2024-02-05T10:00:00Z"
}
```

Validation errors return an array of messages:

```json
{
  "statusCode": 400,
  "message": [
    "level must be either \"regional\" or \"departmental\"",
    "clubId must be a valid number"
  ],
  "error": "BadRequestException",
  "path": "/api/players?level=invalid&clubId=abc",
  "timestamp": "2024-02-05T10:00:00Z"
}
```

---

## Caching

Response caching is applied at the route level using a custom `CacheInterceptor` backed by NestJS's global `CacheModule` (in-memory, max 100 entries). Three TTL tiers are defined:

| Tier            | TTL        | Applied to                                               |
| --------------- | ---------- | -------------------------------------------------------- |
| `STATIC_DATA`   | 10 minutes | Leagues, club stats by region — rarely changes           |
| `MODERATE_DATA` | 5 minutes  | Pools, leaderboards, matches list, clubs, teams, players |
| `DYNAMIC_DATA`  | 60 seconds | Platform stats — match counts change on weekends         |

Endpoints that return a single resource by ID (e.g. `GET /clubs/:id`, `GET /matches/:matchId`) are generally not cached, as they are accessed less frequently and may reflect recent changes.

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

| Method | Path              | Description                                       | Cached |
| ------ | ----------------- | ------------------------------------------------- | ------ |
| GET    | `/committees`     | All committees, optionally filtered by `leagueId` | 5 min  |
| GET    | `/committees/:id` | Single committee by ID                            | No     |

`GET /committees` without a `leagueId` returns all departmental committees. With `leagueId`, it returns only committees belonging to that league.

---

### Clubs — `/api/clubs`

| Method | Path                         | Description                                           | Cached |
| ------ | ---------------------------- | ----------------------------------------------------- | ------ |
| GET    | `/clubs`                     | Paginated clubs with filters                          | 5 min  |
| GET    | `/clubs/all`                 | All clubs unfiltered (for map initialisation)         | 5 min  |
| GET    | `/clubs/stats/by-region`     | Club counts grouped by league/region                  | 10 min |
| GET    | `/clubs/stats/by-department` | Club counts grouped by committee, optional `leagueId` | 5 min  |
| GET    | `/clubs/departments`         | All departments with club counts and region info      | 5 min  |
| GET    | `/clubs/:id`                 | Single club with full team detail                     | No     |

`GET /clubs` supports filtering by `level`, `committeeId`, `leagueId`, `category`, `gender`, and `search` (club name, case-insensitive), with `page` and `limit` for pagination.

`GET /clubs/all` returns every club without filtering or pagination. It exists specifically for the interactive map, which needs all club coordinates in a single request to render pins on load.

`GET /clubs/:id` returns full detail including all of the club's teams, their pool assignment, championship, and current leaderboard position.

**Note:** the `/clubs/stats/*` and `/clubs/departments` routes must be registered before `/:id` in the controller to avoid NestJS interpreting `stats` and `departments` as ID parameters. They are.

---

### Championships — `/api/championships`

| Method | Path                       | Description                                        | Cached |
| ------ | -------------------------- | -------------------------------------------------- | ------ |
| GET    | `/championships`           | Championships, optionally filtered by level and ID | 5 min  |
| GET    | `/championships/divisions` | Distinct list of all division numbers              | 10 min |
| GET    | `/championships/:id`       | Single championship by ID                          | No     |

`GET /championships` accepts two optional query parameters: `level` (`regional` or `departmental`) and `id` (league ID for regional, committee ID for departmental). Both must be provided together — omitting both returns all championships. The `id` parameter doubles as either a `leagueId` or `committeeId` depending on the `level` value, resolved in the service layer.

`GET /championships/divisions` returns a flat array of distinct division numbers (e.g. `[1, 2, 3]`). This is used to populate division filter dropdowns and is cached at 10 minutes as the set of divisions is stable within a season.

---

### Pools — `/api/pools`

| Method | Path         | Description                                              | Cached |
| ------ | ------------ | -------------------------------------------------------- | ------ |
| GET    | `/pools`     | All pools for a championship (`championshipId` required) | 5 min  |
| GET    | `/pools/:id` | Single pool by ID                                        | No     |

`championshipId` is a required query parameter on `GET /pools` — passing an invalid value returns a `400`.

---

### Leaderboards — `/api/leaderboards`

| Method | Path                | Description                                            | Cached |
| ------ | ------------------- | ------------------------------------------------------ | ------ |
| GET    | `/leaderboards`     | All leaderboard entries for a pool (`poolId` required) | 5 min  |
| GET    | `/leaderboards/:id` | Single leaderboard entry by ID                         | No     |

Results are sorted by competition points and point difference. Leaderboard rows are maintained by database triggers — the API only reads them, never writes.

---

### Matches — `/api/matches`

| Method | Path                               | Description                                         | Cached |
| ------ | ---------------------------------- | --------------------------------------------------- | ------ |
| GET    | `/matches`                         | Paginated matches with filters                      | 5 min  |
| GET    | `/matches/all`                     | All match IDs unfiltered (for sitemap generation)   | 5 min  |
| GET    | `/matches/:matchId`                | Single match with full detail                       | No     |
| GET    | `/matches/:matchId/player-stats`   | Player statistics for a match, grouped by team      | No     |
| GET    | `/matches/:matchId/events`         | All events for a match, ordered by timestamp        | No     |
| GET    | `/matches/team/:teamId/events`     | All shot events for a team across all their matches | No     |
| GET    | `/matches/player/:playerId/events` | All shot events for a player across all matches     | No     |

`GET /matches` supports the most extensive filter set in the API: `level`, `division`, `committeeId`, `leagueId`, `category`, `gender`, `poolId`, `championshipId`, `matchday`, `date` (YYYY-MM-DD), and `search` (club name). Default pagination: `page: 1`, `limit: 50`, max `limit: 100`.

The two shot event endpoints (`/team/:teamId/events`, `/player/:playerId/events`) return all shot events with coordinates and are used to populate shot charts on team and player profile pages.

---

### Teams — `/api/teams`

| Method | Path                   | Description                                             | Cached |
| ------ | ---------------------- | ------------------------------------------------------- | ------ |
| GET    | `/teams`               | Paginated teams with filters                            | 5 min  |
| GET    | `/teams/all`           | All team IDs unfiltered (for sitemap generation)        | 5 min  |
| GET    | `/teams/filter-values` | Available filter values scoped to a committee or league | 5 min  |
| GET    | `/teams/:id`           | Single team with players and recent matches             | No     |
| GET    | `/teams/:id/matches`   | Match history for a team, most recent first             | No     |

`GET /teams/filter-values` returns the distinct values for `teamNumber`, `poolLetter`, and `division` that exist within a given scope (optional `committeeId` or `leagueId`). This is used to populate filter dropdowns in the frontend without hardcoding values.

---

### Players — `/api/players`

| Method | Path                   | Description                                           | Cached |
| ------ | ---------------------- | ----------------------------------------------------- | ------ |
| GET    | `/players`             | Paginated players with filters                        | 5 min  |
| GET    | `/players/all`         | All player IDs unfiltered (for sitemap generation)    | 5 min  |
| GET    | `/players/:id`         | Single player with team detail                        | No     |
| GET    | `/players/:id/matches` | Match history with per-match stats, most recent first | No     |

`GET /players` supports filtering by `level`, `clubId`, `teamId`, `teamNumber`, `number` (jersey), `committeeId`, `leagueId`, `category`, `gender`, and `name` (case-insensitive search).

`GET /players/:id/matches` returns each match the player appeared in, with their full stat line: points, rebounds (total, offensive, defensive), assists, steals, blocks, turnovers, fouls, three-point shooting, and `playtimeIntervals` — an array of `[start_sec, end_sec]` pairs representing their on-court stints.

---

### Stats — `/api/stats`

| Method | Path     | Description                 | Cached |
| ------ | -------- | --------------------------- | ------ |
| GET    | `/stats` | Platform-wide entity counts | 60 sec |

Returns aggregate counts for clubs, teams, players, matches, leagues, and committees. Used on the homepage. Cached at 60 seconds rather than 5 minutes because match counts change continuously on weekends.

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

**`/matches/team/:teamId/events` and `/matches/player/:playerId/events` are under `/matches`.** These endpoints are scoped to a team or player but live under the matches controller. This is a pragmatic grouping — they return match event data — but it is not immediately obvious from the URL that `/matches/team/:teamId/events` and `/teams/:id/matches` are different resources serving different purposes.

**No search endpoint.** Global search across teams, players, and matches (as used by the frontend search page) is handled by multiple parallel requests to the filtered list endpoints rather than a dedicated search endpoint. This works at the current scale but is not efficient.
