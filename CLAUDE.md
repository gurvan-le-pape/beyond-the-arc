# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Beyond The Arc** — a basketball data platform modelling the French competition structure (leagues → committees → clubs → teams → players → matches). Frontend is Next.js 15, backend is NestJS 11 + Prisma over PostgreSQL, with a Python scheduler generating match/stat data. Full architecture writeup: `docs/architecture.md` (and `docs/api.md`, `docs/data-model.md`, `docs/data-pipeline.md`, `docs/frontend.md`, `docs/infrastructure.md`, `docs/ci-cd.md`, `docs/observability.md`).

The API is read-only and fully public — no auth.

## Commands

The **services** run in Docker Compose — dev servers, database, scheduler, migrations — and `make` targets wrap `docker compose` (see `Makefile`). The **static checks do not**: after an `npm ci` in the project, lint, format, typecheck, `check:messages` and both builds run bare-metal. That is what CI does — nine jobs install through `.github/actions/setup-app` with a `working-directory` of `src/backend`, `src/frontend` or the repo root, on a runner with no compose stack.

Run them from inside the owning project, not the repo root: ESLint walks up from the cwd for its flat config, so from the root it exits **2** — a configuration error, not a lint failure — and Prettier reads `.prettierignore` relative to the cwd, so the root and each project carry separate ignore lists that have to agree. The one local exception is the backend's `npm run test` and `npm run build`: both begin with `prisma generate`, which fails `EACCES` on a machine that has run the containers, since `src/backend/prisma/generated/` is then owned by root. Run those two in the container.

```bash
make up-dev              # start all services in dev mode (rebuilds)
make dev-frontend        # npm run dev inside the frontend container
make dev-backend         # npm run start:dev inside the backend container
make logs-dev            # tail logs
make down                # stop containers
make refresh-static-data # re-scrape FFBB and regenerate the static-data migration (host-side, ~1h20)
```

Backend (`src/backend`):
```bash
npm run test                        # prisma generate && jest
npx jest path/to/file.spec.ts       # run a single test file
npm run typecheck                   # tsc --noEmit -p tsconfig.json — covers specs, ~2s, no prisma generate
npm run lint                        # eslint '**/*.ts'
npm run lint:fix                    # organize-imports-cli + eslint --fix + prettier --write
npm run build                       # prisma generate && nest build
```

Frontend (`src/frontend`):
```bash
npm run lint
npm run lint:fix                    # same three steps as the backend's
npm run typecheck                   # tsc --noEmit
npm run build
```

Scheduler (`src/backend/db/python`) — pytest, in the image the scheduler runs on. `tests/season_sample.py` simulates a seeded sample of matches with no database and prints per-team, per-game averages; run it before and after any simulator change, since the simulator's behaviour is only observable in aggregate:
```bash
docker run --rm -v "$PWD/src/backend/db/python":/app -w /app -e PYTHONDONTWRITEBYTECODE=1 python:3.14-slim \
  sh -c 'pip install -q -r requirements-dev.txt && python -m pytest && python -m tests.season_sample'
```

Root-level `npm run barrels` (or `make barrels`) regenerates barrel `index.ts` files via barrelsby — needed after adding new files to directories listed in the barrel-enforcing eslint rule (see below). It chains `barrels:lint` (`eslint --fix` over the frontend barrels) because barrelsby writes its own `@file` banner and drops the `// src/frontend/...` path comment. Regeneration is one-shot: barrelsby 2.8.1 ships no watch mode.

Composite component folders (an `index.tsx` root plus internal files) must be added to `exclude` in `barrelsby.json`, or barrelsby flattens them into the parent barrel and re-exports their internals — which is how a duplicate export can break the build.

## Rule files

`.claude/rules/` holds 22 per-technology rule files, loaded contextually via `paths` frontmatter rather than always-on. They were written from `package.json` / `package-lock.json` and upstream docs only — deliberately **without reading this codebase** — so that divergence between the rules and the code stays visible instead of being ratified. They are most useful for the version-specific traps: Tailwind v3 vs v4 utility names, TypeScript 6.0's changed defaults, Express 5 routing, Jest 30's renamed flags, Prisma 7's explicit adapter, TSDoc's tags versus JSDoc's.

Where sources disagree:

1. **Machine enforcement** (the custom ESLint rules, `app.conventions.spec.ts`, the `openapi-drift` CI job) — not an opinion, it fails the build.
2. **This file** — project decisions, stated by the maintainer.
3. **`.claude/rules/`** — authoritative on library and version behaviour; blind to project decisions.

