// src/frontend/features/teams/types/TeamDetail.ts
import type { components } from "@/shared/types/api.generated";

/**
 * Generated from the backend OpenAPI document. Regenerate with
 * `npm run typegen` after backend DTO changes — CI fails when
 * docs/openapi.json and api.generated.ts drift.
 */
export type TeamPlayerRef = components["schemas"]["TeamRosterPlayerDto"];

export type TeamMatchClubRef = components["schemas"]["HistoryClubRefDto"];

export type TeamMatchTeamRef = components["schemas"]["HistoryTeamRefDto"];

export type TeamDetail = components["schemas"]["TeamDetailResponseDto"];
