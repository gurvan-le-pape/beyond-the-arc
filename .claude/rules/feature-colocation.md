---
description: Features are the unit of change on both sides; cross-feature access goes through the barrel only.
paths:
  - "src/frontend/**/*.ts"
  - "src/frontend/**/*.tsx"
  - "src/backend/**/*.ts"
---

# Feature colocation

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice · `[project]` = a project convention stated directly by the maintainer.

## The shape

**Frontend — feature-first, thin routes:** `[project]`

```
src/frontend/
  app/[locale]/widgets/page.tsx     ← routing only
  features/
    widgets/
      components/
      hooks/
      types.ts
      index.ts                      ← the public surface
  shared/
    types/api.generated.ts
```

**Backend — module per feature under `modules/`:** `[project]`

```
src/backend/
  modules/
    widgets/
      widget.module.ts
      widget.controller.ts
      widget.service.ts
      dto/
  common/
  app.module.ts
```

- **The feature is the unit of change.** Adding a field should touch one feature directory on each side plus the contract — not fifteen files scattered across `components/`, `hooks/`, `types/`, and `services/`. If a routine change fans out across the tree, the boundary is in the wrong place. `[principle]`
- Conversely, **deleting a feature should be deleting a directory**, its entry in the parent barrel, and its message namespace. Anything left behind after that is something that was filed by kind rather than by feature. `[principle]`

> Directory names above are illustrative. What is normative is the **shape**: one directory per feature, shared code promoted out of it, no sideways imports between features. Confirm the actual names before relying on a literal path.

## Cross-feature access: barrel only

- **A feature may import another feature only through its `index.ts` barrel.** Reaching into `features/<other>/components/…` or `features/<other>/hooks/…` is forbidden. `[project]`

  ```ts
  // Wrong — reaches past the boundary into another feature's internals
  import { ThingRow } from '@/features/things/components/ThingRow';

  // Right — through the public surface
  import { ThingRow } from '@/features/things';
  ```
- This makes the generated barrel the **actual** public surface, not merely a convenience. It follows that **internals must not be exported from it** — a barrel that re-exports everything in the directory enforces no boundary at all. See `imports-and-barrels.md` for the `barrelsby` config options that control this. `[project]`+`[manifest]`
- **Inside** a feature, import siblings by direct path, never through the feature's own barrel — that is the import cycle described in `imports-and-barrels.md`. `[principle]`
- The barrel is generated. If the boundary is wrong, change the source layout or `barrelsby.json`; do not hand-edit the barrel to hide something. `[manifest]`+`[principle]`
- A circular dependency between two features means the boundary is wrong. Extract the shared piece rather than reaching for a lazy import. `[principle]`

## What belongs in `shared/`

- Two tests, both required: **used by two or more features**, *and* **describable without naming a feature**. `[principle]`
- `shared/types/api.generated.ts` is the canonical example — the contract belongs to no feature. See `api-contract.md`. `[manifest]`+`[principle]`
- **Move on the second consumer, not in anticipation of one.** A `shared/` populated up front becomes a junk drawer that everything depends on and nobody can change. `[principle]`
- Code in `shared/` never imports from `features/`. That direction of dependency turns the shared layer into a hub the whole graph passes through. `[principle]`
- If something in `shared/` is only used by one feature, move it back into that feature. `[principle]`

## Route segments hold routing concerns only

- `app/[locale]/…` files handle params, metadata, `setRequestLocale`, `generateStaticParams`, and composing feature components. Business logic and complex JSX belong in the feature. See `frontend-nextjs.md` and `frontend-i18n.md`. `[project]`+`[upstream]`
- A route file that grows past composition is a feature component that has not been extracted yet. `[principle]`
- Remember that `params` and `searchParams` are Promises in Next.js 15 — the route file is where they get awaited, so the feature component receives plain values. `[upstream]`

## Backend module boundaries

- **A module imports another module, not another module's service.** Nest's DI container is what makes the boundary real; importing a provider class directly defeats it. See `backend-nestjs.md`. `[principle]`
- A module exports only what other modules genuinely need. Exporting a service "in case" is the backend version of a wide barrel. `[principle]`
- `common/` follows the same rules as `shared/`: cross-cutting, feature-agnostic, and it never imports from `modules/`. `[project]`+`[principle]`
- Specs are colocated with the code they test (`*.spec.ts`), which is why the build strips compiled specs out of `dist`. See `testing.md`. `[manifest]`
- A feature's DTOs live with the feature. They are part of its public contract, so they are also what `@nestjs/swagger` reads to produce the OpenAPI document. See `api-contract.md`. `[manifest]`+`[principle]`

> If `common/` is a Nest module it is subject to the export-narrowly rule above; if it is a plain directory of helpers, only the dependency-direction rule applies. Check which before adding to it.

## Keeping the two sides aligned

- The same feature should carry the same name on both sides and in the message catalogue. One vocabulary, end to end — see `naming.md`. `[principle]`
- A contract change is a coordinated change: backend DTO, regenerated OpenAPI document, regenerated frontend types, then the frontend feature. See `api-contract.md`. `[principle]`
- Message keys are namespaced by feature, so a deleted feature takes its namespace with it. See `frontend-i18n.md`. `[principle]`
