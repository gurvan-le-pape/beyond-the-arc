// src/frontend/shared/utils/grouping.ts
/**
 * Buckets `items` by the key `keyFn` returns, preserving input order within
 * each bucket.
 *
 * **A numeric key does not stay numeric.** Object keys are strings in
 * JavaScript, so `keyFn` returning `match.matchday` produces `"1"`, `"2"` at
 * runtime even though the return type admits `number` — and `Object.keys` on
 * the result hands back strings. Convert before comparing or sorting, or a
 * lookup by the original number silently misses.
 *
 * The nullish guard is deliberate: the signature already forbids it, so it only
 * fires for values arriving from untyped data rather than from a typed caller.
 *
 * @param items - the collection to bucket; a nullish value yields `{}`
 * @param keyFn - derives the bucket key for one item
 * @returns one entry per distinct key, each holding its items in input order
 */
export function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string | number,
): Record<string | number, T[]> {
  if (!items) return {};
  return items.reduce(
    (acc, item) => {
      const key = keyFn(item);
      acc[key] ??= [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string | number, T[]>,
  );
}
