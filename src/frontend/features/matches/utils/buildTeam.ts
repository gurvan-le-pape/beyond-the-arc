// src/frontend/features/matches/utils/buildTeam.ts
import type { MatchPlayerWithStats } from "@/features/matches/types";
import type { TeamInfoExtended, TeamStats } from "@/features/teams/types";

import type { MatchClubRef } from "../types";
import { getTeamScore } from "./getTeamScore";

export function buildTeam(
  allPlayers: MatchPlayerWithStats[],
  teamId: number,
  club: MatchClubRef,
  stats: TeamStats,
): TeamInfoExtended | null {
  const teamPlayers = allPlayers.filter((p) => p.player.team?.id === teamId);
  if (teamPlayers.length === 0) return null;

  const team = teamPlayers[0].player.team;
  return {
    id: team.id,
    name: `${club.name ?? ""} - ${team.number ?? ""}`,
    clubId: club.id,
    clubName: club.name,
    committeeId: club.committeeId,
    leagueId: club.leagueId,
    players: teamPlayers,
    score: getTeamScore(teamPlayers),
    stats,
  };
}
