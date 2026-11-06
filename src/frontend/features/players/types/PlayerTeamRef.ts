// src/frontend/features/players/types/PlayerTeamRef.ts
import type { components } from "@/shared/types/api.generated";

/**
 * Generated from the backend OpenAPI document. Regenerate with
 * `npm run typegen` after backend DTO changes — CI fails when
 * docs/openapi.json and api.generated.ts drift.
 */
export type PlayerLeagueRef = components["schemas"]["LeagueRefDto"];

export type PlayerCommitteeRef = components["schemas"]["CommitteeRefDto"];

export type PlayerClubRef = components["schemas"]["ClubRefDto"];

export type PlayerChampionshipRef = components["schemas"]["ChampionshipRefDto"];

export type PlayerPoolRef = components["schemas"]["PoolRefDto"];

export type PlayerTeamRef = components["schemas"]["PlayerTeamDto"];
