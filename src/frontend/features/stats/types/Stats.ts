// src/frontend/features/stats/types/Stats.ts
import type { components } from "@/shared/types";

/**
 * Platform statistics, generated from the backend OpenAPI document.
 * Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type ChampionshipsByLevel =
  components["schemas"]["ChampionshipsByLevelDto"];

export type Stats = components["schemas"]["StatsResponseDto"];
