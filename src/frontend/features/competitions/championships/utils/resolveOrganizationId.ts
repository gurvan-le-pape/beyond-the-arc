// src/frontend/features/competitions/championships/utils/resolveOrganizationId.ts
import { CompetitionLevel } from "@/shared/constants";

import type { Championship } from "../types";

/**
 * The organization a championship belongs to: its committee when the level is
 * departmental, otherwise its league. Returns null when neither is set.
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
