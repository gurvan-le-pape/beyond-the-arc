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
- Conversely, **deleting a feature should be deleting a directory** and its entry in the parent barrel. Anything left behind after that is something that was filed by kind rather than by feature. (Message namespaces are a separate question — see "Keeping the two sides aligned"; a namespace may outlive the feature it was named after.) `[principle]`

> Directory names above are illustrative. What is normative is the **shape**: one directory per feature, shared code promoted out of it, no sideways imports between features. Confirm the actual names before relying on a literal path.

## Cross-feature access: through a barrel

- **A feature may import another feature only through a generated barrel**, never by a path that names an individual file. `[project]`
- **The barrel is per *kind*, not per feature.** `@/features/things/components`, `@/features/things/api`, `@/features/things/types` — there is no feature-root `index.ts`, and the barrel-import lint rule autofixes toward the kind-level path. `[project]`

  ```ts
  // Wrong — names a file, so the barrel is not the surface at all
  import { ThingRow } from '@/features/things/components/ThingRow';

  // Right — the kind-level barrel
  import { ThingRow } from '@/features/things/components';
  ```
- **Be exact about what this buys.** A kind-level barrel makes the *file* private. It does not make the feature private: every kind is published, so any feature can reach any other feature's components. The cross-feature boundary is therefore held by review, not by the module graph — a sideways import is a design question to answer, even though nothing will stop you writing it. Do not read a passing lint run as the boundary being enforced. `[project]`+`[principle]`
- **Inside** a feature, import siblings by direct path, never through the feature's own barrel — that is the import cycle described in `imports-and-barrels.md`. `[principle]`
- The barrel is generated. If the boundary is wrong, change the source layout or `barrelsby.json`; do not hand-edit the barrel to hide something. And a module that must never cross into another environment needs a mechanism that **fails** — a barrel that merely omits it is a naming convention, not a boundary. See `imports-and-barrels.md`. `[manifest]`+`[principle]`
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
- **Message namespaces are not this file's to allocate.** A namespace is a *vocabulary*, and which component resolves which string is decided by **who owns the string** — not by which feature directory the component happens to sit in. A feature reading a namespace named after another feature is therefore normal and not a colocation defect. The rule lives in `docs/frontend.md` under "Who resolves which string"; see also `frontend-i18n.md`. `[project]`
