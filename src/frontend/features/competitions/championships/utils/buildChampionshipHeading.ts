// src/frontend/features/competitions/championships/utils/buildChampionshipHeading.ts
import type { Championship } from "@/features/competitions/championships/types";

export interface ChampionshipTitleLabels {
  /** Translated gender label, e.g. `common.gender.male`. */
  readonly gender: string;
  /** Translated division label, e.g. `competitions.divisionWithValue`. */
  readonly division: string;
}

/**
 * What tells a championship apart from its siblings: category, gender and
 * division, e.g. "Seniors · Masculin · Division 1".
 *
 * The heading on the championship's own page, where the organiser and season
 * are on the line below it. Everywhere else the championship needs those too —
 * see {@link buildChampionshipTitle}.
 *
 * @param championship - the championship to name
 * @param labels - the two already-translated strings, passed in so this works from a server or client component
 * @returns the category, gender and division, joined by middle dots
 */
export function buildChampionshipHeading(
  championship: Championship,
  labels: ChampionshipTitleLabels,
): string {
  return [championship.category, labels.gender, labels.division]
    .filter(Boolean)
    .join(" · ");
}
