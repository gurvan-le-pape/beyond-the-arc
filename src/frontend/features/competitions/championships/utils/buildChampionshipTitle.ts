// src/frontend/features/competitions/championships/utils/buildChampionshipTitle.ts
import type { Championship } from "@/features/competitions/championships/types";
import { CompetitionLevel } from "@/shared/constants";

import {
  buildChampionshipHeading,
  type ChampionshipTitleLabels,
} from "./buildChampionshipHeading";

/**
 * One-line name for a championship, which has no name of its own — it is
 * identified by its organiser's place, category, gender, division and season,
 * e.g. "Auvergne-Rhône-Alpes · Seniors · Masculin · Division 1 · 2026-2027".
 *
 * Used for the document title and wherever the championship is named away from
 * its own page, such as a match's breadcrumb. The place is the committee's
 * department at departmental level and the league's region otherwise. Takes
 * the two translated labels as arguments so it works from both a client
 * component (`useTranslations`) and `generateMetadata` (`getTranslations`).
 *
 * @param championship - the championship to name, or the reference a match carries
 * @param labels - the two already-translated strings, passed in so this works from a server or client component
 * @returns the place, heading and season, joined by middle dots
 */
export function buildChampionshipTitle(
  championship: Pick<
    Championship,
    "level" | "category" | "regionName" | "departmentName" | "seasonYear"
  >,
  labels: ChampionshipTitleLabels,
): string {
  const place =
    championship.level === CompetitionLevel.DEPARTMENTAL
      ? championship.departmentName
      : championship.regionName;

  return [
    place,
    buildChampionshipHeading(championship, labels),
    championship.seasonYear,
  ]
    .filter(Boolean)
    .join(" · ");
}
