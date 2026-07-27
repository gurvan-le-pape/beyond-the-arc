// src/frontend/features/competitions/championships/utils/buildCategoryNavigation.ts
import type { Category } from "@/shared/constants";
import { sortCategories } from "@/shared/utils";

import type { Championship, ChampionshipNavLink } from "../types";

/**
 * Links to the same competition in every other category, for one gender.
 *
 * `championships` is the sibling list the page already fetched — every
 * championship of this organization at this level.
 */
export function buildCategoryNavigation(
  championships: Championship[],
  championship: Championship,
): ChampionshipNavLink[] {
  const { gender, category } = championship;
  if (!gender) return [];

  // One destination per category: the first championship that offers it.
  const idByCategory = new Map<Category, number>();
  for (const sibling of championships) {
    if (sibling.gender !== gender || !sibling.category) continue;
    if (!idByCategory.has(sibling.category)) {
      idByCategory.set(sibling.category, sibling.id);
    }
  }

  // sortCategories sorts in place, so it gets an array of its own.
  return sortCategories([...idByCategory.keys()]).map((cat) => ({
    label: cat,
    href: `/championships/${idByCategory.get(cat)}`,
    isCurrent: cat === category,
  }));
}
