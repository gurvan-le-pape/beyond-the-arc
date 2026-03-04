// src/frontend/features/competitions/leaderboards/api/use-leaderboards.ts
import { useQuery } from "@tanstack/react-query";

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
 * @param filters - Filter criteria (poolId, championshipId, etc.)
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
