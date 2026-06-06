// src/frontend/features/matches/api/use-matches.ts
import type { UseQueryResult } from "@tanstack/react-query";
import {
  keepPreviousData,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { ApiError, PaginatedResponse } from "@/shared/types";

import type { Match } from "../types/Match";
import type { MatchDetail } from "../types/MatchDetail";
import type { MatchEvent } from "../types/MatchEvent";
import type { MatchFilters } from "../types/MatchFilters";
import type { MatchPlayerStatsResponse } from "../types/MatchPlayerStats";
import { matchesPrefetch, matchesQueries } from "./matchesQueries";

/**
 * Hook to fetch all matches with optional filters and pagination.
 *
 * Features:
 * - Automatic caching (2 minutes stale, 5 minutes GC)
 * - Background refetching on window focus
 * - Pagination support
 *
 * @param filters - Optional filter criteria
 * @returns React Query result with paginated matches
 *
 * @example
 * const { data, isLoading } = useMatches({
 *   championshipId: 1,
 *   page: 1,
 *   limit: 20,
 * });
 */
export function useMatches(filters?: MatchFilters) {
  return useQuery<PaginatedResponse<Match>, ApiError>(
    matchesQueries.list(filters),
  );
}

/**
 * Hook to fetch detailed information for a single match.
 *
 * @param id - The match ID
 * @param options - Additional query options
 * @returns React Query result with match details
 *
 * @example
 * const { data: match, isLoading } = useMatch(12345);
 */
export function useMatch(id: number, options?: { enabled?: boolean }) {
  return useQuery<MatchDetail, ApiError>({
    ...matchesQueries.detail(id),
    enabled: options?.enabled ?? !!id,
  });
}

/**
 * Hook to fetch all matches for a specific pool.
 *
 * Features:
 * - Keeps previous pool data visible while fetching new pool (instant switching UX)
 *
 * @param poolId - The pool ID
 * @param options - Additional query options
 * @returns React Query result with matches
 *
 * @example
 * const { data: matches } = useMatchesByPool(10);
 */
export function useMatchesByPool(
  poolId: number,
  options?: { enabled?: boolean },
) {
  return useQuery<Match[], ApiError>({
    ...matchesQueries.byPool(poolId),
    enabled: options?.enabled ?? !!poolId,
    placeholderData: keepPreviousData,
  });
}

/**
 * Hook to fetch matches for multiple pools simultaneously.
 *
 * Features:
 * - Runs parallel queries for each pool
 * - Automatic caching (2 minutes stale, 5 minutes GC)
 * - Background refetching
 *
 * @param poolIds - Array of pool IDs to fetch matches for
 * @returns Array of React Query results, one per pool ID
 *
 * @example
 * const matchQueries = useMatchesByPools([1, 2, 3]);
 * const allLoaded = matchQueries.every(q => q.isSuccess);
 */
export function useMatchesByPools(poolIds: number[]) {
  return useQueries<UseQueryResult<Match[], ApiError>[]>({
    queries: poolIds.map((poolId) => ({
      ...matchesQueries.byPool(poolId),
      enabled: !!poolId,
    })),
  });
}

/**
 * Hook to fetch all matches for a specific championship.
 *
 * @param championshipId - The championship ID
 * @param options - Additional query options
 * @returns React Query result with matches
 *
 * @example
 * const { data: matches } = useMatchesByChampionship(5);
 */
export function useMatchesByChampionship(
  championshipId: number,
  options?: { enabled?: boolean },
) {
  return useQuery<Match[], ApiError>({
    ...matchesQueries.byChampionship(championshipId),
    enabled: options?.enabled ?? !!championshipId,
  });
}

/**
 * Hook to fetch all events for a specific match.
 *
 * @param matchId - The match ID
 * @param options - Additional query options
 * @returns React Query result with match events
 *
 * @example
 * const { data: events } = useMatchEvents(12345);
 */
export function useMatchEvents(
  matchId: number,
  options?: { enabled?: boolean },
) {
  return useQuery<MatchEvent[], ApiError>({
    ...matchesQueries.events(matchId),
    enabled: options?.enabled ?? !!matchId,
  });
}

/**
 * Hook to fetch player statistics for a specific match.
 *
 * @param matchId - The match ID
 * @param options - Additional query options
 * @returns React Query result with player stats
 *
 * @example
 * const { data: stats } = useMatchPlayerStats(12345);
 */
export function useMatchPlayerStats(
  matchId: number,
  options?: { enabled?: boolean },
) {
  return useQuery<MatchPlayerStatsResponse, ApiError>({
    ...matchesQueries.playerStats(matchId),
    enabled: options?.enabled ?? !!matchId,
  });
}

/**
 * Hook returning prefetch utilities for optimistic loading.
 *
 * Returns an object with prefetch functions for different data types.
 * Call these on hover, route changes, or predicted navigation.
 *
 * @returns Object with prefetch functions
 *
 * @example
 * const prefetch = useMatchesPrefetch();
 * <button onMouseEnter={() => prefetch.events(match.id)} />
 */
export function useMatchesPrefetch() {
  const queryClient = useQueryClient();

  return {
    events: matchesPrefetch.events(queryClient),
    detail: matchesPrefetch.detail(queryClient),
    playerStats: matchesPrefetch.playerStats(queryClient),
    byPool: matchesPrefetch.byPool(queryClient),
  };
}
