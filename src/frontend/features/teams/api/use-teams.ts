// src/frontend/features/teams/api/use-teams.ts
import { useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types/Api";

import type {
  Team,
  TeamFilterValues,
  TeamMatchHistory,
  TeamsPaginatedResponse,
} from "../types";
import type { TeamFilters } from "../types/TeamFilters";
import { teamsService } from "./teams.service";
import { teamsKeys } from "./teamsKeys";

/**
 * Hook to fetch all teams with optional filters and pagination.
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
    queryKey: teamsKeys.list(filters),
    queryFn: () => teamsService.getAll(filters),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
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
    queryKey: teamsKeys.detail(id),
    queryFn: () => teamsService.getById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch match history for a specific team.
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
    queryKey: teamsKeys.matches(id),
    queryFn: () => teamsService.getMatches(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch available filter values for teams.
 * Returns numbers, pool letters, and divisions scoped to optional committee or league.
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
  return useQuery<TeamFilterValues, ApiError>({
    queryKey: teamsKeys.filterValues(params),
    queryFn: () => teamsService.getFilterValues(params),
    staleTime: 30 * 1000,
  });
}
