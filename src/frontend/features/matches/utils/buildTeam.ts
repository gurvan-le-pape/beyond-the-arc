// src/frontend/features/matches/utils/buildTeam.ts
import type { MatchPlayerWithStats } from "@/features/matches/types";
import type { TeamInfoExtended, TeamStats } from "@/features/teams/types";
import { formatTeamName } from "@/shared/utils";

import type { MatchTeamRef } from "../types";

/**
 * Assembles one side of a match: the team as the match record names it, its
 * players from the flat player-stats list (which carries both teams), and the
 * team-level stat line.
 *
 * Identity and score come from the match record, never from the players, so a
 * match that has not been played yet — no players, no score — still yields a
 * side to render. `score` is the official result, `null` until the match is
 * played.
 *
 * @param team - this side as the match record references it
 * @param score - this side's final score, `null` while the match is upcoming
 * @param allPlayers - every player with a stat line in the match, both sides
 * @param stats - the team-level stat line, passed through untouched
 * @returns the assembled side; `players` is empty for an upcoming match
 */
export function buildTeam(
  team: MatchTeamRef,
  score: number | null,
  allPlayers: MatchPlayerWithStats[],
  stats: TeamStats,
): TeamInfoExtended {
  return {
    id: team.id,
    name: formatTeamName(team.club.name, team.number),
    clubId: team.club.id,
    clubName: team.club.name,
    committeeId: team.club.committeeId,
    leagueId: team.club.leagueId,
    players: allPlayers.filter((p) => p.player.team?.id === team.id),
    score,
    stats,
  };
}
