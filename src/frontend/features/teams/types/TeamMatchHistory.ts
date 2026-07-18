// src/frontend/features/teams/types/TeamMatchHistory.ts
import type { components } from "@/shared/types";

/**
 * Generated from the backend OpenAPI document. Regenerate with
 * `npm run typegen` after backend DTO changes — CI fails when
 * docs/openapi.json and api.generated.ts drift.
 */
export type TeamMatchPlayerRef = components["schemas"]["PlayerSummaryDto"];

export type TeamMatchParticipant = components["schemas"]["MatchPlayerDto"];

export type TeamMatchHistoryTeamRef =
  components["schemas"]["HistoryTeamRefDto"];

export type TeamMatchHistory = components["schemas"]["TeamMatchHistoryDto"];
