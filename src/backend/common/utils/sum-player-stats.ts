// src/backend/common/utils/sum-player-stats.ts
import type { MappedPlayerMatchStats } from "./box-score.mapper";

/**
 * Raw box-score totals summed over a set of player-match stat rows. The single
 * source of truth for "which counting stats exist"; every aggregator
 * (career/season, team-season, team-match) derives its own shape from these
 * totals rather than re-implementing the reduce loop.
 *
 * Rebounds stay split into offensive/defensive here; consumers collapse them
 * into a single total when they need one.
 */
export interface StatTotals {
  points: number;
  fouls: number;
  assists: number;
  turnovers: number;
  steals: number;
  blocks: number;
  threePointsMade: number;
  threePointsAttempted: number;
  twoPointsIntMade: number;
  twoPointsIntAttempted: number;
  twoPointsExtMade: number;
  twoPointsExtAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  reboundsOffensive: number;
  reboundsDefensive: number;
}

/**
 * Sums a set of mapped player-match stat rows into raw box-score totals.
 * Games played is intentionally not derived here — callers use the row count
 * (career/roster) or a distinct-match count (team season) as their denominator.
 */
export function sumPlayerStats(rows: MappedPlayerMatchStats[]): StatTotals {
  const totals: StatTotals = {
    points: 0,
    fouls: 0,
    assists: 0,
    turnovers: 0,
    steals: 0,
    blocks: 0,
    threePointsMade: 0,
    threePointsAttempted: 0,
    twoPointsIntMade: 0,
    twoPointsIntAttempted: 0,
    twoPointsExtMade: 0,
    twoPointsExtAttempted: 0,
    freeThrowsMade: 0,
    freeThrowsAttempted: 0,
    reboundsOffensive: 0,
    reboundsDefensive: 0,
  };

  for (const row of rows) {
    totals.points += row.points;
    totals.fouls += row.fouls;
    totals.assists += row.assists;
    totals.turnovers += row.turnovers;
    totals.steals += row.steals;
    totals.blocks += row.blocks;
    totals.threePointsMade += row.threePointsMade;
    totals.threePointsAttempted += row.threePointsAttempted;
    totals.twoPointsIntMade += row.twoPointsIntMade;
    totals.twoPointsIntAttempted += row.twoPointsIntAttempted;
    totals.twoPointsExtMade += row.twoPointsExtMade;
    totals.twoPointsExtAttempted += row.twoPointsExtAttempted;
    totals.freeThrowsMade += row.freeThrowsMade;
    totals.freeThrowsAttempted += row.freeThrowsAttempted;
    totals.reboundsOffensive += row.rebounds.offensive;
    totals.reboundsDefensive += row.rebounds.defensive;
  }

  return totals;
}
