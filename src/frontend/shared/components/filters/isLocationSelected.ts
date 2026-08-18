// src/frontend/shared/components/filters/isLocationSelected.ts
import { CompetitionLevel } from "@/shared/constants";

/**
 * Whether a location (committee or league) is selected for the current level —
 * the precondition for enabling the division/pool cascade in the teams and
 * matches filter panels.
 *
 * @param level - the competition level currently chosen
 * @param committeeId - the selected committee, which only counts at departmental level
 * @param leagueId - the selected league, which only counts at regional level
 * @returns whether the scope is complete — false at national level, which has no parent to select
 */
export function isLocationSelected(
  level: CompetitionLevel | undefined,
  committeeId: number | undefined,
  leagueId: number | undefined,
): boolean {
  return (
    (level === CompetitionLevel.DEPARTMENTAL && !!committeeId) ||
    (level === CompetitionLevel.REGIONAL && !!leagueId)
  );
}
