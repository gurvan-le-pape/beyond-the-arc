// src/backend/modules/matches/aggregate-team-match-stats.ts
import { type MappedPlayerMatchStats, sumPlayerStats } from "@common/utils";

import type { TeamMatchStatsDto } from "./dto/matches.response.dto";

/**
 * Aggregates a team's per-player match stat rows into team totals: made and
 * attempted are "made/attempted" strings, percentages are numbers out of 100
 * (or `null` when there were no attempts to divide by), and counting stats are
 * raw sums. Field goals combine three-pointers with interior and exterior
 * two-pointers; points in the paint are interior two-pointers made times two.
 *
 * The percentages are numbers and `null`, never strings like `"43%"` or the
 * literal `"N/A"`. Both of those are display decisions taken in the wrong
 * place: the unit belongs in the field name, which already carries it, and
 * `"N/A"` is English copy shipped from the API into a bilingual UI. The
 * rounding stays here, so every consumer renders the same number.
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
      ? Math.round((fieldGoalsMade / fieldGoalAttempts) * 100)
      : null,
    threePointers: `${threePointsMade}/${threePointsAttempted}`,
    threePointPercentage: threePointsAttempted
      ? Math.round((threePointsMade / threePointsAttempted) * 100)
      : null,
    freeThrows: `${freeThrowsMade}/${freeThrowsAttempted}`,
    freeThrowPercentage: freeThrowsAttempted
      ? Math.round((freeThrowsMade / freeThrowsAttempted) * 100)
      : null,
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
