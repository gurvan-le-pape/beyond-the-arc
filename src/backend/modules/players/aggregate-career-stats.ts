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
  const gamesPlayed = rows.length;
  const points = rows.reduce((sum, s) => sum + s.points, 0);
  const rebounds = rows.reduce(
    (sum, s) => sum + s.rebounds.offensive + s.rebounds.defensive,
    0,
  );
  const assists = rows.reduce((sum, s) => sum + s.assists, 0);
  const steals = rows.reduce((sum, s) => sum + s.steals, 0);
  const blocks = rows.reduce((sum, s) => sum + s.blocks, 0);
  const turnovers = rows.reduce((sum, s) => sum + s.turnovers, 0);
  const fouls = rows.reduce((sum, s) => sum + s.fouls, 0);

  const gp = gamesPlayed || 1;
  const perGame = (n: number) => Number((n / gp).toFixed(1));

  return {
    gamesPlayed,
    points,
    rebounds,
    assists,
    steals,
    blocks,
    turnovers,
    fouls,
    pointsPerGame: perGame(points),
    reboundsPerGame: perGame(rebounds),
    assistsPerGame: perGame(assists),
    stealsPerGame: perGame(steals),
    blocksPerGame: perGame(blocks),
    turnoversPerGame: perGame(turnovers),
    foulsPerGame: perGame(fouls),
  };
}
