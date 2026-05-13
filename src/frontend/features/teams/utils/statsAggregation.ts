// src/frontend/features/teams/utils/statsAggregation.ts
import { aggregateStats } from "@/features/players/utils";

import type { TeamMatchHistory } from "../types/TeamMatchHistory";

export function aggregateTeamStats(
  teamId: number,
  matches: TeamMatchHistory[],
) {
  const allStats = matches.flatMap((match) =>
    match.players.filter((p) => p.player.teamId === teamId).map((p) => p.stats),
  );

  return aggregateStats(allStats);
}
