// src/frontend/features/organizations/committees/types/Committee.ts
import type { components } from "@/shared/types/api.generated";

/**
 * Committee entity, generated from the backend OpenAPI document.
 * Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type Committee = components["schemas"]["CommitteeResponseDto"];

/** A committee with every one of its clubs, as `GET /committees/:id` returns it. */
export type CommitteeDetail =
  components["schemas"]["CommitteeDetailResponseDto"];
