// src/backend/common/utils/ranking.util.ts

/**
 * Standings entry fields used for ranking, ordered by points then point
 * difference (both descending).
 */
export interface RankableEntry {
  points: number;
  pointDifference: number;
}

/**
 * Returns true when `a` ranks strictly better than `b` in standings order.
 */
export function isBetterRanked(a: RankableEntry, b: RankableEntry): boolean {
  return (
    a.points > b.points ||
    (a.points === b.points && a.pointDifference > b.pointDifference)
  );
}

/**
 * Assigns competition ranks ("1224" ranking): each entry's rank is 1 plus
 * the number of strictly better entries, so ties share a rank and the next
 * distinct entry skips ahead.
 */
export function assignRankByCount<T extends RankableEntry>(
  entries: readonly T[],
): (T & { rank: number })[] {
  return entries.map((entry) => ({
    ...entry,
    rank: 1 + entries.filter((other) => isBetterRanked(other, entry)).length,
  }));
}
