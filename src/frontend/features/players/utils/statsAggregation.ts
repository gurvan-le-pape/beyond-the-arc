// src/frontend/features/players/utils/statsAggregation.ts
import type { PlayerMatchStats } from "@/shared/types/PlayerMatchStats";

/**
 * Aggregates player statistics from an array of individual game stats.
 * This utility can be used in both server and client components.
 */
export function aggregateStats(stats: PlayerMatchStats[]) {
  return stats.reduce(
    (acc, stat) => ({
      gamesPlayed: acc.gamesPlayed + 1,
      points: acc.points + stat.points,
      rebounds:
        acc.rebounds + stat.rebounds.offensive + stat.rebounds.defensive,
      assists: acc.assists + stat.assists,
      steals: acc.steals + stat.steals,
      blocks: acc.blocks + stat.blocks,
      turnovers: acc.turnovers + stat.turnovers,
      fouls: acc.fouls + stat.fouls,
    }),
    {
      gamesPlayed: 0,
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fouls: 0,
    },
  );
}
