---
description: TypeScript 6.0 — changed defaults, removed options, and how to write types here.
paths:
  - "src/frontend/tsconfig*.json"
  - "src/backend/tsconfig*.json"
  - "src/frontend/**/*.ts"
  - "src/frontend/**/*.tsx"
  - "src/frontend/**/*.mts"
  - "src/backend/**/*.ts"
---

# TypeScript

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

**Applies to:** `src/frontend` and `src/backend`, both locked to `typescript@6.0.3`. `[manifest]`

TypeScript 6.0 is a transition release toward the 7.0 native rewrite. It **changed several defaults and removed options that 5.x accepted**. Most surprises in this repo will come from that, not from the language itself.

> This file states what the tsconfigs **must satisfy** under TypeScript 6.0 — not what they currently contain. Where a config disagrees, the config is what changes.

## Defaults that changed in 6.0

| option | 5.x default | 6.0 default |
|---|---|---|
| `strict` | `false` | **`true`** |
| `module` | `commonjs` | **`esnext`** |
| `target` | `es5` | **`es2025`** |
| `types` | all installed `@types` | **`[]`** |
| `rootDir` | inferred from inputs | **`"."`** (the tsconfig's directory) |
| `noUncheckedSideEffectImports` | `false` | **`true`** |
| `libReplacement` | `true` | `false` |

`[upstream]`

- **`types` is the one that bites.** It no longer auto-loads every package under `@types`. If you see `Cannot find name 'process'`, `Cannot find name 'describe'`, or `Cannot find module 'fs'`, the fix is to name them explicitly, not to add a dependency: `[upstream]`

  ```jsonc
  // src/backend/tsconfig.json
  { "compilerOptions": { "types": ["node", "jest"] } }
  ```

  Whatever you list in `types` must be declared in that project's manifest — naming `node` there is only safe if `@types/node` is a declared dependency, not a transitive one. See `dependencies-and-lockfiles.md`. `[manifest]`+`[upstream]`
- If a config previously relied on `rootDir` being inferred from the input file set, it must now set `rootDir` explicitly or the emitted directory structure changes. This matters for the backend, which emits to `dist` and then rewrites paths with `tsc-alias`. `[upstream]`+`[manifest]`
- Do not "fix" a new 6.0 error by turning `strict` back off. Fix the code. `[principle]`

## Removed and deprecated options

- **Removed** — `moduleResolution: classic`, `module: amd` / `umd` / `system` / `none`, `--outFile`, `--target es3`, and the `/// <reference no-default-lib="true"/>` directive. `[upstream]`
- **Deprecated, removed in 7.0** — `--target es5`, `--downlevelIteration`, `moduleResolution: node` / `node10`, and `--baseUrl`. `[upstream]`
- `esModuleInterop`, `allowSyntheticDefaultImports`, and `alwaysStrict` **can no longer be set to `false`**. `[upstream]`
- `baseUrl` being deprecated means `paths` entries must carry their own prefix rather than leaning on a base: `[upstream]`

  ```jsonc
  // Before (relied on baseUrl)        // After
  { "paths": { "@app/*": ["app/*"] } } // { "paths": { "@app/*": ["./src/app/*"] } }
  ```

  The backend's build runs `tsc-alias -p tsconfig.build.json` after `nest build`, which exists specifically to rewrite `paths` aliases into real relative paths in the emitted JavaScript. Any change to `paths` must keep both `tsc` and `tsc-alias` happy. `[manifest]`
- `ignoreDeprecations: "6.0"` silences the deprecation warnings. It buys time; it does not migrate anything, and everything it silences is gone in 7.0. Treat it as a dated TODO, not a solution. `[upstream]`+`[principle]`

## Syntax that is now an error

- `module Foo { }` → use `namespace Foo { }`. `[upstream]`
- `import x asserts { type: "json" }` → use `import x with { type: "json" }`. `[upstream]`

## Command line

- Running `tsc someFile.ts` now **errors** (`TS5112`) when a `tsconfig.json` is present, because the config would be ignored. Use `tsc --noEmit` to check the project (both applications expose a `typecheck` script; the backend's is `tsc --noEmit -p tsconfig.json`, which covers the specs and needs no `prisma generate`) or `tsc --ignoreConfig someFile.ts` for a genuine one-off. `[upstream]`+`[manifest]`
- `--stableTypeOrdering` makes 6.0 match 7.0's deterministic type ordering. It is a compatibility-testing tool and costs up to ~25% type-check time — do not enable it in the normal `typecheck` script. `[upstream]`

## Writing code

- Prefer `unknown` over `any` at boundaries and narrow explicitly. Under 6.0's `strict` default, `any` is the main way real errors escape. `[principle]`
- Use `import type` for type-only imports. It is required for anything Node runs via native type stripping, and it keeps the emitted import graph honest everywhere else. `[upstream]`+`[principle]`
- Prefer discriminated unions over optional-field soup so exhaustiveness is checkable: `[principle]`

  ```ts
  type WidgetState =
    | { status: 'pending' }
    | { status: 'ready'; resource: Resource }
    | { status: 'failed'; reason: string };
  ```
- Do not use `@ts-ignore`. If a suppression is genuinely needed, use `@ts-expect-error` with a one-line reason — it fails the build once the underlying problem is fixed, so it cannot rot. `[principle]`

## `.mts` scripts run directly by Node

`src/frontend` runs `node scripts/check-message-parity.mts` with no build step, and its `lint` glob covers `.mts`. `[manifest]`

Node 24 strips types natively (stable since 24.12.0; disable with `--no-strip-types`), which imposes hard limits on any file executed that way: `[upstream]`

- **Unsupported without `--experimental-transform-types`:** `enum` declarations, namespaces containing runtime code, parameter properties (`constructor(public x: number)`), import aliases, and decorators. `[upstream]`
- `.ts`, `.mts`, `.cts` are handled; **`.tsx` is not**. `[upstream]`
- `import type` is **mandatory** — a value-position import of a type becomes a runtime error, because stripping does not remove it. `[upstream]`
- **No `tsconfig.json` is consulted**, so `paths` aliases and downleveling do not work in these scripts. `[upstream]`
- **File extensions are mandatory** in import specifiers: `import { makeWidget } from './widget.ts'`, not `'./widget'`. `[upstream]`
- Enforce all of this at type-check time with `verbatimModuleSyntax: true` and `erasableSyntaxOnly: true` for the scripts. `[upstream]`
