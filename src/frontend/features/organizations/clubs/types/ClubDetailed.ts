// src/frontend/features/organizations/clubs/types/ClubDetailed.ts
import type { components } from "@/shared/types";

/**
 * Detailed club entities, generated from the backend OpenAPI document.
 * Regenerate with `npm run typegen` after backend DTO changes —
 * CI fails when docs/openapi.json and api.generated.ts drift.
 */
export type ClubTeamLeaderboard = components["schemas"]["TeamLeaderboardDto"];

export type ClubChampionshipInfo = components["schemas"]["ChampionshipInfoDto"];

export type ClubPoolInfo = components["schemas"]["PoolInfoDto"];

export type ClubTeamInfo = components["schemas"]["TeamInfoDto"];

export type ClubDetailed = components["schemas"]["ClubDetailedResponseDto"];
