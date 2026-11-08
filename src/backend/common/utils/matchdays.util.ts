// src/backend/common/utils/matchdays.util.ts

/**
 * Selects what {@link countMatchdays} reads from each team of a pool.
 */
export const TEAM_MATCHDAYS_SELECT = {
  homeMatches: {
    select: { matchday: true },
    distinct: ["matchday"] as ["matchday"],
  },
} as const;

/**
 * Counts a pool's matchdays. Every match has exactly one home team, so the home
 * matches of a pool's teams are all of the pool's matches.
 *
 * @param teams - every team of the pool
 * @returns the number of distinct matchdays, 0 for a pool with no schedule
 */
export function countMatchdays(
  teams: { homeMatches: { matchday: number }[] }[],
): number {
  return new Set(
    teams.flatMap((team) => team.homeMatches.map((match) => match.matchday)),
  ).size;
}
