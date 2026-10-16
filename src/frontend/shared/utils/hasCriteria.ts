// src/frontend/shared/utils/hasCriteria.ts

/**
 * Whether a set of query criteria narrows anything: true when at least one
 * value is set, where `undefined` and the empty string mean "not set".
 *
 * Pagination does not belong in the argument — a page number on its own
 * narrows nothing.
 *
 * @param criteria - The filter and search values, without pagination
 * @returns `true` when at least one criterion is set
 */
export function hasCriteria(criteria: Record<string, unknown>): boolean {
  return Object.values(criteria).some(
    (value) => value !== undefined && value !== "",
  );
}