A conflict between 2 and 3 is a signal, not noise: either this file is stale or a rule overreached. Surface it rather than silently picking one. Do not edit a rule file to match what the code currently does — that inverts the whole point.

## Repository-specific conventions

These are enforced by custom ESLint rules in `src/backend/eslint-rules/` and `src/frontend/eslint-rules/`, so violations fail lint/CI, not just style review:

- **File path header comment**: every `.ts`/`.tsx` file must start with a comment giving its own path relative to `src/backend` or `src/frontend`, e.g. `// src/backend/modules/teams/teams.service.ts`. Autofixable via `lint:fix`.
- **Barrel imports required**: import from the barrel (`@modules/teams/dto`) rather than a direct file path. Autofixable. The backend rule keeps a fixed list in `enforce-barrel-import.js`; the frontend rule derives its list from the root `barrelsby.json` — including that file's `exclude` patterns, so a file barrelsby is told to skip has no barrel form and is imported by path.
- **Frontend component organization** (structure of `features/*` — composite folders with `index.tsx` roots, hooks/types placement, depth cap, naming): defined in `docs/frontend-conventions.md`, enforced by the structure rules in `src/frontend/eslint-rules/`. Features not yet migrated are allowlisted in `LEGACY_FEATURES` in `eslint.config.mjs` — never add entries.

## Backend architecture

