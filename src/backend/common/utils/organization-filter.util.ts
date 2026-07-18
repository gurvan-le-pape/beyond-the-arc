// src/backend/common/utils/organization-filter.util.ts

/**
 * Query params scoping a resource to an organization (committee/league).
 */
export interface OrganizationScopeFilters {
  committeeId?: number;
  leagueId?: number;
}

/**
 * Club-scoped where fragment shared by every organization-filtered endpoint.
 * Structurally assignable to Prisma.ClubsWhereInput; callers embed it via
 * their own join path (clubs directly, teams `{ club }`, players
 * `{ team: { club } }`, matches home/away team).
 *
 * Every provided filter applies — committeeId and leagueId combine as AND,
 * and neither is gated on a `level` param.
 */
export function buildClubOrganizationWhere(
  filters?: OrganizationScopeFilters,
): { committeeId?: number; committee?: { leagueId: number } } | undefined {
  if (!filters?.committeeId && !filters?.leagueId) return undefined;

  return {
    ...(filters.committeeId ? { committeeId: filters.committeeId } : {}),
    ...(filters.leagueId ? { committee: { leagueId: filters.leagueId } } : {}),
  };
}

/**
 * Combines where fragments with AND semantics only. Undefined and empty
 * fragments are dropped; a single fragment is returned as-is; multiple
 * fragments become `{ AND: [...] }`. Never assigns to a shared OR key, so
 * two OR-groups can't clobber each other.
 */
export function andWhere<W extends object>(
  ...fragments: (W | undefined)[]
): W | undefined {
  const present = fragments.filter(
    (fragment): fragment is W =>
      fragment !== undefined && Object.keys(fragment).length > 0,
  );

  if (present.length === 0) return undefined;
  if (present.length === 1) return present[0];
  return { AND: present } as unknown as W;
}
