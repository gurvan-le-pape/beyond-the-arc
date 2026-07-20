// src/backend/modules/players/aggregate-career-stats.ts
import { MappedPlayerMatchStats } from "@common/utils";

import { PlayerCareerStatsDto } from "./dto/players.response.dto";

/**
 * Aggregates a player's per-match stat rows into career totals and per-game
 * averages, matching the frontend `aggregateStats` conventions exactly:
 * games played is the row count, rebounds collapse offensive + defensive into
 * a single total, and per-game averages are Number((total / gp).toFixed(1))
 * with gp guarded to at least 1.
 */
export function aggregateCareerStats(
  rows: MappedPlayerMatchStats[],
): PlayerCareerStatsDto {
  const totals = rows.reduce(
    (acc, stat) => ({
      gamesPlayed: acc.gamesPlayed + 1,
      points: acc.points + stat.points,
      rebounds: acc.rebounds + stat.rebounds.offensive + stat.rebounds.defensive,
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
