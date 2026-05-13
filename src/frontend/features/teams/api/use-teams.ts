// src/frontend/features/teams/api/use-teams.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types";

import type {
  Team,
  TeamFilterValues,
  TeamMatchHistory,
  TeamsPaginatedResponse,
} from "../types";
import type { TeamFilters } from "../types/TeamFilters";
import { teamsPrefetch, teamsQueries } from "./teamsQueries";

/**
 * Hook to fetch all teams with optional filters and pagination.
 *
 * Features:
 * - Automatic caching (5 minutes stale, 10 minutes GC)
 * - Background refetching on window focus
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
  return useQuery<TeamsPaginatedResponse, ApiError>({
    ...teamsQueries.list(filters),
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch a single team by ID.
 *
 * @param id - The team ID
 * @param options - Additional query options
 * @returns React Query result with team data
 *
 * @example
 * const { data: team, isLoading } = useTeam(123);
 */
export function useTeam(id: number, options?: { enabled?: boolean }) {
  return useQuery<Team, ApiError>({
    ...teamsQueries.detail(id),
    enabled: options?.enabled ?? !!id,
  });
}

/**
 * Hook to fetch match history for a specific team.
 * Refreshes more aggressively (2 minutes) than other team data
 * since results update throughout the week as fixtures are played.
 *
 * @param id - The team ID
 * @param options - Additional query options
 * @returns React Query result with team match history
 *
 * @example
 * const { data: matches, isLoading } = useTeamMatches(123);
 */
export function useTeamMatches(id: number, options?: { enabled?: boolean }) {
  return useQuery<TeamMatchHistory[], ApiError>({
    ...teamsQueries.matches(id),
    enabled: options?.enabled ?? !!id,
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

/**
 * Hook returning prefetch utilities for optimistic loading.
 *
 * Returns an object with prefetch functions for different data types.
 * Call these on hover, route changes, or predicted navigation to warm
 * the cache before the user lands on the target view.
 *
 * @returns Object with prefetch functions
 *
 * @example
 * const prefetch = useTeamsPrefetch();
 * <tr onMouseEnter={() => prefetch.detail(team.id)} />
 */
export function useTeamsPrefetch() {
  const queryClient = useQueryClient();

  return {
    detail: teamsPrefetch.detail(queryClient),
    matches: teamsPrefetch.matches(queryClient),
    list: teamsPrefetch.list(queryClient),
  };
}
