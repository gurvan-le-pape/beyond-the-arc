// src/frontend/features/competitions/championships/utils/buildChampionshipOrganizer.ts
import type { Championship } from "@/features/competitions/championships/types";
import { formatCommitteeName, formatLeagueName } from "@/shared/utils";

/**
 * Who runs a championship, by the federation's name for it: the committee at
 * departmental level, the league at regional level. A national championship
 * has no organisation above it, so the caller's `levelName` stands in.
 *
 * @param championship - the championship whose organiser to name
 * @param levelName - the translated level name, used when there is no organiser
 * @returns the committee's or league's formatted name, or `levelName`
 */
export function buildChampionshipOrganizer(
  championship: Championship,
  levelName: string,
): string {
  return (
    (championship.committeeName &&
      formatCommitteeName(championship.committeeName)) ||
    (championship.leagueName && formatLeagueName(championship.leagueName)) ||
    levelName
  );
}
