// src/frontend/features/competitions/leaderboards/api/use-leaderboards.ts
import type { UseQueryResult } from "@tanstack/react-query";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types";

import type { Leaderboard } from "../types/Leaderboard";
import type { LeaderboardFilters } from "../types/LeaderboardFilters";
import {
  leaderboardsPrefetch,
  leaderboardsQueries,
} from "./leaderboardsQueries";

/**
 * Hook to fetch leaderboard data with optional filters.
 *
 * Features:
 * - Automatic caching (2 minutes stale, 5 minutes GC — leaderboards change frequently)
 * - Background refetching on window focus
 * - Conditional enabling
 *
 * @param filters - Filter criteria (poolId)
 * @param options - Additional query options
 * @returns React Query result with leaderboard data
 *
 * @example
 * const { data: leaderboard, isLoading } = useLeaderboard({ poolId: 1 });
 *
 * @example
 * // Conditionally enabled
 * const { data } = useLeaderboard(
 *   { poolId },
 *   { enabled: !!poolId }
 * );
 */
export function useLeaderboard(
  filters?: LeaderboardFilters,
  options?: { enabled?: boolean },
) {
  return useQuery<Leaderboard[], ApiError>({
    ...leaderboardsQueries.list(filters),
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch leaderboard data for multiple pools simultaneously.
 *
 * Runs parallel queries for each filter set and reuses cached data from
 * `useLeaderboard` when available (same query keys via `leaderboardsQueries.list`).
 *
 * @param filters - Array of filter criteria, one per pool
 * @returns Array of React Query results, one per filter
 *
 * @example
 * const leaderboardQueries = useLeaderboards(pools.map((pool) => ({ poolId: pool.id })));
 * const data = leaderboardQueries[0]?.data;
 */
export function useLeaderboards(filters: LeaderboardFilters[]) {
  return useQueries<UseQueryResult<Leaderboard[], ApiError>[]>({
    queries: filters.map((filter) => ({
      ...leaderboardsQueries.list(filter),
      enabled: !!filter.poolId,
    })),
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
 * const prefetch = useLeaderboardsPrefetch();
 * <PoolCard onMouseEnter={() => prefetch.list({ poolId: pool.id })} />
 */
export function useLeaderboardsPrefetch() {
  const queryClient = useQueryClient();

  return {
    list: leaderboardsPrefetch.list(queryClient),
  };
}
