// src/frontend/features/competitions/championships/utils/findLevelAbove.ts
import type { Championship } from "../types";

/**
 * The championship one level up from a departmental one: among the league's
 * regional championships in the same category and gender, the lowest division
 * — the one a departmental champion moves up into.
 *
 * @param regionals - the league's regional championships, already scoped to the category and gender
 * @returns the highest-numbered division, or `undefined` when there is none
 */
export function findLevelAbove(
  regionals: Championship[],
): Championship | undefined {
  return regionals.reduce<Championship | undefined>(
    (lowest, candidate) =>
      !lowest || candidate.division > lowest.division ? candidate : lowest,
    undefined,
  );
}
