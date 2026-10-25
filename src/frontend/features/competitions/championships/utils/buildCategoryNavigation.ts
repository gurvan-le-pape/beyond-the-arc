// src/frontend/features/competitions/championships/utils/buildCategoryNavigation.ts
import type { Category } from "@/shared/constants";
import { sortCategories } from "@/shared/utils";

import type { Championship, ChampionshipNavLink } from "../types";

/**
 * Links to the same competition in every other category, for one gender.
 *
 * `championships` is the sibling list the page already fetched — every
 * championship of this organization at this level.
 *
 * Each category links to its championship in the current division, so moving
 * from Seniors D2 to U18 lands on U18 D2; a category without that division
 * links to its top one.
 *
 * @returns the category tabs for a championship listing, in display order
 *
 * @param championships - the sibling list the page already fetched, at this organisation and level
 * @param championship - the one currently shown; its gender scopes the links and its division picks each one's destination
 */
export function buildCategoryNavigation(
  championships: Championship[],
  championship: Championship,
): ChampionshipNavLink[] {
  const { gender, category, division } = championship;

  // One destination per category: the current division if it has one, else
  // the lowest-numbered.
  const bestByCategory = new Map<Category, Championship>();
  for (const sibling of championships) {
    if (sibling.gender !== gender) continue;
    const best = bestByCategory.get(sibling.category);
    if (
      !best ||
      (best.division !== division &&
        (sibling.division === division || sibling.division < best.division))
    ) {
      bestByCategory.set(sibling.category, sibling);
    }
  }

  // sortCategories sorts in place, so it gets an array of its own.
  return sortCategories([...bestByCategory.keys()]).map((cat) => ({
    label: cat,
    href: `/championships/${bestByCategory.get(cat)?.id}`,
    isCurrent: cat === category,
  }));
}
