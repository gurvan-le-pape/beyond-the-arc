// src/frontend/shared/components/filters/isLocationSelected.ts
import { CompetitionLevel } from "@/shared/constants";

/**
 * Whether a location (committee or league) is selected for the current level —
 * the precondition for enabling the division/pool cascade in the teams and
 * matches filter panels.
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
