// src/frontend/features/teams/types/TeamClubRef.ts
import type { components } from "@/shared/types/api.generated";

/**
 * Generated from the backend OpenAPI document. Regenerate with
 * `npm run typegen` after backend DTO changes — CI fails when
 * docs/openapi.json and api.generated.ts drift.
 */
export type TeamLeagueRef = components["schemas"]["LeagueRefDto"];

export type TeamCommitteRef = components["schemas"]["CommitteeRefDto"];

export type TeamClubRef = components["schemas"]["ClubRefDto"];
