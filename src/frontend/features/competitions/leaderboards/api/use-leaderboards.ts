// src/frontend/features/competitions/leaderboards/api/use-leaderboards.ts
import { useQueries, useQuery } from "@tanstack/react-query";

import { leaderboardsKeys } from "@/features/competitions/leaderboards/api/leaderboardsKeys";

import type { LeaderboardFilters } from "../types/LeaderboardFilters";
import { leaderboardsService } from "./leaderboards.service";

/**
 * Hook to fetch leaderboard data with optional filters.
 *
 * Features:
 * - Automatic caching (2 minutes - leaderboards change frequently)
 * - Background refetching
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
  return useQuery({
    queryKey: leaderboardsKeys.list(filters),
    queryFn: () => leaderboardsService.getAll(filters),
    enabled: options?.enabled ?? true,
    staleTime: 2 * 60 * 1000, // 2 minutes (leaderboards change frequently)
  });
}

/**
 * Hook to fetch leaderboard data for multiple pools simultaneously.
 *
 * Features:
 * - Runs parallel queries for each pool
 * - Automatic caching (2 minutes - leaderboards change frequently)
 * - Background refetching
 *
 * @param filters - Array of filter criteria, one per pool
 * @returns Array of React Query results, one per filter
 *
 * @example
 * const leaderboardQueries = useLeaderboards(pools.map((pool) => ({ poolId: pool.id })));
 * const data = leaderboardQueries[0]?.data;
 */
export function useLeaderboards(filters: LeaderboardFilters[]) {
  return useQueries({
    queries: filters.map((filter) => ({
      queryKey: leaderboardsKeys.list(filter),
      queryFn: () => leaderboardsService.getAll(filter),
      enabled: !!filter.poolId,
      staleTime: 2 * 60 * 1000, // 2 minutes (leaderboards change frequently)
    })),
  });
}
