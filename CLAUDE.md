# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Beyond The Arc** — a basketball data platform modelling the French competition structure (leagues → committees → clubs → teams → players → matches). Frontend is Next.js 15, backend is NestJS 11 + Prisma over PostgreSQL, with a Python scheduler generating match/stat data. Full architecture writeup: `docs/architecture.md` (and `docs/api.md`, `docs/data-model.md`, `docs/data-pipeline.md`, `docs/frontend.md`, `docs/infrastructure.md`, `docs/ci-cd.md`, `docs/observability.md`).

The API is read-only and fully public — no auth.

## Commands

All app commands run inside Docker Compose containers (there's no bare-metal dev setup); `make` targets wrap `docker compose` (see `Makefile`).

```bash
make up-dev              # start all services in dev mode (rebuilds)
make dev-frontend        # npm run dev inside the frontend container
make dev-backend         # npm run start:dev inside the backend container
make logs-dev            # tail logs
make down                # stop containers
```

Backend (`src/backend`):
```bash
npm run test                        # prisma generate && jest
npx jest path/to/file.spec.ts       # run a single test file
npm run lint                        # eslint '**/*.ts'
npm run lint:fix                    # organize-imports-cli + eslint --fix
npm run build                       # prisma generate && nest build
```

Frontend (`src/frontend`):
```bash
npm run lint
npm run lint:fix
npm run typecheck                   # tsc --noEmit
npm run build
```

Root-level `npm run barrels:watch` (or `make barrels`) regenerates barrel `index.ts` files via barrelsby — needed after adding new files to directories listed in the barrel-enforcing eslint rule (see below).

## Repository-specific conventions

These are enforced by custom ESLint rules in `src/backend/eslint-rules/` and `src/frontend/eslint-rules/` (mirrored in both), so violations fail lint/CI, not just style review:

- **File path header comment**: every `.ts`/`.tsx` file must start with a comment giving its own path relative to `src/backend` or `src/frontend`, e.g. `// src/backend/modules/teams/teams.service.ts`. Autofixable via `lint:fix`.
- **Barrel imports required** for a fixed list of directories (`@common/dto`, `@modules/*/dto`, etc. — see `enforce-barrel-import.js` for the exact list): import from the barrel (`@modules/teams/dto`) rather than a direct file path. Autofixable.

## Backend architecture

- Feature modules live under `src/backend/modules/<feature>/` (e.g. `teams`, `matches`, `players`, `stats`), each with its own `*.controller.ts`, `*.service.ts`, `*.module.ts`, and `dto/`. `competitions` and `organizations` are parent modules with nested sub-modules (`competitions/championships`, `organizations/clubs`, etc.).
- Prisma is the ORM; schema and migrations live in `src/backend/prisma`. SQL-based seed migrations for static reference data (competition structure, geography) are in `src/backend/db/sql/migrations`.
- All responses are wrapped by a global `TransformInterceptor` into a `{ data, timestamp, path, statusCode }` envelope; list endpoints add `meta.count`, paginated endpoints nest pagination info inside `data`. Errors go through a global `AllExceptionsFilter` that also forwards to Sentry.

## Frontend architecture

- Pages live under `src/frontend/app/[locale]/(public)/`; feature logic (components, hooks, API calls) lives under `src/frontend/features/<feature>/`, shared UI under `src/frontend/shared/`.
- **Dual service layer per feature**: `*.service.ts` (Axios, used by client components/TanStack Query) and `*.server.ts` (a `fetchApi` wrapper around native `fetch`, used by server components during SSR — hits the backend directly over the Docker network and auto-unwraps the `{ data }` envelope). Same method signatures in both, so switching a call site between client/server fetching doesn't require touching business logic.
- **Query Options pattern** for client data fetching, four files per feature: a key factory (`xKeys.ts`), a query options factory (`xQueries.ts`, single source of truth for query key + fn + cache config), thin hooks (`use-x.ts`) that components actually import, and prefetch helpers exported from the queries file for hover/focus-triggered prefetching.
- Cache `staleTime`/`gcTime` are set per feature based on how often the underlying data changes (see `docs/frontend.md` for the current table) — match new queries to an existing category rather than picking arbitrary values.

## Data pipeline

Two distinct data sources, handled differently:
- **Static** (competition structure, geography) — seeded once via SQL files in `src/backend/db/sql/migrations`.
- **Dynamic** (match results, stats, shot charts) — generated continuously by the Python scheduler (`src/backend/db/python`, run as the `scheduler` Docker service), organized into `generation/` (season/match/playtime generation), `simulation/` (match simulator + game state manager), `geojson/` (map boundary extraction), and `db/` (repository layer). The scheduler uses checkpoints to avoid reprocessing already-handled matches.

## Known limitations (intentional, not oversights)

- No hosted staging environment — CI-passing changes deploy straight to the single production VPS.
- Match data is simulated, not from a live feed (portfolio project).
- Single VPS node — no horizontal scaling or DB replication.
