---
description: ESLint 9 flat config and Prettier 3 — config resolution, scripts, and the division of labour.
paths:
  - "src/frontend/eslint.config.mjs"
  - "src/backend/eslint.config.mjs"
  - "**/.prettierrc*"
  - "package.json"
  - "src/frontend/package.json"
  - "src/backend/package.json"
---

# Linting and formatting

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

**Locked:** `eslint@9.39.4` (frontend) / `9.39.2` (backend), `prettier@3.7.4` (all three projects, pinned). `[manifest]`

> This file states what the ESLint and Prettier configs **must satisfy**, not what they currently contain. Where a config disagrees, the config is what changes.

## ESLint 9 — flat config only

- ESLint 9 uses **flat config**. The file is `eslint.config.js`, `.mjs`, or `.cjs` (TypeScript variants also supported). `.eslintrc*` is not used. `[upstream]`
- Config lookup starts at the **current working directory** and walks **upward**. This is the opposite of Prettier. `[upstream]`
- Consequence for this repo: `npm run lint` in `src/frontend` resolves the config from `src/frontend` upward, and the root `barrels:lint` script `cd`s into `src/frontend` first precisely so that the frontend's config applies. Running `eslint` from the repo root would resolve a different config — or none. **Always lint from inside the application directory.** `[manifest]`+`[upstream]`
- Author configs with `defineConfig()` and `globalIgnores()` from `eslint/config`: `[upstream]`

  ```js
  import { defineConfig, globalIgnores } from 'eslint/config';

  export default defineConfig([
    globalIgnores(['dist/**', '**/*.generated.ts']),
    { files: ['**/*.ts'], rules: { /* … */ } },
  ]);
  ```
- `ignores` used **alone** in a config object (plus an optional `name`) is a **global** ignore. `ignores` alongside any other key only scopes *that* object. Mixing these up is the usual reason "my ignore doesn't work." `[upstream]`
- Config objects are merged in array order; later matching objects override earlier ones. Order base → specific. `[upstream]`
- Generated files must be globally ignored — the frontend's `shared/types/api.generated.ts` in particular. Linting generated output produces failures nobody can fix. `[manifest]`+`[principle]`

## Running ESLint

- **Quote your globs.** `eslint '**/*.{ts,mts,tsx}'` hands the pattern to ESLint; unquoted, the shell expands it and the result varies by shell. Both applications' `lint` scripts already quote correctly — preserve that when editing them. `[upstream]`+`[manifest]`
- Exit codes: `0` clean, `1` lint errors (or `--max-warnings` exceeded), **`2` = configuration or internal error**. A `2` means the setup is broken, not that the code is bad — never "fix" it by editing source. `[upstream]`
- `--fix` writes files in place. Do not run it over a dirty working tree; you will not be able to tell your edits from the tool's. `[upstream]`+`[principle]`
- `--no-warn-ignored` suppresses the "File ignored" warnings when an ignored path is passed explicitly — useful when a script's glob overlaps the ignore list. `[upstream]`
- `--cache` (`.eslintcache`) is available if lint time becomes a problem; it must be gitignored. `[upstream]`+`[principle]`

## The application scripts

| project | `lint` | `lint:fix` |
|---|---|---|
| `src/frontend` | `eslint '**/*.{ts,mts,tsx}'` | `organize-imports-cli './**/*.ts' './**/*.tsx' && eslint '**/*.{ts,mts,tsx}' --fix` |
| `src/backend` | `eslint '**/*.ts'` | `organize-imports-cli './**/*.ts' && eslint '**/*.{ts,tsx}' --fix` |

`[manifest]`

- The two are **not symmetric**: the frontend's `lint` covers `.mts` but its `lint:fix` does not pass `.mts` to `organize-imports-cli`; the backend's `lint:fix` covers `.tsx` although its `lint` does not. Treat the `lint` globs as authoritative and be aware that `lint:fix` may not touch every file `lint` checks. `[manifest]`
- `organize-imports-cli` runs **before** `eslint --fix` in both. See `imports-and-barrels.md` — only one of these may own import order. `[manifest]`

