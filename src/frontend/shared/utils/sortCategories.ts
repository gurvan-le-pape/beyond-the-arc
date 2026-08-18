// src/frontend/shared/utils/sortCategories.ts

import type { Category } from "@/shared/constants";

/**
 * Orders age categories by their number — U11 before U13 before U15 — rather
 * than alphabetically, which would put U11 next to U17 and U9 last.
 *
 * **Sorts in place and returns the same array**, per `Array.prototype.sort`. A
 * caller passing a prop, a memoised value, or anything it does not own gets it
 * reordered underneath — and React sees no new reference. Copy before calling
 * if the input is shared.
 *
 * Anything without a `U<number>` shape sorts last, via a 999 sentinel; it does
 * not throw and is not otherwise distinguishable in the output.
 *
 * @param categories - the array to order, mutated in place
 * @returns the same array reference, ordered
 */
export const sortCategories = (categories: Category[]) => {
  return categories.sort((a, b) => {
    const extractNumber = (cat: Category) => {
      const regex = /U(\d+)/;
      const match = regex.exec(cat);
      return match ? Number.parseInt(match[1]) : 999;
    };
    return extractNumber(a) - extractNumber(b);
  });
};
