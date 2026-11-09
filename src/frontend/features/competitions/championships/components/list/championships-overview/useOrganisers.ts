// src/frontend/features/competitions/championships/components/list/championships-overview/useOrganisers.ts
import { useCommittees } from "@/features/organizations/committees/api";
import { useLeagues } from "@/features/organizations/leagues/api";
import {
  normalizeDepartmentCode,
  regionShapeCode,
} from "@/features/organizations/utils";
import { CompetitionLevel } from "@/shared/constants";

/** A league or committee, as the championships tabs list and map it. */
export interface Organiser {
  readonly id: number;
  /** The region's name for a league, the department's for a committee. */
  readonly name: string;
  /** The map shape it covers: a region code, or a department number ("1", "2A"). */
  readonly code: string | undefined;
  /** For a committee, the region of its league, which groups the list. */
  readonly group?: string;
}

export type OrganiserLevel =
  | typeof CompetitionLevel.REGIONAL
  | typeof CompetitionLevel.DEPARTMENTAL;

// Department order: 1, 2, 2A, 2B, 3 … 95.
function byDepartment(a: Organiser, b: Organiser): number {
  const codeA = a.code ?? "";
  const codeB = b.code ?? "";
  return (
    Number.parseInt(codeA, 10) - Number.parseInt(codeB, 10) ||
    codeA.localeCompare(codeB)
  );
}

/**
 * The organisers of one level's championships: the leagues for regional,
 * the committees for departmental, in the order the list shows them.
 *
 * Both lookups run whatever the level, so switching tabs finds them cached.
 *
 * @param level - the tab's level
 * @returns the organisers, sorted, with the lookup's error and retry
 */
export function useOrganisers(level: OrganiserLevel) {
  const leaguesQuery = useLeagues();
  const committeesQuery = useCommittees();
  const leagues = leaguesQuery.data ?? [];
  const regionOf = new Map(leagues.map((l) => [l.id, l.region.name]));

  if (level === CompetitionLevel.REGIONAL) {
    return {
      organisers: leagues
        .map((league) => ({
          id: league.id,
          name: league.region.name,
          code: regionShapeCode(league.region.name),
        }))
        .sort((a, b) => a.name.localeCompare(b.name)),
      error: leaguesQuery.error,
      retry: leaguesQuery.refetch,
    };
  }

  return {
    organisers: (committeesQuery.data ?? [])
      .map((committee) => ({
        id: committee.id,
        name: committee.department.name,
        code: normalizeDepartmentCode(committee.department.code),
        group: regionOf.get(committee.leagueId),
      }))
      .sort(byDepartment),
    error: committeesQuery.error ?? leaguesQuery.error,
    retry: () =>
      Promise.all([committeesQuery.refetch(), leaguesQuery.refetch()]),
  };
}
