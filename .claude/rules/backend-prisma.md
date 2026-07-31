---
description: Prisma 7 — generated client, driver adapter, migrations, and query patterns.
paths:
  - "src/backend/prisma/**"
  - "src/backend/prisma.config.ts"
  - "src/backend/**/*.ts"
---

# Backend — Prisma

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

**Applies to:** `src/backend`. **Locked:** `@prisma/client@7.8.0`, `prisma@7.8.0`, `@prisma/adapter-pg@7.8.0`, `pg@8.16.3`. `[manifest]`

The database is PostgreSQL, inferred from `@prisma/adapter-pg` + `pg`. `[manifest]`

**Prisma 7 is a major break from 6.** Almost every Prisma example online predates it. The five changes below are the ones that make old code simply not work. `[upstream]`

## 1. Generated client, explicit output path

- The `prisma-client-js` provider is deprecated. Use `prisma-client` with a **required** `output`: `[upstream]`

  ```prisma
  generator client {
    provider = "prisma-client"
    output   = "./generated/prisma"
  }
  ```
- **Import from the generated path, not from `@prisma/client`:** `[upstream]`

  ```ts
  import { PrismaClient } from './generated/prisma/client';
  ```
- The generated directory is build output. Never edit it; treat it the way `api-contract.md` treats `api.generated.ts`. `[principle]`

## 2. `prisma generate` is no longer automatic

- It does not run on install. The backend scripts already handle this — `prestart:dev`, `build`, and `test` all run it explicitly. `[manifest]`+`[upstream]`
- After **any** schema change, run `npm run prisma:generate` before anything type-checks. Errors of the form "property does not exist on PrismaClient" after a schema edit mean generation has not run. `[upstream]`+`[principle]`
- Do not remove `prisma generate` from those scripts as an optimisation. A CI cache that skips it produces a build against a stale client. `[manifest]`+`[principle]`

## 3. A driver adapter is mandatory

- All databases now require an explicit adapter, and the `PrismaClient` constructor signature changed accordingly: `[upstream]`

  ```ts
  import { PrismaPg } from '@prisma/adapter-pg';
  import { PrismaClient } from './generated/prisma/client';

  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  ```
- **Connection-pool defaults differ from v6.** If you see timeouts under load that did not exist before, configure the pool rather than raising timeouts. `[upstream]`
- Create the client **once** and provide it through Nest's DI container. A client per request exhausts the pool. `[principle]`

## 4. `prisma.config.ts` and environment variables

- Datasource configuration moved out of `schema.prisma` into a root-level `prisma.config.ts`: `[upstream]`

  ```ts
  import { defineConfig, env } from 'prisma/config';

  export default defineConfig({
    schema: 'prisma/schema.prisma',
    datasource: { url: env('DATABASE_URL') },
  });
  ```
- **`.env` files are no longer loaded automatically.** Load them explicitly (e.g. `dotenv`) or supply the variables from the environment. A "missing DATABASE_URL" that used to work is usually this. `[upstream]`
- Never commit a real connection string. `[principle]`

## 5. Removed APIs

- **Client middleware (`$use`) is removed** — use Client Extensions instead. `[upstream]`
- The metrics preview feature is removed. For backend metrics, `prom-client` is what is installed — see `backend-observability.md`. `[upstream]`+`[manifest]`
- CLI flags removed: `--skip-generate` and `--skip-seed` on `migrate dev`; `--schema` and `--url` on `db execute`; `migrate diff`'s `--from-url` is now `--from-config-datasource`. `[upstream]`
- **Seeding is no longer automatic** on `migrate dev` / `migrate reset`. Run `prisma db seed` yourself. `[upstream]`

## Migrations

- `npm run prisma:migrate-dev` (`prisma migrate dev`) is for local development. It can drop and recreate data. `[manifest]`
- `npm run prisma:migrate-deploy` (`prisma migrate deploy`) is for CI and production. It only applies committed migrations. `[manifest]`
- **Never run `migrate dev` against a shared or production database.** `[principle]`
- Migration files are committed artifacts. Never edit an applied migration — add a new one. `[principle]`
- Review generated SQL before committing. Renames in particular are often emitted as drop-and-create, which discards data. `[principle]`
- Ship destructive schema changes in stages: add the new column, backfill, migrate readers and writers, then drop the old one in a later release. `[principle]`

## Querying

- Keep Prisma calls behind a service. Controllers must not hold a `PrismaClient`. `[principle]`
- `select` only what you need rather than returning whole rows by default — it bounds payloads and stops accidental leakage of sensitive columns. `[principle]`
- Every unbounded `findMany` is a future incident. Paginate. `[principle]`
- Avoid N+1: fetch relations with `include`/`select` in one query rather than looping. `[principle]`
- Use `$transaction` for multi-write operations that must succeed or fail together. `[principle]`
- Prefer Prisma's typed API over `$queryRaw`. When raw SQL is genuinely needed, use the tagged-template form so parameters are bound — never build SQL by string concatenation. `[principle]`

## ESM

- Prisma 7 ships as an ES module and its migration guidance is to set `"type": "module"` with `module: "ESNext"` / `moduleResolution: "bundler"`. `[upstream]`
- **`src/backend/package.json` has no `"type"` field**, and the build path is `nest build` + `tsc-alias`. `[manifest]`
- Those two facts have to be reconciled deliberately — read the tsconfig's `module` and `moduleResolution` before changing anything here. A module-format change affects Nest, `tsc-alias`, ts-jest, and Prisma at once, and each of them fails differently. `[principle]`
