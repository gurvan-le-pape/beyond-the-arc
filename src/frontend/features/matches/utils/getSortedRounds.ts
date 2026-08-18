// src/frontend/features/matches/utils/getSortedRounds.ts
// Utility to get sorted round numbers from groupedMatches
/**
 * The matchday numbers present in a grouped-matches object, in ascending
 * numeric order.
 *
 * **The `.map(Number)` is required, not tidying.** `groupBy` keys its result by
 * matchday, but JavaScript object keys are strings, so `Object.keys` hands back
 * `"2"`, `"10"` however the type is declared. Sorting those directly is
 * lexicographic — round 10 would land before round 2.
 *
 * The values are never read, which is why they are untyped here; only the key
 * set matters.
 *
 * @param groupedMatches - matches keyed by matchday, as `groupBy` returns them
 * @returns the matchday numbers, ascending
 */
export const getSortedRounds = (groupedMatches: Record<number, any>) =>
  Object.keys(groupedMatches)
    .map(Number)
    .sort((a, b) => a - b);
