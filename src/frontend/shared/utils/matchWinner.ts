// src/frontend/shared/utils/matchWinner.ts

/** Which side of a match won. */
export type MatchSide = "home" | "away";

/**
 * The one rule for who won a match: the side with the higher score.
 *
 * `null` when there is no winner to name: a score is missing or the scores are
 * level. Whether a match has been played is its `status`, not this.
 *
 * @param homeScore - the home side's final score, if any
 * @param awayScore - the away side's final score, if any
 * @returns the winning side, or `null`
 */
export function matchWinner(
  homeScore: number | null,
  awayScore: number | null,
): MatchSide | null {
  if (homeScore === null || awayScore === null) return null;
  if (homeScore > awayScore) return "home";
  if (awayScore > homeScore) return "away";
  return null;
}
