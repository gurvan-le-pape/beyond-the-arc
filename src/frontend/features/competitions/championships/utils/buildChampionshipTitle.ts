// src/frontend/features/competitions/championships/utils/buildChampionshipTitle.ts
import type { Championship } from "@/features/competitions/championships/types";
import { formatCommitteeName, formatLeagueName } from "@/shared/utils";

interface ChampionshipTitleLabels {
  /** Translated gender label, e.g. `common.gender.male`. */
  readonly gender: string;
  /** Translated division label, e.g. `competitions.divisionWithValue`. */
  readonly division: string;
}

/**
 * One-line name for a championship, which has no name of its own — it is
 * identified by its organisation, category, gender, division and season.
 *
 * Used for the page's heading and its document title. Takes the two translated
 * labels as arguments so it works from both a client component (`useTranslations`)
 * and `generateMetadata` (`getTranslations`).
 */
export function buildChampionshipTitle(
  championship: Championship,
  labels: ChampionshipTitleLabels,
): string {
  const { committeeName, leagueName, category, seasonYear } = championship;

  return [
    committeeName ? formatCommitteeName(committeeName) : null,
    leagueName ? formatLeagueName(leagueName) : null,
    category,
    labels.gender,
    labels.division,
    seasonYear,
  ]
    .filter(Boolean)
    .join(" · ");
}
