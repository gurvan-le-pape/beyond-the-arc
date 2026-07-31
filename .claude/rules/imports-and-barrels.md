---
description: Barrel files are generated output, and exactly one tool may own import order.
paths:
  - "barrelsby.json"
  - "src/frontend/**/*.ts"
  - "src/frontend/**/*.tsx"
  - "src/frontend/**/*.mts"
  - "src/backend/**/*.ts"
---

# Imports and barrel files

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

## Barrels are generated output

- `index.ts` barrel files are produced by `barrelsby@2.8.1` from `./barrelsby.json`, via the root scripts `npm run barrels` (one-shot) and `npm run barrels:watch`. `[manifest]`
- **Never hand-edit a generated `index.ts`.** Change the source tree or `barrelsby.json` and regenerate. A hand edit is erased by the next run, silently. `[principle]`
- `npm run barrels` chains into `barrels:lint`, which runs `cd src/frontend && npx eslint --fix '**/index.ts'` — so generated frontend barrels are auto-fixed to satisfy the frontend's lint rules. `[manifest]`
- `barrels:lint` covers **`src/frontend` only**. `src/backend` also declares `barrelsby`, and its barrels are not lint-fixed by that script. If you regenerate backend barrels, lint them yourself from `src/backend`. `[manifest]`
- Regeneration must be idempotent: after `npm run barrels`, `git status` should be clean unless the source tree actually changed. A persistent diff means `barrelsby.json` and the tree disagree — fix the config, don't commit the churn. `[principle]`

> `barrelsby.json` is what decides where barrels appear and what they contain — read it rather than assuming. The options that determine output shape are `location` (`top` / `below` / `all` / `replace` / `branch`), `structure` (`flat` / `filesystem`), `name` (defaults to `index.ts`), `delete`, `include`/`exclude`, `exportDefault`, and `local`. `[upstream]`

## Barrels cause import cycles — import siblings directly

- A module that imports from *its own* barrel creates a cycle: the barrel re-exports the module that is asking for it. `[principle]`
- Import siblings and internal neighbours by direct path. Reserve the barrel for consumers **outside** the directory it fronts. `[principle]`

  ```ts
  // widgets/widget-factory.ts

  // Wrong — pulls in the barrel that re-exports this very file
  import { Thing } from './index';

  // Right — direct path to the sibling
  import { Thing } from './thing';
  ```
- Barrels also defeat tree-shaking when they front modules with side effects, because importing one name pulls the whole barrel's module graph. Keep barrel-fronted directories free of top-level side effects. `[principle]`

## Exactly one tool may own import order

This repo currently installs **three** mechanisms that reorder imports:

| mechanism | where | what it does |
|---|---|---|
| `organize-imports-cli@1.0.2` | both applications, in `lint:fix` | runs TypeScript's `organizeImports` over the files |
| `eslint-plugin-simple-import-sort@12.1.1` | both applications, devDependency | ESLint rules that sort imports/exports |
| `prettier-plugin-organize-imports@4.3.0` | **root** project only | Prettier plugin that runs `organizeImports` on format |

`[manifest]`

- Upstream is explicit: when `prettier-plugin-organize-imports` is active you must **disable any ESLint import-ordering rules**, because the two fight over the same lines. `[upstream]`
- The plugin also **overrides Prettier's `babel`, `babel-ts`, `typescript`, and `vue` parsers**, so only one plugin exporting those parsers can win — the last one loaded. `[upstream]`
- Therefore: **do not add `prettier-plugin-organize-imports` to either application's Prettier config.** It lives in the root project, where it resolves `typescript@5.9.3`, while both applications type-check under `6.0.3` — it would organise imports under one compiler's semantics and check them under another's. `[manifest]`+`[upstream]`
- Inside the applications, pick one owner and make the other inert:
  - If **`simple-import-sort`** owns ordering, its rules must be enabled in the flat config and `lint:fix` must run `eslint --fix` **after** anything else that touches imports (which the current `lint:fix` scripts already do — `organize-imports-cli` runs first, then `eslint --fix`). `[manifest]`+`[principle]`
  - If **`organize-imports-cli`** owns ordering, `simple-import-sort`'s sort rules must be off, or `lint:fix` will produce a different result than `lint` accepts. `[upstream]`+`[principle]`
- Symptom that the conflict is live: `npm run lint:fix` succeeds, then `npm run lint` immediately fails on import order, or the two commands ping-pong the same file. `[principle]`
- Escape hatches, if you need them: `organizeImports` skips any file containing `// organize-imports-ignore`, and `organizeImportsSkipDestructiveCodeActions: true` stops it removing unused imports. `[upstream]`

**`simple-import-sort` is the owner here.** Both applications enable `simple-import-sort/imports` and `simple-import-sort/exports` at `error`, so `lint` rejects any other order; and `lint:fix` runs `organize-imports-cli` first and `eslint --fix` second, so ESLint gets the last word. `prettier-plugin-organize-imports` is inert — it is a root devDependency and the root `.prettierrc.json` declares no `plugins` key, so Prettier never loads it. Adding a `plugins` entry to any Prettier config activates the conflict described above. `[project]`

## Unused imports are removed automatically

- `organizeImports` **deletes unused imports** — that is a code transformation, not formatting. Expect `lint:fix` to remove imports you added but haven't wired up yet. `[upstream]`
- In the frontend, an unused-looking `React` import will be stripped unless `tsconfig.json` sets `"jsx": "react"`. With Next.js's automatic JSX runtime that import is unnecessary anyway — don't add it back. `[upstream]`+`[manifest]`

## Import hygiene

- Import from the narrowest correct path. Reaching through a barrel to get one symbol from deep inside another feature couples you to that feature's internal layout. `[principle]`
- Do not create a barrel just to shorten an import. Barrels are a public-surface tool: one per module boundary, fronting what the boundary genuinely exports. `[principle]`
- Generated files are consumed, never re-exported through a hand-written wrapper that adds nothing — it doubles the surface you have to keep in sync. `[principle]`
