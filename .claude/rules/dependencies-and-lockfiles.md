---
description: Installing dependencies, version-range policy, and the drift between the two applications.
paths:
  - "package.json"
  - "src/frontend/package.json"
  - "src/backend/package.json"
  - "package-lock.json"
  - "src/frontend/package-lock.json"
  - "src/backend/package-lock.json"
---

# Dependencies and lockfiles

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

## Installing

- All three lockfiles are `lockfileVersion: 3`, which requires npm 7 or newer. Combined with `engines.node >= 24`, npm 10+ is what you will actually have. `[manifest]`
- Use `npm ci` for reproducible installs (CI, containers, fresh clones) and `npm install` **only** when you intend to change dependencies. `npm ci` installs exactly the lockfile; `npm install` may rewrite it. `[principle]`
- There are no workspaces, so a full setup is three installs — root, `src/frontend`, `src/backend`. `[manifest]`
- A dependency change is a two-file change: the `package.json` and the `package-lock.json` next to it. Commit them together. `[principle]`
- Never resolve a lockfile merge conflict by deleting the lockfile and reinstalling — that silently upgrades every transitive dependency in the same commit. Re-run the dependency change on top of the incoming lockfile instead. `[principle]`

## Version-range policy already in force

The manifests encode a deliberate split. Preserve it.

- `prettier` is pinned to exactly **`3.7.4`** — no caret — in all three manifests. Keep it pinned and keep the three in lockstep. A formatter minor bump rewrites the entire tree and buries real changes in reformatting noise. `[manifest]`+`[principle]`
- Everything else uses caret ranges. That is fine for tools whose output is not committed and for libraries covered by tests. `[manifest]`+`[principle]`
- General rule: **pin tools whose output you commit** (formatters, code generators), **range tools whose output you don't** (linters, type checkers, test runners). `[principle]`

## Version drift between the two applications

These are real, currently-locked mismatches. Do not assume the two applications behave identically.

| package | frontend locked | backend locked |
|---|---|---|
| `eslint` | `9.39.4` | `9.39.2` |
| `eslint-plugin-sonarjs` | `3.0.7` | `3.0.5` |

- They declare **different** eslint ranges — `src/frontend` `^9.39.2`, `src/backend` `^9.20.1` — so the drift is a declared one, not merely a lockfile artefact. Lint results can legitimately differ between the two projects; when a rule fires in one and not the other, check the locked versions before hunting for a config difference. `[manifest]`
- `typescript` (`6.0.3`), `@typescript-eslint/*` (`8.59.3`), `prettier` (`3.7.4`), `barrelsby` (`2.8.1`), `eslint-plugin-simple-import-sort` (`12.1.1`), and `organize-imports-cli` (`1.0.2`) **are** aligned across both applications. Keep them that way — divergence there would cause the two projects to disagree about formatting or type semantics. `[manifest]`+`[principle]`

## The root toolchain resolves a different TypeScript

- The root project has no declared `typescript`; it resolves `typescript@5.9.3` transitively, as a peer of `prettier-plugin-organize-imports@4.3.0`. Both applications resolve `typescript@6.0.3`. `[manifest]`
- `prettier-plugin-organize-imports` drives TypeScript's own `organizeImports` service, so its behaviour is coupled to whichever TypeScript it resolves. Running the root-installed plugin over application code would organise imports under **5.9** semantics while the application type-checks under **6.0**. `[upstream]`+`[manifest]`
- Because Node resolves upward through `node_modules`, that root plugin *is* importable from `src/frontend` and `src/backend`. Do not let either application's Prettier config depend on it. See `imports-and-barrels.md`. `[manifest]`+`[principle]`
- If the root formatting toolchain is kept, declare `typescript` explicitly in the root manifest instead of relying on a transitive hoist. `[manifest]`+`[principle]`

## Undeclared-but-used dependencies

- `date-fns@4.1.0` resolves in **both** projects, but only `src/frontend` declares it. The backend gets it transitively through `date-fns-tz`. If backend code imports `date-fns` directly, declare it in `src/backend/package.json`. `[manifest]`+`[principle]`
- **`@types/node` must be declared by any project whose tsconfig names `node` in `types`.** Under TypeScript 6 the `types` compiler option defaults to `[]`, so the package is only in scope if the tsconfig names it — and naming it only works if the manifest guarantees the package is there. A transitive resolution is not that guarantee: it can disappear under an unrelated dependency bump, and the failure surfaces as `Cannot find name 'process'` in a project nobody touched. `[manifest]`+`[upstream]`
- `src/frontend` does **not** declare `eslint-config-next`; it declares `@next/eslint-plugin-next` directly. The flat config must therefore wire that plugin and its rules by hand. `[manifest]`

## `overrides`

- `src/frontend` pins `openapi-typescript`'s nested `typescript` to `$typescript`. `openapi-typescript@7.13.0` declares `typescript: ^5.x` as a **peerDependency**, which the project's own `^6.0.3` does not satisfy — so this is not an optimisation that avoids a second copy, it is what lets `npm ci` complete at all. Remove it and the install fails outright. `[manifest]`
- Keep that override in place. Removing it lets the code generator run under a different compiler than the one that type-checks the generated output. `[manifest]`+`[principle]`
- Add a new `overrides` entry only to resolve a concrete duplicate-or-incompatible-version problem, and leave a comment in the PR explaining what broke. Overrides silently defeat a package's own peer expectations. `[principle]`
