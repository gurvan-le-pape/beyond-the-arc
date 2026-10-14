// src/frontend/shared/utils/matchWinner.ts

/** Which side of a match won. */
export type MatchSide = "home" | "away";

/**
 * The one rule for who won a match: the side with the higher score.
 *
 * `null` when there is no winner to show — the match has not been played (a
 * score is missing) or the scores are level.
 *
 * @param homeScore - the home side's final score, `null` until played
 * @param awayScore - the away side's final score, `null` until played
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