## Installed plugins

Both applications: `@typescript-eslint/eslint-plugin` + `parser` (`8.59.3`), `eslint-plugin-simple-import-sort` (`12.1.1`), `eslint-plugin-sonarjs`. Frontend adds `@next/eslint-plugin-next` (`15.5.18`), `eslint-plugin-jsx-a11y` (`6.10.2`), `eslint-plugin-react-hooks` (`7.1.1`). `[manifest]`

- The frontend does **not** install `eslint-config-next`. The Next.js rules must be wired manually from `@next/eslint-plugin-next` in the flat config — there is no preset package doing it for you. `[manifest]`
- `eslint-plugin-react-hooks@7` exposes two flat presets, `reactHooks.configs.flat.recommended` and `reactHooks.configs.flat['recommended-latest']`, and **both are the React Compiler ruleset**. v7 moved the Compiler rules *into* `recommended`: it is 16 rules, of which only `rules-of-hooks` and `exhaustive-deps` are the classic pair. `recommended-latest` is the same 16 plus `void-use-memo`. `[upstream]`
- **Do not spread either preset to obtain the classic pair.** Enable the two rules by name. Spread over a codebase not written under the Compiler's assumptions, the preset turns ordinary mounted-flag effects, sync-from-prop effects and manual memoization into errors, and any lint gate in CI goes red. `[upstream]`+`[principle]`

  ```js
  import reactHooks from 'eslint-plugin-react-hooks';

  export default defineConfig([
    {
      plugins: { 'react-hooks': reactHooks },
      rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
      },
    },
  ]);
  ```
- Adopting the Compiler ruleset is a **separate project decision** with real remediation behind it, not a preset spread. `[principle]`
- Do not silence `react-hooks/exhaustive-deps` with a blanket disable comment. If a dependency genuinely must be omitted, restructure the effect. `[principle]`
- `eslint-plugin-sonarjs` reports complexity and duplication. Treat a new sonarjs finding as a design signal, not a lint chore. `[principle]`

## Prettier 3

- Prettier resolves its config **upward from the file being formatted**, not from the cwd. A config in `src/frontend` beats one at the repo root for frontend files. Again: opposite of ESLint. `[upstream]`
- Prettier 3 has **no automatic plugin discovery**. Every plugin must be listed in the `plugins` array (or passed via `--plugin`). A plugin that is merely installed does nothing. `[upstream]`
- Do **not** add `prettier-plugin-organize-imports` to an application's `plugins` array — it belongs to the root project and resolves a different TypeScript. See `imports-and-barrels.md`. `[manifest]`+`[upstream]`
- Never set `parser` at the top level of a Prettier config; it belongs only inside `overrides`, so automatic parser inference keeps working for every other file type. `[upstream]`
- Config file precedence is `package.json` `"prettier"` key → `.prettierrc` → `.prettierrc.json`/`.yml`/`.yaml`/`.json5` → `.js`/`.ts` → `.mjs`/`.mts` → `.cjs`/`.cts` → `.prettierrc.toml`. Keep exactly one per project. `[upstream]`
- Both applications expose `format` (`prettier --write .`) and `format:check` (`prettier --check .`). Use `--check` in CI; it is non-mutating and exits non-zero on drift. `[manifest]`+`[principle]`
- Formatting is never a code-review topic. If people are arguing about it, the config is wrong — fix the config, not the diff. `[principle]`

## Division of labour

- **Prettier owns whitespace and layout. ESLint owns correctness.** Do not enable ESLint rules that restate formatting; they will fight Prettier and produce unresolvable `--fix` loops. `[principle]`
- Before opening a PR, from inside the changed application: `npm run lint`, `npm run format:check` (frontend), and `npm run typecheck` (frontend) or `npm run build` (backend). `[manifest]`+`[principle]`
