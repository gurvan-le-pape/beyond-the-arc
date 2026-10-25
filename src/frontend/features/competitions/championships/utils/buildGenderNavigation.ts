// src/frontend/features/competitions/championships/utils/buildGenderNavigation.ts
import { type Gender, GENDER_LIST } from "@/shared/constants";

import type { Championship, ChampionshipNavLink } from "../types";

/**
 * Links to the same competition for each gender: same category, level and
 * division.
 *
 * `formatLabel` is passed in rather than translated here, so this works from a
 * server component and a client one alike — as in {@link buildDivisionNavigation}.
 *
 * @returns one link per gender that has this championship, in `GENDER_LIST` order
 *
 * @param championships - the sibling list the page already fetched, at this organisation and level
 * @param championship - the one currently shown; its category, level and division scope the links
 * @param formatLabel - renders a gender, passed in so this works from a server or client component
 */
export function buildGenderNavigation(
  championships: Championship[],
  championship: Championship,
  formatLabel: (gender: Gender) => string,
): ChampionshipNavLink[] {
  const { level, category, division, gender } = championship;

  const idByGender = new Map<Gender, number>();
  for (const sibling of championships) {
    if (
      sibling.category === category &&
      sibling.level === level &&
      sibling.division === division
    ) {
      idByGender.set(sibling.gender, sibling.id);
    }
  }

  return GENDER_LIST.filter((value) => idByGender.has(value)).map((value) => ({
    label: formatLabel(value),
    href: `/championships/${idByGender.get(value)}`,
    isCurrent: value === gender,
  }));
}
