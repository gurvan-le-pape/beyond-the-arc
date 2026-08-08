---
description: Repo layout — three independent npm projects, which scripts belong where, Node runtime floor.
paths:
  - "package.json"
  - "src/frontend/package.json"
  - "src/backend/package.json"
  - "package-lock.json"
  - "src/frontend/package-lock.json"
  - "src/backend/package-lock.json"
---

# Project layout

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

## Three independent npm projects

- The repo contains **three separate npm projects**, each with its own `package.json` **and its own `package-lock.json`**: the repo root, `src/frontend` (`"name": "frontend"`), and `src/backend` (`"name": "backend"`). `[manifest]`
- The root manifest declares **no `workspaces` key**. These are not npm workspaces — there is no hoisting contract and no single install. Install each project separately. `[manifest]`
- The root project is **tooling-only**: its sole dependencies are `barrelsby`, `eslint`, `prettier`, and `prettier-plugin-organize-imports`, and its only scripts are `barrels` and `barrels:lint`. A runtime dependency appearing in the root manifest is a mistake. `[manifest]`
- `src/frontend` owns the Next.js app; `src/backend` owns the NestJS service. Application code, application dependencies, and application scripts belong to one of those two — never to the root. `[manifest]`
- **One exception: a cross-cutting generator.** A tool that must see *both* applications at once to do its job belongs to the root, even though its inputs and outputs are application code — splitting it would mean two configs and two sources of truth for one convention. `barrels` is that case: a single `barrelsby.json` enumerates 88 directories, 71 in `src/frontend` and 17 in `src/backend`, and none at the root. The test is **what the tool must read**, not what it writes: a script that only ever touches one application belongs in that application. `[manifest]`+`[principle]`
- A `barrelsby` declaration in an *application* manifest is therefore the mistake, not the root script — the root copy is the one that runs. `[manifest]`

> `src/frontend` and `src/backend` are the only application projects. A fourth npm project appearing in the tree means this file needs updating — not working around.

## Run scripts from the owning project

- Run an npm script from the directory whose `package.json` declares it. `npm run build` means one thing in `src/frontend` (`next build`) and a completely different thing in `src/backend` (`prisma generate && nest build …`). `[manifest]`
- Only two scripts exist at the root — `barrels` and `barrels:lint`. There is no root `build`, `test`, `lint`, or `format`. Do not invent one; go to the project that has it. `[manifest]`
- Tool config resolution is cwd-sensitive, so running a tool from the wrong directory can silently pick up the wrong config rather than failing. Always `cd` into the project first. `[upstream]`+`[principle]`

## Node runtime

- Both applications declare `"engines": { "node": ">=24.0.0" }`. Use Node 24 or newer for all three projects. `[manifest]`
- The **root** manifest declares no `engines`. Treat Node >= 24 as the repo-wide floor anyway, since the root tooling formats and lints code compiled for that floor. `[manifest]`+`[principle]`
- Node 24 strips TypeScript types natively for `.ts`/`.mts`/`.cts`, so a `.mts` script can be run directly with `node` and no build step. That path has hard constraints — see `typescript.md` before writing one. `[upstream]`

## Known gaps in the current layout

State these rather than working around them silently.

- The root `barrels:lint` script only runs ESLint inside `src/frontend`, so barrels regenerated under `src/backend` are **not** lint-fixed. Both applications also still declare `barrelsby` themselves; those declarations are dead — nothing invokes them — and are the mistake described above, not a second entry point. `[manifest]`
- Neither application manifest sets `"private": true`, and both are stuck at `"version": "1.0.0"`. Neither is intended for npm publication. `[manifest]`+`[principle]`
- Neither application manifest declares `@types/node`, yet both resolve it transitively (backend `25.0.3`, frontend `25.7.0`). Under TypeScript 6 this matters — see `typescript.md`. `[manifest]`

## Adding a dependency

- Add it to the project that imports it, then commit that project's `package-lock.json` in the same change. `[principle]`
- Never rely on a package resolving through an ancestor `node_modules`. Node's upward resolution means a root-installed package *is* importable from `src/frontend`, but the dependency is then invisible to that project's manifest and lockfile, and breaks the moment the project is installed on its own. `[manifest]`+`[principle]`
- If both applications need the same library, declare it in both. There is no shared package to put it in. `[manifest]`
