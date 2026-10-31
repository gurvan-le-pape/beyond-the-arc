// src/frontend/features/teams/api/useTeams.ts
import { useQuery } from "@tanstack/react-query";

import type { ApiError, PaginatedResponse } from "@/shared/types";

import type { Team, TeamFilterValues } from "../types";
import type { TeamFilters } from "../types/TeamFilters";
import { teamsQueries } from "./teamsQueries";

/**
 * Hook to fetch all teams with optional filters and pagination.
 *
 * Features:
 * - Automatic caching (5 minutes stale, 10 minutes GC)
 * - Background refetch on mount when stale (window-focus refetching is off)
 * - Pagination support
 *
 * @param filters - Optional filter criteria (clubId, level, category, etc.)
 * @param options - Additional query options
 * @returns React Query result with paginated teams data
 *
 * @example
 * const { data: teamsData, isLoading } = useTeams({ clubId: 1, page: 1 });
 */
export function useTeams(
  filters?: TeamFilters,
  options?: { enabled?: boolean },
) {
  return useQuery<PaginatedResponse<Team>, ApiError>({
    ...teamsQueries.list(filters),
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch available filter values for teams.
 * Returns pool numbers, letters, and divisions scoped to an optional
 * committee or league. Stays very fresh (30 seconds) to reflect live
 * admin changes in filter UIs.
 *
 * @param params - Optional scoping parameters (committeeId, leagueId)
 * @returns React Query result with filter values
 *
 * @example
 * const { data: filterValues } = useTeamFilterValues({ committeeId: 1 });
 */
export function useTeamFilterValues(params?: {
  committeeId?: number;
  leagueId?: number;
}) {
  return useQuery<TeamFilterValues, ApiError>(
    teamsQueries.filterValues(params),
  );
}
