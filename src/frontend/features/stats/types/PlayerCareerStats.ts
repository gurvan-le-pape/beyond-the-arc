// src/frontend/features/stats/types/PlayerCareerStats.ts
import type { components } from "@/shared/types/api.generated";

/**
 * Career/season aggregate player statistics, generated from the backend
 * OpenAPI document. PerGameStatsPanel renders it on both the player and team
 * detail pages.
 * Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type PlayerCareerStats = components["schemas"]["PlayerCareerStatsDto"];
