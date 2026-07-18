// src/frontend/features/players/types/PlayerMatchHistory.ts
import type { components } from "@/shared/types";

/**
 * Generated from the backend OpenAPI document. Regenerate with
 * `npm run typegen` after backend DTO changes — CI fails when
 * docs/openapi.json and api.generated.ts drift.
 */
export type PlayerMatchHistoryTeamRef =
  components["schemas"]["HistoryTeamRefDto"];

export type PlayerMatchHistoryEntry =
  components["schemas"]["PlayerMatchEntryDto"];

export type PlayerMatchHistory = components["schemas"]["MatchHistoryDto"];
