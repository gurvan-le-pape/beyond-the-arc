// src/frontend/features/competitions/championships/utils/buildLevelBelowNavigation.ts
import type { Championship, ChampionshipNavLink } from "../types";

/**
 * Links from a regional championship down to the departmental level: one per
 * committee in the league, to its top division — the one whose champion moves
 * up into the regional level.
 *
 * @param departmentals - the league's departmental championships, already scoped to the category and gender
 * @param locale - orders the departments by name
 * @returns one link per department, in alphabetical order
 */
export function buildLevelBelowNavigation(
  departmentals: Championship[],
  locale: string,
): ChampionshipNavLink[] {
  const topByCommittee = new Map<number, Championship>();
  for (const candidate of departmentals) {
    if (candidate.committeeId === null || !candidate.departmentName) continue;
    const top = topByCommittee.get(candidate.committeeId);
    if (!top || candidate.division < top.division) {
      topByCommittee.set(candidate.committeeId, candidate);
    }
  }

  return [...topByCommittee.values()]
    .map((top) => ({
      label: top.departmentName ?? "",
      href: `/championships/${top.id}`,
      isCurrent: false,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));
}
