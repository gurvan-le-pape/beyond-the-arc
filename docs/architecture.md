# Beyond The Arc — Architecture Overview

> A technical overview of the project: what it is, how it is structured, the key decisions made, and pointers to deeper documentation for each area.

---

## What it is

**Beyond The Arc** is a basketball data platform modelling the French competition structure — from national leagues down to departmental divisions. It covers the full hierarchy of organisations (leagues, committees, clubs), teams, players, and matches.

Key features include:

- Championship pages with leaderboards, pools, and match results
- Player and team profile pages with shot charts
- Match pages with detailed statistics
- A global search across teams, players, and matches
- An interactive map of France with region and department boundaries, letting users browse clubs geographically

The data is a mix of static reference data (the competition structure, organisations, geography) and dynamically generated data (match results, player statistics, shot charts), reflecting the reality of a platform where some things rarely change and others are produced continuously.

---

## System overview

```
┌──────────────────────────────────────────────────────────┐
│                        VPS (single node)                 │
│                                                          │
│  ┌─────────────┐   ┌─────────────┐   ┌───────────────┐   │
│  │  Next.js 15 │   │  NestJS 11  │   │  PostgreSQL   │   │
│  │  (frontend) │-->│  (backend)  │-->│  (database)   │   │
│  └─────────────┘   └─────────────┘   └───────────────┘   │
│                           ^                              │
│                    ┌──────┴──────┐                       │
│                    │  Python     │                       │
│                    │  scheduler  │                       │
│                    └─────────────┘                       │
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │  Observability: Prometheus · Loki · Grafana      │    │
│  └──────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

All services run as Docker Compose containers on a single VPS. There is no separate staging environment — see [Known limitations](#known-limitations).

---

## Stack

| Layer          | Technology                                                          |
| -------------- | ------------------------------------------------------------------- |
| Frontend       | Next.js 15, React 19, TanStack Query, MapLibre GL, D3, Tailwind CSS |
| Backend        | NestJS 11, Prisma 7, Node.js 24                                     |
| Database       | PostgreSQL                                                          |
| Data pipeline  | Python (scheduling, simulation, generation)                         |
| Infrastructure | Docker Compose, VPS, Nginx                                          |
| CI/CD          | GitLab CI (self-hosted runner), GitLab container registry           |
| Observability  | Prometheus, Loki, Promtail, Grafana, Sentry                         |
| Code quality   | ESLint, SonarCloud                                                  |

---

## Repository structure

```
.
├── src/
│   ├── backend/          # NestJS API
│   ├── frontend/         # Next.js app
│   └── backend/db/python # Data pipeline (scheduler, generators, simulators)
├── docker/
│   ├── backend/
│   ├── frontend/
│   ├── python-script/
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
└── docs/                 # This documentation
```

---

## Frontend structure

The frontend is a Next.js 15 app using the App Router with a `[locale]` dynamic segment for internationalisation. The data pages live under `app/[locale]/(chrome)/(public)/`; the site pages (`about`, `architecture`, `docs`, `product`) sit beside that group in `(chrome)/`, and the club map is `app/[locale]/(fullscreen)/map`:

```
(public)/
├── championships/[championshipId]   # Leaderboards, pools, results
├── matches/[matchId]                # Match detail and stats
├── organizations/
│   ├── clubs/[clubId]
│   ├── committees/[committeeId]
│   └── leagues/[leagueId]
├── players/[playerId]               # Player profile and shot chart
├── search/                          # Global search
└── teams/[teamId]                   # Team profile and shot chart
```

Notable frontend decisions are covered in → [`frontend.md`](./frontend.md)

---

## Backend structure

The NestJS backend exposes a REST API consumed by the frontend. It uses Prisma as the ORM against PostgreSQL.

The API is documented via Swagger (`@nestjs/swagger`), available at `/api/docs` on the backend. Hand-written documentation for API design decisions (endpoint structure, response shaping, pagination) is in → [`api.md`](./api.md)

---

## Data model

The domain models the French basketball competition hierarchy:

- **Organisations**: leagues (one per region), committees (one per department), clubs
- **Championships**: one season of one competition, divided into divisions and pools
- **Teams**: a club's entry in one pool; standings are computed from the pool's results
- **Players**: belong to teams; a match's box score holds each player's stat line
- **Matches**: have events (shots, fouls, substitutions) used for shot charts, and may be forfeited
- **Geography**: a league carries its region and a committee its department; their GeoJSON boundaries ship with the frontend for the map

Full schema and modelling decisions are in → [`data-model.md`](./data-model.md)

### The competition time zone is mirrored in three languages, on purpose

Every match instant is stored in UTC. Its wall-clock meaning is defined in one zone — `Europe/Paris` — because the competition is French: a date filter of `2026-02-05` means the French calendar day, not the server's, which is UTC in the container and whatever a laptop is set to in development.

That identifier is named once per language, and the three are **deliberately not shared**:

| language | constant | file |
| --- | --- | --- |
| backend (TS) | `COMPETITION_TIME_ZONE` | `src/backend/common/constants/competition-time-zone.ts` |
| frontend (TS) | `COMPETITION_TIME_ZONE` | `src/frontend/shared/utils/helpers/date-helpers.ts` |
| scheduler (Python) | `PARIS` | `src/backend/db/python/utils/schedule_utils.py` |

No cross-language mechanism exists in this repo and none was invented for one string. An environment variable would turn a compile-time constant into a runtime input, so a typo becomes a production bug instead of a build failure; a code generator is new build machinery for a value that has never changed. This is the posture the repo already takes for the enum lists mirrored between backend and frontend.

The cost this accepts is that a change means editing three files. It is written down here so the duplication is not mistaken for an oversight and "fixed" into a shared runtime input.

One deliberate exception: `matches.service.spec.ts` imports neither the backend constant nor the zone name — it writes its expected instants out as literal UTC timestamps. The spec is the oracle for that constant: importing it, or recomputing the expected instants from the zone, would compare the implementation with itself.

Every other assumption the scheduler, backend and frontend make about each other without a check behind it is listed in → [`boundary.md`](./boundary.md)

---

## Data pipeline

The data in Beyond The Arc comes from two distinct sources, each handled differently.

**Static data — Prisma migration**
The competition structure (leagues, committees, clubs, geography) changes rarely and is real French basketball data, scraped from FFBB's public site and geocoded via France's BAN API (`scripts/ffbb-import/`), seeded by the `1_seed_static_data` Prisma migration alongside the schema.

**Dynamic data — Python scripts**
Match results, player statistics, and shot chart data are generated and updated by a Python scheduler running as a dedicated Docker Compose service (`scheduler`). It contains:

- `generation/` — season schedule generation, match generation, playtime generation
- `simulation/` — match simulator with a game state manager and event generator
- `db/repositories/` — database access layer for the pipeline

The scheduler runs continuously (`restart: unless-stopped`). `matches.status` keeps a match from being generated twice, and season setup skips a league that already has teams this season.

More detail in → [`data-pipeline.md`](./data-pipeline.md)

---

## Infrastructure and deployment

The entire stack runs on a single VPS using Docker Compose. Images are built in CI, pushed to the GitLab container registry, and pulled on the VPS at deploy time.

Deployment is triggered automatically on push to `main`, via GitLab CI, after all CI checks pass.

More detail in → [`infrastructure.md`](./infrastructure.md) and [`ci-cd.md`](./ci-cd.md)

---

## Observability

The backend uses Pino for structured JSON logging, Sentry for error tracking (frontend and backend), Prometheus for metrics, Loki + Promtail for log aggregation, and Grafana for dashboards and alerting.

Full detail in → [`observability.md`](./observability.md)

---

## Known limitations

**No hosted staging environment.** The dev environment is local (`docker-compose.dev.yml`), and there is no hosted environment between it and production. Changes that pass CI are deployed directly to the VPS. A hosted staging environment would allow testing infrastructure changes and alerting rules without risk to production.

**Simulated data.** Match data is generated by a simulator rather than sourced from a live feed. This is intentional for a portfolio project — it allows the full platform to function with realistic data without requiring access to a real data provider.

**Single node.** Everything runs on one VPS. There is no horizontal scaling, load balancing, or database replication. For the current scope this is appropriate, but it is a deliberate constraint rather than an oversight.