- Feature modules live under `src/backend/modules/<feature>/` (e.g. `teams`, `matches`, `players`, `stats`), each with its own `*.controller.ts`, `*.service.ts`, `*.module.ts`, and `dto/`. `competitions` and `organizations` are parent modules with nested sub-modules (`competitions/championships`, `organizations/clubs`, etc.).
- Prisma is the ORM and owns the schema: edit `src/backend/prisma/schema.prisma`, then generate a migration with `npx prisma migrate dev --name <change>`. Migrations (including the `1_seed_static_data` reference-data seed) live in `src/backend/prisma/migrations` and are applied everywhere — dev and prod — by the one-shot `migrate` compose service running `prisma migrate deploy` before the backend starts. Never edit an applied migration — `migrate deploy` doesn't checksum the ones it has already applied, so an edit is silently ignored everywhere it already ran and only takes effect on a fresh database; the `migration-immutability` CI job enforces this (`make refresh-static-data` is the one sanctioned exception — see `docs/data-pipeline.md`). CHECK constraints, triggers, and partial indexes are hand-maintained in migration SQL because PSL cannot express them.
- All responses are wrapped by a global `TransformInterceptor` into a `{ data, timestamp, path, statusCode }` envelope; list endpoints add `meta.count`, paginated endpoints nest pagination info inside `data`. Errors go through a global `AllExceptionsFilter` that also forwards to Sentry.
- **API conventions** (mechanically enforced by `app.conventions.spec.ts` and `app.swagger.spec.ts`; full writeup + new-endpoint checklist in `docs/api.md`): every `@Query()` binds a validated DTO class (no primitives, no inline pipes); paginated DTOs extend `PaginationQueryDto` (max limit 100, defaults via `resolvePagination`); enum params use `@IsEnum` against `common/constants`; integers use `@IsInt`; name search is always the `search` param; list endpoints return `[]` on empty, only by-id endpoints 404; response DTOs use real nested classes (never `type: Object`) and `@ApiProperty({ nullable: true })` for nullable-but-present fields.
- **OpenAPI contract**: `docs/openapi.json` is the committed snapshot (regenerate: `npm run build && node dist/scripts/generate-openapi.js` in `src/backend`); the frontend generates `shared/types/api.generated.ts` from it (`npm run typegen`). The `openapi-drift` CI job fails when either is stale, and the deploy depends on it — after any DTO change, regenerate both and commit.
- **Runtime smoke test after build-affecting changes** (nest-cli.json, main.ts, tsconfig, global DTO wiring): `nest build` + `node dist/main.js` must log "Starting Nest application" — a startup-only crash otherwise reaches prod, since CI has no runtime stage (see the swagger-plugin incident, PRs #224–#226).

## Frontend architecture

- Pages live under `src/frontend/app/[locale]/(public)/`; feature logic (components, hooks, API calls) lives under `src/frontend/features/<feature>/`, shared UI under `src/frontend/shared/`.
- **Interactive shared primitives wrap react-aria-components** — `Button`, `IconButton`, `Select`, `ComboBox`, `MultiSelect`, `TextField`, `SearchField`, `Switch`, `SegmentedControl`, `ToggleChips`, `Tabs`, `LinkMenu`, the header's menus, the docs disclosures. React Aria owns behaviour, focus and ARIA; the wrapper owns the look and a narrow prop API, takes React Aria's names (its components imported as `Aria*`), and takes its copy as props, never through a translation hook. Where React Aria ships a primitive, wrap it rather than hand-rolling one; there is no Radix component left. This overrides `component-decomposition.md`'s "hand-rolled, not shadcn/ui". Two traps: a `"use client"` primitive turns every helper it exports into a client reference, so variant functions a server component calls live in a plain `*Styles.ts` (`buttonStyles.ts`, `dropdownStyles.ts`); and popovers portal to `<body>`, which sits under a native `<dialog>`'s top layer, so `BottomSheet` provides `UNSAFE_PortalProvider` for anything opened inside it.
- **One service module per feature**: `x.service.ts` declares each backend endpoint once, over `request` in `lib/services/api.ts` — native `fetch`, callable from a server component and from a TanStack Query function alike. On the server it reaches the backend over the Docker network (`INTERNAL_API_URL`) and keeps the response in Next's Data Cache for the module's `ServerRevalidate` tier; in the browser it goes through `NEXT_PUBLIC_API_URL`. Either way it unwraps the `{ data }` envelope and throws an `ApiError` on a non-2xx response. Server components and query functions import the same `xService` from the `api/` barrel; a query function passes TanStack's `signal`, a server component calls the method bare.
- **Query Options pattern** for client data fetching, four files per feature: a key factory (`xKeys.ts`), a query options factory (`xQueries.ts`, single source of truth for query key + fn + cache config), thin hooks (`useX.ts` — camelCase, enforced by `enforce-file-naming.js`) that components actually import, and prefetch helpers exported from the queries file for hover/focus-triggered prefetching.
- **`"sideEffects": ["*.css"]`** in `src/frontend/package.json` is what lets a bundler drop the unused half of a barrel. It asserts that nothing but a stylesheet does work at import time, so a new module that *does* — a polyfill, a registration, anything imported as a bare `import "./x"` — has to be added to that array or it will be shaken out. Its counterpart for server components is `experimental.optimizePackageImports` in `next.config.js`, which lists every barrel from `barrelsby.json` (via `barrels.js`) so a server component importing a barrel doesn't ship every `"use client"` module in it. See `docs/frontend.md`.
- Cache `staleTime`/`gcTime` are set per feature based on how often the underlying data changes (see `docs/frontend.md` for the current table) — match new queries to an existing category rather than picking arbitrary values.

## Looking up library documentation

Several dependencies sit at or past the model's training cutoff, so recalled APIs are likely to be wrong. Two ways to get real docs, in this order:

**1. First-party `llms.txt`** — authoritative, free, just `WebFetch` it. Each is an index; follow its links to the specific page rather than pulling the multi-MB `llms-full.txt` variant.

- Next 15 App Router (fetch caching, `revalidate`, prerendering vs `force-dynamic`) — `https://nextjs.org/docs/llms.txt`
- Prisma 7.x (client API, `@prisma/adapter-pg`, migrations) — `https://www.prisma.io/docs/llms.txt`, and check `https://www.prisma.io/changelog.md` for breaking changes first, as that index itself instructs
- NestJS 11 — `https://docs.nestjs.com/llms.txt`

**2. Context7** (`/context7:docs <library> <query>`, or its auto-triggering skill) — for the libraries with no `llms.txt`: **next-intl 4.x**, **TanStack Query 5.x**, **MapLibre 5.x**, **Sentry 10.x**, **TypeScript 6.x**.

Don't look up this repo's own conventions — the barrel rules, the one-service-per-feature layer, the Query Options pattern, and the API conventions are settled here and in `docs/`, not upstream. Upstream docs describe the library, not how this project uses it; when the two disagree, this file wins.

## Data pipeline

Two distinct data sources, handled differently:
- **Static** (competition structure, geography) — real French basketball data for metropolitan France, scraped from FFBB's public site (`scripts/ffbb-import/`) and geocoded via the French government's BAN API, seeded by the `1_seed_static_data` Prisma migration and applied with the schema by `prisma migrate deploy`. Re-run with `make refresh-static-data` when it needs refreshing; see `docs/data-pipeline.md`.
- **Dynamic** (match results, stats, shot charts) — generated continuously by the Python scheduler (`src/backend/db/python`, run as the `scheduler` Docker service), organized into `generation/` (season/match/playtime generation), `simulation/` (match simulator + game state manager), and `db/` (repository layer). The scheduler uses checkpoints to avoid reprocessing already-handled matches.

## Known limitations (intentional, not oversights)

- No hosted staging environment — CI-passing changes deploy straight to the single production VPS.
- Match data is simulated, not from a live feed (portfolio project).
- Single VPS node — no horizontal scaling or DB replication.
