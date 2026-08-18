// src/frontend/features/competitions/championships/utils/buildDivisionNavigation.ts
import type { Championship, ChampionshipNavLink } from "../types";

/**
 * Links to the other divisions of the same category, gender and level.
 *
 * `formatLabel` is passed in rather than translated here, so this works from a
 * server component (`getTranslations`) and a client one (`useTranslations`)
 * alike — the same arrangement {@link buildChampionshipTitle} uses.
 *
 * @returns the division tabs for a championship listing, in ascending division order
 *
 * @param championships - the sibling list the page already fetched
 * @param championship - the one currently shown; its category, gender and level scope the links
 * @param formatLabel - renders a division number, passed in so this works from a server or client component
 */
export function buildDivisionNavigation(
  championships: Championship[],
  championship: Championship,
  formatLabel: (division: number) => string,
): ChampionshipNavLink[] {
  const { level, category, gender, division } = championship;
  if (!category || !gender) return [];

  const idByDivision = new Map<number, number>();
  for (const sibling of championships) {
    if (
      sibling.category !== category ||
      sibling.gender !== gender ||
      sibling.level !== level
    ) {
      continue;
    }
    idByDivision.set(sibling.division, sibling.id);
  }

  return [...idByDivision.keys()]
    .sort((a, b) => a - b)
    .map((div) => ({
      label: formatLabel(div),
      href: `/championships/${idByDivision.get(div)}`,
      isCurrent: div === division,
    }));
}
