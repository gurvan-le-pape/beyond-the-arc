// src/frontend/features/matches/types/MatchPlayerStats.ts
import type { components } from "@/shared/types";

/**
 * Generated from the backend OpenAPI document. Regenerate with
 * `npm run typegen` after backend DTO changes — CI fails when
 * docs/openapi.json and api.generated.ts drift.
 */
export type MatchPlayerWithTeamRef =
  components["schemas"]["PlayerWithTeamDto"];

export type MatchPlayerWithStats = components["schemas"]["PlayerWithStatsDto"];

export type MatchPlayerStatsResponse =
  components["schemas"]["MatchPlayerStatsResponseDto"];
