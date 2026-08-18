// src/frontend/features/competitions/championships/utils/resolveOrganizationId.ts
import { CompetitionLevel } from "@/shared/constants";

import type { Championship } from "../types";

/**
 * The organization a championship belongs to: its committee when the level is
 * departmental, otherwise its league. Returns null when neither is set.
 *
 * @param championship - the championship whose parent to resolve
 * @returns the committee id at departmental level and the league id otherwise, or `null` when the relevant one is unset
 */
export function resolveOrganizationId(
  championship: Championship,
): number | null {
  const organizationId =
    championship.level === CompetitionLevel.DEPARTMENTAL
      ? championship.committeeId
      : championship.leagueId;

  return organizationId ?? null;
}
