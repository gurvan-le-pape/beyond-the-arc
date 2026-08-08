---
description: The frontend/backend contract — docs/openapi.json, generated types, and how to change the API.
paths:
  - "docs/openapi.json"
  - "src/frontend/shared/types/**"
  - "src/backend/**/dto/**"
---

# The frontend/backend API contract

> Source tags: `[manifest]` = this repo's `package.json` / `package-lock.json` · `[upstream]` = official docs for the exact locked version · `[principle]` = general engineering practice.

## The contract is a file

- `docs/openapi.json` is the boundary between the two applications. The frontend's `typegen` script reads it and writes TypeScript types: `[manifest]`

  ```
  openapi-typescript ../../docs/openapi.json -o shared/types/api.generated.ts
  ```
- The backend declares `@nestjs/swagger@11.2.5`, which is the tool that produces an OpenAPI document from controller and DTO decorators. `[manifest]`
- Direction of truth: **backend decorators → `docs/openapi.json` → `shared/types/api.generated.ts` → frontend code.** Never edit downstream of where a change belongs. `[manifest]`+`[principle]`

The document is emitted by a committed script, `src/backend/scripts/generate-openapi.ts`, run from the build output — not by a running server and never by hand. After any DTO or endpoint change, regenerate **both** sides and commit the result: `[project]`

```bash
cd src/backend && npm run build && node dist/scripts/generate-openapi.js
cd src/frontend && npm run typegen
```

CI enforces this. A dedicated job re-runs both and fails if `docs/openapi.json` or `api.generated.ts` differs from what was committed, so a stale snapshot blocks the pipeline — this is not optional cleanup. `[project]`

## Changing the API

- Change the backend DTOs and controller decorators first. `[principle]`
- Regenerate `docs/openapi.json` by whatever the project's actual mechanism is. `[principle]`
- From `src/frontend`, run `npm run typegen`. `[manifest]`
- Fix the resulting frontend type errors. A contract change that produces **no** frontend type errors and **no** generated-file diff means the regeneration step did not run. `[principle]`
- Commit the regenerated `api.generated.ts` alongside the backend change wherever possible. A generated file that lags its source is worse than no generated file — it type-checks confidently against an API that no longer exists. `[principle]`

## `shared/types/api.generated.ts` is read-only

- Never hand-edit it. `typegen` overwrites the whole file. `[upstream]`+`[principle]`
- Exclude it from lint and from any rule that would demand edits to it. See `linting-and-formatting.md`. `[principle]`
- Reference the generated types by indexing, which is how `openapi-typescript@7` output is designed to be consumed: `[upstream]`

  ```ts
  import type { components, paths } from '@/shared/types/api.generated';

  type Widget = components['schemas']['Widget'];
  type ListWidgetsResponse =
    paths['/widgets']['get']['responses'][200]['content']['application/json'];
  ```
- `openapi-typescript` emits **runtime-free types only** — no client, no validators, no runtime code. `[upstream]`
- Do not re-declare a type by hand that already exists in the generated file. Two definitions of the same payload will drift, and only one of them is checked against the real API. `[principle]`

## HTTP client

- The frontend's HTTP client is `axios@1.16.0`. `openapi-fetch` — the companion client `openapi-typescript` recommends — is **not** installed. `[manifest]`+`[upstream]`
- So the type safety is not automatic: axios will happily accept any generic parameter you give it. Annotate every request and response with the generated types explicitly, at a single wrapper layer rather than at each call site: `[manifest]`+`[principle]`

  ```ts
  const { data } = await http.get<components['schemas']['Widget']>(`/widgets/${id}`);
  ```
- Because the annotation is a claim rather than a check, it is only as good as the generated types are fresh. That is the strongest reason to regenerate on every contract change. `[principle]`

## Validation lives on the backend

- The backend installs `class-validator@0.14.3` and `class-transformer@0.5.1` — decorator-driven DTO validation. `[manifest]`
- Generated frontend types describe **shapes, not guarantees**. They are erased at runtime and validate nothing. Every input that reaches the backend must be validated there regardless of what the frontend types say. `[upstream]`+`[principle]`
- Keep validation decorators and Swagger decorators on the same DTO so the documented contract and the enforced contract cannot diverge. `[principle]`

## Breaking changes

- Removing or narrowing a field is a breaking change to a deployed frontend even inside one repo, because the two applications deploy as separate artifacts. `[manifest]`+`[principle]`
- Prefer additive changes. When a removal is genuinely needed: add the replacement, migrate the frontend, ship both, then remove in a later change. `[principle]`
