// src/frontend/features/competitions/championships/hooks/useChampionshipNavigation.ts
import { useLocale, useTranslations } from "next-intl";

import type { Championship } from "@/features/competitions/championships/types";
import {
  buildCategoryNavigation,
  buildDivisionNavigation,
  buildGenderNavigation,
  buildLevelBelowNavigation,
  findLevelAbove,
} from "@/features/competitions/championships/utils";
import { CompetitionLevel } from "@/shared/constants";

/**
 * The ways out of a championship's header: its siblings one facet away
 * (category, gender, division), and the other level of the same league — the
 * regional championship above a departmental one, or the departments below a
 * regional one.
 *
 * Calls no client API, so a server component can use it.
 *
 * @param championship - the championship the page shows
 * @param siblings - its organiser's championships at the same level
 * @param otherLevel - the same category and gender at the league's other level
 * @returns the links for each facet menu, the level above's href, and the
 *   departments below
 */
export function useChampionshipNavigation(
  championship: Championship,
  siblings: Championship[],
  otherLevel: Championship[],
) {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const locale = useLocale();
  const isDepartmental = championship.level === CompetitionLevel.DEPARTMENTAL;
  const levelAbove = isDepartmental ? findLevelAbove(otherLevel) : undefined;

  return {
    categoryLinks: buildCategoryNavigation(siblings, championship),
    genderLinks: buildGenderNavigation(siblings, championship, (gender) =>
      tCommon(`gender.${gender}`),
    ),
    divisionLinks: buildDivisionNavigation(siblings, championship, (value) =>
      tCompetitions("divisionWithValue", { value }),
    ),
    levelAboveHref: levelAbove && `/championships/${levelAbove.id}`,
    levelBelowLinks: isDepartmental
      ? []
      : buildLevelBelowNavigation(otherLevel, locale),
  };
}
