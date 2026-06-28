// src/frontend/features/teams/utils/statsAggregation.ts
import { aggregateStats } from "@/features/players/utils";

import type { TeamMatchHistory } from "../types/TeamMatchHistory";

export function aggregateTeamStats(
  teamId: number,
  matches: TeamMatchHistory[],
) {
  const teamParticipants = matches.flatMap((match) =>
    match.players.filter((p) => p.player.teamId === teamId),
  );

  const allStats = teamParticipants.map((p) => p.stats);
  const uniquePlayers = new Set(teamParticipants.map((p) => p.player.id));

  return {
    ...aggregateStats(allStats),
    players: uniquePlayers.size,
    totalGames: aggregateStats(allStats).gamesPlayed, // alias for TeamInfo's naming, or just fix TeamInfo instead
  };
}
