// src/backend/modules/matches/aggregate-team-match-stats.ts
import { type MappedPlayerMatchStats, sumPlayerStats } from "@common/utils";

import type { TeamMatchStatsDto } from "./dto/matches.response.dto";

/**
 * Value used for a percentage when there were no attempts to divide by.
 */
const NA = "N/A";

/**
 * Aggregates a team's per-player match stat rows into team totals, matching the
 * frontend `calculateTeamMatchStats` conventions exactly: made/attempted are
 * "made/attempted" strings, percentages are rounded "NN%" strings (or "N/A"
 * when there were no attempts), and counting stats are raw sums. Field goals
 * combine three-pointers with interior and exterior two-pointers; points in the
 * paint are interior two-pointers made times two.
 */
export function aggregateTeamMatchStats(
  rows: MappedPlayerMatchStats[],
): TeamMatchStatsDto {
  const totals = sumPlayerStats(rows);

  const fieldGoalsMade =
    totals.threePointsMade + totals.twoPointsIntMade + totals.twoPointsExtMade;
  const fieldGoalAttempts =
    totals.threePointsAttempted +
    totals.twoPointsIntAttempted +
    totals.twoPointsExtAttempted;
  const {
    threePointsMade,
    threePointsAttempted,
    freeThrowsMade,
    freeThrowsAttempted,
    reboundsOffensive,
    reboundsDefensive,
    assists,
    steals,
    blocks,
    turnovers,
    fouls,
  } = totals;
  const pointsInPaint = totals.twoPointsIntMade * 2;

  return {
    fieldGoals: `${fieldGoalsMade}/${fieldGoalAttempts}`,
    fieldGoalPercentage: fieldGoalAttempts
      ? `${Math.round((fieldGoalsMade / fieldGoalAttempts) * 100)}%`
      : NA,
    threePointers: `${threePointsMade}/${threePointsAttempted}`,
    threePointPercentage: threePointsAttempted
      ? `${Math.round((threePointsMade / threePointsAttempted) * 100)}%`
      : NA,
    freeThrows: `${freeThrowsMade}/${freeThrowsAttempted}`,
    freeThrowPercentage: freeThrowsAttempted
      ? `${Math.round((freeThrowsMade / freeThrowsAttempted) * 100)}%`
      : NA,
    reboundsTotal: reboundsOffensive + reboundsDefensive,
    reboundsOffensive,
    reboundsDefensive,
    assists,
    steals,
    blocks,
    turnovers,
    fouls,
    pointsInPaint,
  };
}
