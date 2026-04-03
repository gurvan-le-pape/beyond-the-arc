// src/frontend/features/organizations/leagues/api/use-leagues.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types/Api";

import type { League } from "../types/League";
import { leaguesPrefetch, leaguesQueries } from "./leaguesQueries";

/**
 * Hook to fetch all leagues (regional leagues).
 *
 * Features:
 * - Automatic caching (5 minutes stale, 15 minutes GC)
 * - Background refetching on window focus
 *
 * @returns React Query result with leagues data
 *
 * @example
 * const { data: leagues, isLoading } = useLeagues();
 */
export function useLeagues() {
  return useQuery<League[], ApiError>(leaguesQueries.list());
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
  return useQuery<League, ApiError>({
    ...leaguesQueries.detail(id),
    enabled: options?.enabled ?? !!id,
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
  return useQuery<League[], ApiError>({
    ...leaguesQueries.byIds(ids),
    enabled: options?.enabled ?? ids.length > 0,
  });
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
 * const prefetch = useLeaguesPrefetch();
 * <tr onMouseEnter={() => prefetch.detail(league.id)} />
 */
export function useLeaguesPrefetch() {
  const queryClient = useQueryClient();

  return {
    list: leaguesPrefetch.list(queryClient),
    detail: leaguesPrefetch.detail(queryClient),
  };
}
