// src/frontend/features/teams/api/useTeams.ts
import { useQuery } from "@tanstack/react-query";

import type { ApiError, PaginatedResponse } from "@/shared/types";

import type { Team } from "../types";
import type { TeamFilters } from "../types/TeamFilters";
import { teamsQueries } from "./teamsQueries";

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
  return useQuery<PaginatedResponse<Team>, ApiError>({
    ...teamsQueries.list(filters),
    enabled: options?.enabled ?? true,
  });
}
