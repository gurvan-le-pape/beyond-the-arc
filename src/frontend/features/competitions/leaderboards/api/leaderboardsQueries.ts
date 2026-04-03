// src/frontend/features/competitions/leaderboards/api/leaderboardsQueries.ts
import type { QueryClient } from "@tanstack/react-query";

import type { Leaderboard } from "../types";
import type { LeaderboardFilters } from "../types/LeaderboardFilters";
import { leaderboardsService } from "./leaderboards.service";
import { leaderboardsKeys } from "./leaderboardsKeys";

/**
 * Global query configuration for leaderboards feature.
 * Centralizes cache timing and behavior policies.
 */
const LEADERBOARDS_CONFIG = {
  /**
   * Data remains fresh for 2 minutes.
   * Leaderboards reflect live match results and update frequently
   * throughout the week — shorter staleTime than structural data
   * (clubs, leagues, pools) is intentional and important.
   */
  staleTime: 2 * 60 * 1000,

  /**
   * Cached data garbage collected after 5 minutes of no usage.
   * Matches the matches feature gcTime — both are live-result data
   * with similar volatility and access patterns.
   */
  gcTime: 5 * 60 * 1000,
} as const;

/**
 * Query options factory for leaderboards.
 *
 * Implements the Query Options pattern for:
 * - Single source of truth (queryKey + queryFn + config)
 * - Type-safe options spreading
 * - Consistency between useQuery, useQueries, prefetchQuery, and mutations
 * - Easy testing (export options, test queryFn directly)
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
 * @see https://tkdodo.eu/blog/leveraging-the-query-function-context
 */
export const leaderboardsQueries = {
  /**
   * Query options for fetching leaderboard data with optional filters.
   * Used by both `useLeaderboard` (single) and `useLeaderboards` (parallel)
   * to ensure cache sharing across both hooks.
   *
   * @example
   * useQuery(leaderboardsQueries.list({ poolId: 1 }))
   */
  list: (filters?: LeaderboardFilters) => ({
    queryKey: leaderboardsKeys.list(filters),
    queryFn: (): Promise<Leaderboard[]> => leaderboardsService.getAll(filters),
    ...LEADERBOARDS_CONFIG,
  }),
} as const;

/**
 * Prefetch utilities for optimistic data loading.
 * Call these on hover/route changes to warm the cache.
 */
export const leaderboardsPrefetch = {
  /**
   * Prefetch leaderboard for a pool (e.g., on pool-card hover or tab navigation).
   *
   * @example
   * const prefetch = leaderboardsPrefetch.list(queryClient);
   * <PoolCard onMouseEnter={() => prefetch({ poolId: pool.id })} />
   */
  list: (queryClient: QueryClient) => (filters?: LeaderboardFilters) => {
    queryClient.prefetchQuery(leaderboardsQueries.list(filters)).catch(() => {
      // Silently fail - prefetch is opportunistic
    });
  },
} as const;
