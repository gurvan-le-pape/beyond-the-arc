// src/frontend/features/organizations/leagues/api/use-leagues.ts
import { useQuery } from "@tanstack/react-query";

import { leaguesService } from "./leagues.service";
import { leaguesKeys } from "./leaguesKeys";

/**
 * Hook to fetch all leagues (regional leagues).
 *
 * Features:
 * - Automatic caching (5 minutes)
 * - Background refetching
 * - Loading and error states
 *
 * @returns React Query result with leagues data
 *
 * @example
 * const { data: leagues, isLoading } = useLeagues();
 */
export function useLeagues() {
  return useQuery({
    queryKey: leaguesKeys.all,
    queryFn: () => leaguesService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single league by ID.
 *
 * @param id - The league ID
 * @param options - Additional query options
 * @returns React Query result with league data
 *
 * @example
 * const { data: league, isLoading } = useLeague(1);
 */
export function useLeague(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: leaguesKeys.detail(id),
    queryFn: () => leaguesService.getById(id),
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch multiple leagues by their IDs.
 *
 * @param ids - Array of league IDs
 * @param options - Additional query options
 * @returns React Query result with leagues data
 *
 * @example
 * const { data: leagues } = useLeaguesByIds([1, 2, 3]);
 */
export function useLeaguesByIds(
  ids: number[],
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [...leaguesKeys.lists(), { ids }],
    queryFn: () => leaguesService.getByIds(ids),
    enabled: options?.enabled ?? ids.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
