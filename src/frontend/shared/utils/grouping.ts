// src/frontend/shared/utils/grouping.ts
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
