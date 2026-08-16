// src/frontend/features/organizations/committees/types/Committees.ts
import type { components } from "@/shared/types/api.generated";

/**
 * Committee entity, generated from the backend OpenAPI document.
 * Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type Committee = components["schemas"]["CommitteeResponseDto"];
