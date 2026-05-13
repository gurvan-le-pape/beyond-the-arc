// src/frontend/features/players/utils/statsAggregation.ts
import type { PlayerMatchStats } from "@/shared/types";

/**
 * Aggregates player statistics from an array of individual game stats.
 * This utility can be used in both server and client components.
 */
export function aggregateStats(stats: PlayerMatchStats[]) {
  const totals = stats.reduce(
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

  const gp = totals.gamesPlayed || 1;
  const perGame = (n: number) => Number((n / gp).toFixed(1));

  return {
    ...totals,
    pointsPerGame: perGame(totals.points),
    reboundsPerGame: perGame(totals.rebounds),
    assistsPerGame: perGame(totals.assists),
    stealsPerGame: perGame(totals.steals),
    blocksPerGame: perGame(totals.blocks),
    turnoversPerGame: perGame(totals.turnovers),
    foulsPerGame: perGame(totals.fouls),
  };
}
