// src/backend/modules/players/aggregate-career-stats.ts
import { type MappedPlayerMatchStats, sumPlayerStats } from "@common/utils";

import type { PlayerCareerStatsDto } from "./dto/players.response.dto";

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
  const totals = sumPlayerStats(rows);
  const rebounds = totals.reboundsOffensive + totals.reboundsDefensive;

  const gamesPlayed = rows.length;
  const gp = gamesPlayed || 1;
  const perGame = (n: number) => Number((n / gp).toFixed(1));

  return {
    gamesPlayed,
    points: totals.points,
    rebounds,
    assists: totals.assists,
    steals: totals.steals,
    blocks: totals.blocks,
    turnovers: totals.turnovers,
    fouls: totals.fouls,
    pointsPerGame: perGame(totals.points),
    reboundsPerGame: perGame(rebounds),
    assistsPerGame: perGame(totals.assists),
    stealsPerGame: perGame(totals.steals),
    blocksPerGame: perGame(totals.blocks),
    turnoversPerGame: perGame(totals.turnovers),
    foulsPerGame: perGame(totals.fouls),
  };
}
