# Frontend component conventions

> Organization rules for feature code under `src/frontend/features/` — where components, hooks, types, and utils live, how composite components are structured, and how the rules are enforced.

---

## Overview

Every feature follows the same top-level layout: `api/`, `components/`, and — only when they have content — `constants/`, `hooks/`, `types/`, `utils/`. This document defines the rules *inside* that layout. They are mechanically enforced by custom ESLint rules in `src/frontend/eslint-rules/` (see [Enforcement](#enforcement)), so violations fail lint/CI, not just style review.

`shared/components/` has its own settled category-folder layout (`primitives/`, `blocks/`, `table/`, …) and is not covered here.

---

## Components

### Composite folders

A component with private sub-parts gets a **kebab-case folder** whose root is **`index.tsx`**, exporting the PascalCase component:

```
components/detail/match-card/
  index.tsx            ← exports MatchCard
  ScoreDisplay.tsx     ← sub-component, private to the composite
  useMatchCard.ts      ← hook private to the composite
  types.ts             ← view types private to the composite
```

- Consumers import the folder path (`.../detail/match-card`), never a file inside it. Nothing inside a composite folder is exported from the feature barrel.
- No underscore-prefixed root markers (`_MatchCard.tsx`) and no sibling root file next to the folder (`MatchCard.tsx` beside `match-card/`) — the folder's `index.tsx` *is* the root.
- A single-file component stays a single PascalCase file; only create a folder when there are private sub-parts.

### Sections and depth

- The first level under `components/` may be **section folders** (`detail/`, `list/`, `map/`) grouping components by the page area they serve. Section folders contain component files and composite folders; they have no `index.tsx` of their own.
- **Maximum depth: 3 folder levels below `components/`** (section → composite → sub-composite). Deeper trees flatten into siblings, with ownership expressed by name prefix (`MatchDetailsTable`, not another nesting level).
- **Role grouping** (charts style: `court/`, `overlays/`, `headers/`) is permitted for a feature that is essentially one component with many small parts — the same depth cap applies.
- No `utils/`, `types/`, or `hooks/` *directories* inside `components/`. Component-private helpers live as files inside their composite folder; anything else belongs in the feature-level directories.

## Placement: shared vs component-private

The feature-level directories (`hooks/`, `types/`, `utils/`, `constants/`) hold only artifacts consumed by **two or more components, or by pages or the `api/` layer**. Anything consumed by exactly one composite lives inside that composite's folder.

- **Promotion rule**: the moment a second consumer appears, the artifact moves up to the feature-level directory (and into the barrel). That's the entire judgement call — don't pre-emptively "share" single-consumer code.
- `api/` is always a feature-level layer: the dual service pattern (`*.service.ts` / `*.server.ts`) and the Query Options quartet (`xKeys.ts`, `xQueries.ts`, `useX.ts`) never colocate.
- Empty layer directories are deleted, not kept with `.gitkeep` placeholders.

## Types

`features/*/types/` contains two kinds of files, and every file is purely one kind:

- **Generated API aliases** — `export type X = components["schemas"]["..."]` over `api.generated.ts` (via `@/shared/types`). Never hand-write API shapes.
- **Shared view types** — hand-written filter state, navigation models, and other types used across layers.

A file must not mix the two: a file importing the generated `components` type may only contain type-alias declarations. Component-private view types don't live in `types/` at all — they go in a `types.ts` inside their composite folder (see Placement).

## Barrels

- Barrel directories are defined once in the root `barrelsby.json`; the `enforce-barrel-import` ESLint rule derives its directory list from it, so the two can't drift. Regenerate barrels with `make barrels` / `npm run barrels:watch` after adding files.
- Barrels are **curated**: they export page-consumed components and shared-layer artifacts. Composite-folder internals are excluded from barrel generation (exclusion patterns in `barrelsby.json`) and blocked from direct import by the `no-cross-composite-import` rule.

## Naming

| Thing | Convention | Example |
| --- | --- | --- |
| Component files | PascalCase `.tsx` | `ScoreDisplay.tsx` |
| Composite/section folders | kebab-case | `match-card/` |
| Hook files (everywhere, `api/` included) | camelCase `useX.ts(x)` | `useMatchesFilterState.ts`, `useTeams.ts` |
| Constants files | camelCase `.ts` | `eventCategories.ts` |
| Utils files | camelCase `.ts` (`.tsx` allowed for JSX helpers) | `eventHelpers.ts` |
| Shared view types / API alias files | PascalCase `.ts` in `types/` | `MatchFilters.ts` |
| Component-private types | `types.ts` in the composite folder | `match-card/types.ts` |
| Component tests | colocated `X.test.tsx` / `useX.test.ts` | `match-card/index.test.tsx` |

Hooks that return JSX (e.g. table column factories) are `.tsx` but still follow `useX` naming and the placement rules above.

## Tests

Component tests are **colocated** next to what they test (`Component.test.tsx`, `useX.test.ts`), mirroring the backend's colocated `*.spec.ts`. Test files are excluded from barrel generation and from Sonar coverage sources. The test runner and setup are defined by the frontend testing effort, not this document.

---

## Enforcement

Custom ESLint rules in `src/frontend/eslint-rules/`, wired in `eslint.config.mjs` at **error** severity:

| Rule | Enforces |
| --- | --- |
| `enforce-component-folder-structure` | `index.tsx` composite roots, no `_` prefixes, kebab-case folders, depth ≤ 3, no `utils/`/`types/`/`hooks/` dirs under `components/`, colocated files only inside composite folders |
| `enforce-file-naming` | camelCase `useX` hook filenames (including `api/`), camelCase constants/utils filenames |
| `no-cross-composite-import` | Composite folders are only imported via their folder path (`index.tsx`) |
| `no-mixed-type-file` | `types/` files are purely generated-alias or purely hand-written |
| `enforce-barrel-import` | Imports go through barrels; directory list derived from `barrelsby.json` |
| `enforce-file-path-comment` | Every file starts with its own path comment (autofixable) |

**Migration ratchet**: features that predate these conventions are listed in the `LEGACY_FEATURES` allowlist in `eslint.config.mjs`, which disables the structure rules for them. Each migration PR restructures one feature and removes it from the list; an empty list means the migration is complete. Do not add new entries.

### New-component checklist

1. Single file or composite? Only create a folder if the component has private sub-parts; root is `index.tsx`.
2. Place hooks/types/helpers by consumer count: one composite → colocate inside it; two+ consumers (or pages/api) → feature-level directory.
3. Respect the depth cap (≤ 3 below `components/`) — flatten with name prefixes instead of nesting deeper.
4. New barrel-worthy directory? Add it to `barrelsby.json` (the ESLint barrel rule follows automatically); composite internals get an exclusion pattern.
5. Strings: resolve the component's own vocabulary inside it (`useTranslations` / `await getTranslations`), and take the caller's content as plain `string` props. Never accept the translator itself as a prop — see [Internationalisation](./frontend.md#internationalisation) in `frontend.md`. Not lint-enforced.
6. Run `npm run lint` — the rules above catch the rest.
