// src/frontend/features/matches/types/MatchParticipant.ts
import type { components } from "@/shared/types";

/**
 * Generated from the backend OpenAPI document. Regenerate with
 * `npm run typegen` after backend DTO changes — CI fails when
 * docs/openapi.json and api.generated.ts drift.
 */
export type MatchParticipantPlayer =
  components["schemas"]["PlayerSummaryDto"];

export type MatchParticipant = components["schemas"]["PlayerMatchEntryDto"];
