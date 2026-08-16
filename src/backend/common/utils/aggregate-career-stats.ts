// src/backend/common/utils/aggregate-career-stats.ts
import type { MappedPlayerMatchStats } from "./player-match-stats.mapper";
import { sumPlayerStats } from "./sum-player-stats";

/**
 * A player's box score reduced to career/season shape: counting stats with
 * rebounds already collapsed into one total, plus the per-game average of
 * each.
 *
 * Declared here rather than imported from a module's DTO so that this file
 * depends on nothing under `modules/`. `PlayerCareerStatsDto` carries the same
 * fifteen fields and the Swagger decorators; a value of this type is assignable
 * to it structurally, which is what keeps the OpenAPI contract owned by the
 * players module while the arithmetic lives here.
 */
export interface CareerStats {
  gamesPlayed: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  pointsPerGame: number;
  reboundsPerGame: number;
  assistsPerGame: number;
  stealsPerGame: number;
  blocksPerGame: number;
  turnoversPerGame: number;
  foulsPerGame: number;
}

/**
 * Aggregates a player's per-match stat rows into career totals and per-game
 * averages, matching the frontend `aggregateStats` conventions exactly:
 * games played is the row count, rebounds collapse offensive + defensive into
 * a single total, and per-game averages are Number((total / gp).toFixed(1))
 * with gp guarded to at least 1.
 *
 * It lives beside `sumPlayerStats`, whose docblock names this as one of the
 * three aggregators deriving from those totals. The other two already import
 * from here; this one used to sit in `modules/players/` and be reached
 * sideways by `modules/teams/` through a file in no barrel.
 */
export function aggregateCareerStats(
  rows: MappedPlayerMatchStats[],
): CareerStats {
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
