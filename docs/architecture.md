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

| Layer          | Technology                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------- |
| Frontend       | Next.js 15, React 18, TanStack Query, TanStack Table, MapLibre GL, D3, Zustand, Tailwind CSS |
| Backend        | NestJS 11, Prisma, Node.js 22                                                                |
| Database       | PostgreSQL                                                                                   |
| Data pipeline  | Python (scheduling, simulation, generation)                                                  |
| Infrastructure | Docker Compose, VPS, Nginx                                                                   |
| CI/CD          | GitHub Actions, GHCR                                                                         |
| Observability  | Prometheus, Loki, Promtail, Grafana, Sentry                                                  |
| Code quality   | ESLint, SonarCloud                                                                           |

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
│   ├── database/
│   ├── python-script/
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
└── docs/                 # This documentation
```

---

## Frontend structure

The frontend is a Next.js 15 app using the App Router with a `[locale]` dynamic segment for internationalisation. All public-facing pages live under `app/[locale]/(public)/`:

```
(public)/
├── championships/[championshipId]   # Leaderboards, pools, results
├── map/                             # Interactive club map
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

- **Organisations**: leagues (national), committees (regional/departmental), clubs
- **Teams**: belong to clubs, participate in championships
- **Championships**: have divisions, pools, leaderboards, and match schedules
- **Players**: belong to teams, have per-match and aggregate statistics
- **Matches**: have events (shots, fouls, substitutions) used for shot charts and stats
- **Geography**: regions and departments with GeoJSON boundaries for the map

Full schema and modelling decisions are in → [`data-model.md`](./data-model.md)

---

## Data pipeline

The data in Beyond The Arc comes from two distinct sources, each handled differently.

**Static data — SQL files**
The competition structure (leagues, committees, clubs, divisions) changes rarely and is seeded via SQL files. This makes the initial dataset reproducible and easy to inspect or patch directly.

**Dynamic data — Python scripts**
Match results, player statistics, and shot chart data are generated and updated by a Python scheduler running as a dedicated Docker Compose service (`scheduler`). It contains:

- `generation/` — season schedule generation, match generation, playtime generation
- `simulation/` — match simulator with a game state manager and event generator
- `geojson/` — extractors for region and department boundaries used by the map
- `db/repositories/` — database access layer for the pipeline

The scheduler runs continuously (`restart: unless-stopped`) and uses checkpoints to avoid reprocessing already-handled matches.

More detail in → [`data-pipeline.md`](./data-pipeline.md)

---

## Infrastructure and deployment

The entire stack runs on a single VPS using Docker Compose. Images are built in CI, pushed to GitHub Container Registry (GHCR), and pulled on the VPS at deploy time.

Deployment is triggered automatically on push to `main`, via GitHub Actions, after all CI checks pass.

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
