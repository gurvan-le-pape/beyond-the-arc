---
description: File, directory, and identifier naming across both applications.
paths:
  - "src/frontend/**/*.ts"
  - "src/frontend/**/*.tsx"
  - "src/frontend/**/*.mts"
  - "src/backend/**/*.ts"
---

# Naming

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice · `[project]` = a project convention stated directly by the maintainer.

## Files

- **React component files are PascalCase and match their export.** `WidgetList.tsx` exports `WidgetList`. `[project]`
- **Everything else is camelCase, except `types/` which is PascalCase.** The convention is per layer, and `enforce-file-naming.js` errors on violations inside `features/`: `[project]`

  | layer | file name | example |
  |---|---|---|
  | `hooks/` | camelCase `useX.ts(x)` | `useWidgetFilters.ts` |
  | `api/` | camelCase; hooks still `useX` | `widgets.service.ts`, `useWidgets.ts` |
  | `utils/` | camelCase `.ts` / `.tsx` | `formatWidgetName.ts` |
  | `constants/` | camelCase `.ts` | `widgetLimits.ts` |
  | `types/` | **PascalCase** `.ts` | `Widget.ts` |

- **Hooks are `useX.ts`, never `use-x.ts`.** The lint rule names this case explicitly. camelCase also keeps the file-matches-export rule above intact — `useWidgetFilters.ts` exports `useWidgetFilters`, where a kebab file name would not. `[project]`+`[principle]`
- `index.ts` barrels and `*.spec.ts` are exempt; a spec is judged by the name of the file it tests. `components/` is out of *this* rule's scope, but not unenforced: `enforce-component-folder-structure.js` (tier 1, `error`) governs it. `component-decomposition.md` covers how components are split, not what their files are called. `[project]`
- Backend files carry the NestJS role suffix: `widget.controller.ts`, `widget.service.ts`, `widget.module.ts`, `dto/create-widget.dto.ts`. `[project]`
- Tests are `*.spec.ts`, colocated with the code they test. See `testing.md`. `[manifest]`
- Barrels are always `index.ts` — that is `barrelsby`'s default and the name the root `barrels:lint` script globs for. Do not rename them. `[upstream]`+`[manifest]`
- Generated files announce themselves. A reader should not have to open one to learn they must not edit it — but *where* the announcement lives depends on whether the name is already load-bearing. `shared/types/api.generated.ts` says it in the filename; the 90 generated barrels say it in a banner comment, because their name is fixed at `index.ts` by the line above and by `barrelsby`. Name first where the name is free, banner where it is not. `[manifest]`+`[principle]`
- One primary export per file, named after the file. A file whose name predicts nothing about its contents is a file nobody can find. `[principle]`

```
features/widgets/
  components/WidgetList.tsx     → export function WidgetList
  api/useWidgets.ts             → export function useWidgets
  hooks/useWidgetFilters.ts     → export function useWidgetFilters
  utils/formatWidgetName.ts     → export function formatWidgetName
  constants/widgetLimits.ts
  types/Widget.ts               → export type Widget
  index.ts
```

```
src/backend/modules/widgets/
  widget.module.ts
  widget.controller.ts
  widget.service.ts
  widget.service.spec.ts
  dto/create-widget.dto.ts
```

These conventions are **machine-enforced**, not habit, by **two** rules: `src/frontend/eslint-rules/enforce-file-naming.js` reports on `api/`, `hooks/`, `constants/`, `utils/`, and `types/` inside `features/`, and `enforce-component-folder-structure.js` governs `components/`. The lint rules are the authority — if this file and the rule ever disagree, the rule wins and this file is stale. `[project]`

> The lint rule covers `features/` only. Naming under `shared/` and the casing of route-segment directories under `app/` are held by convention alone — match what is already there.

## Types

- **No `I` prefix on interfaces and no `T` prefix on type aliases.** A type is named for what it is: `Widget`, `WidgetFilters`, `ResourceState`. `[project]`
- Do not encode the kind in the name either — `WidgetInterface`, `WidgetType`, `WidgetEnum` all say something the compiler already knows. `[principle]`
- Generated types keep their generated names. Do not alias `components['schemas']['Widget']` into a hand-written duplicate that will drift — see `api-contract.md`. `[principle]`
- Generic parameters get real names when they carry meaning. `T` is fine for a genuinely opaque single parameter; `TWidget, TError` beats `T, U` the moment there are two. `[principle]`

## Identifiers

- **Booleans read as assertions**: `isReady`, `hasResource`, `canEdit`, `shouldRetry`. Never `flag`, `status`, `check`, or a bare noun. The same applies to functions returning a boolean. `[project]`
- **All identifiers, comments, and commit messages are in English**, regardless of which locales the UI ships. Only message-catalogue *values* are translated. See `frontend-i18n.md`. **This applies to every language in the repository, including the Python scheduler and `scripts/ffbb-import/` — which this file's own `paths` frontmatter (`.ts`/`.tsx`/`.mts`) cannot load on, so it will not be surfaced automatically where it is most often broken.** `[project]`
- Name for role, not for type or container: `selectedWidget`, not `widgetObj`; `widgets`, not `widgetArray`; `visibleWidgets`, not `filteredList`. `[principle]`
- Plural names hold collections; singular names hold one thing. Getting this wrong is the cheapest bug to prevent and one of the more annoying to read past. `[principle]`
- Functions are verb phrases (`buildWidget`, `resolveResource`); values and components are noun phrases. `[principle]`
- Avoid abbreviations except ones that are genuinely universal in this stack (`id`, `url`, `api`, `dto`, `props`, `ref`). `cfg`, `mgr`, `res` for "resource" and "response" both — these cost every future reader a lookup. `[principle]`
- Do not encode a variable's scope or mutability in its name. `[principle]`
- A name that needs a comment to explain it is the wrong name. Rename first, comment second. `[principle]`

## Domain vocabulary

- **Feature and module directory names are part of this vocabulary and are owned here**, not by `feature-colocation.md`, which is normative about the *shape* of the tree and explicitly disclaims the names. A feature carries one name across `src/frontend/features/<name>/`, `src/backend/modules/<name>/` and its message namespace. `[project]`
- One concept, one word, everywhere: database column, Prisma model, DTO, OpenAPI schema, generated type, React prop, message key. When the backend calls it a `Resource` and the frontend calls it a `Thing`, every conversation about it costs a translation step. `[principle]`
- If a name has to change, change it end to end in one pass rather than leaving a half-migrated vocabulary behind. `[principle]`
- Names that carry a unit or a currency say so: `durationMs`, `sizeBytes`, `priceCents`. A bare number is an invitation to a factor-of-1000 bug. `[principle]`
- Timestamp fields say what happened: `createdAt`, `startsAt`, `expiresAt` — and hold UTC instants. See `dates-and-timezones.md`. `[principle]`

## Conventions covered elsewhere

- Message-catalogue keys — `frontend-i18n.md` `[principle]`
- TanStack Query key factories — `frontend-data-fetching.md` `[principle]`
- Prometheus metric names — `backend-observability.md` `[principle]`

