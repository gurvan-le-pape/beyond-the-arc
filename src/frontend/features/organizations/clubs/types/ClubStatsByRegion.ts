// src/frontend/features/organizations/clubs/types/ClubStatsByRegion.ts
import type { components } from "@/shared/types/api.generated";

/**
 * Region-level club statistics, generated from the backend OpenAPI
 * document. Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type ClubStatsByRegion = components["schemas"]["ClubStatsByRegionDto"];
