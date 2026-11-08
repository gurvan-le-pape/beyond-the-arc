// src/frontend/features/matches/utils/forfeitSides.ts

/**
 * Splits a forfeited match into the side that forfeited and the side awarded
 * the win. A forfeit is recorded 20–0, so the side that forfeited is the one
 * that scored 0.
 *
 * @param home - the home side, with its score
 * @param away - the away side, with its score
 * @returns the two sides, by what happened to each
 */
export function forfeitSides<T extends { readonly score: number | null }>(
  home: T,
  away: T,
): { forfeiting: T; winner: T } {
  return home.score === 0
    ? { forfeiting: home, winner: away }
    : { forfeiting: away, winner: home };
}
