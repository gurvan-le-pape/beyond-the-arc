// src/backend/modules/matches/aggregate-team-match-stats.ts
import type { MappedPlayerMatchStats } from "@common/utils";

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
  const fieldGoalsMade = rows.reduce(
    (sum, s) => sum + s.threePointsMade + s.twoPointsIntMade + s.twoPointsExtMade,
    0,
  );
  const fieldGoalAttempts = rows.reduce(
    (sum, s) =>
      sum +
      s.threePointsAttempted +
      s.twoPointsIntAttempted +
      s.twoPointsExtAttempted,
    0,
  );
  const threePointsMade = rows.reduce((sum, s) => sum + s.threePointsMade, 0);
  const threePointsAttempted = rows.reduce(
    (sum, s) => sum + s.threePointsAttempted,
    0,
  );
  const freeThrowsMade = rows.reduce((sum, s) => sum + s.freeThrowsMade, 0);
  const freeThrowsAttempted = rows.reduce(
    (sum, s) => sum + s.freeThrowsAttempted,
    0,
  );
  const reboundsOffensive = rows.reduce(
    (sum, s) => sum + s.rebounds.offensive,
    0,
  );
  const reboundsDefensive = rows.reduce(
    (sum, s) => sum + s.rebounds.defensive,
    0,
  );
  const assists = rows.reduce((sum, s) => sum + s.assists, 0);
  const steals = rows.reduce((sum, s) => sum + s.steals, 0);
  const blocks = rows.reduce((sum, s) => sum + s.blocks, 0);
  const turnovers = rows.reduce((sum, s) => sum + s.turnovers, 0);
  const fouls = rows.reduce((sum, s) => sum + s.fouls, 0);
  const pointsInPaint = rows.reduce((sum, s) => sum + s.twoPointsIntMade * 2, 0);

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
