// src/frontend/shared/utils/filterCascade.ts

/** For each filter, the filters whose options depend on it. */
export type FilterCascades<T> = {
  readonly [K in keyof T]?: readonly (keyof T)[];
};

/**
 * Widens a filter change to also clear every filter that depends on a changed
 * one, transitively: a new level clears the committee, and through it the
 * divisions offered under that committee.
 *
 * A dependent the patch sets itself keeps the patch's value.
 *
 * @param patch - the filters being changed
 * @param cascades - the filters each one clears when it changes
 * @returns the patch, plus `undefined` for every dependent it does not set
 */
export function withDependentsCleared<T>(
  patch: Partial<T>,
  cascades: FilterCascades<T>,
): Partial<T> {
  const cleared: Partial<T> = {};
  const pending = Object.keys(patch) as (keyof T)[];
  while (pending.length > 0) {
    for (const dependent of cascades[pending.pop()!] ?? []) {
      if (!(dependent in cleared)) {
        cleared[dependent] = undefined;
        pending.push(dependent);
      }
    }
  }
  return { ...cleared, ...patch };
}
