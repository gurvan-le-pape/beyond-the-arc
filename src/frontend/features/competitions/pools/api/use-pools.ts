// src/frontend/features/competitions/pools/api/use-pools.ts
import { useQuery } from "@tanstack/react-query";

import { poolsService } from "./pools.service";
import { poolsKeys } from "./poolsKeys";

/**
 * Hook to fetch all pools for a specific championship.
 *
 * Features:
 * - Automatic caching (5 minutes)
 * - Background refetching
 * - Conditional enabling based on championshipId
 *
 * @param championshipId - The championship ID
 * @param options - Additional query options
 * @returns React Query result with pools data
 *
 * @example
 * const { data: pools, isLoading } = usePools(5);
 *
 * @example
 * // Conditionally enabled
 * const { data: pools } = usePools(championshipId, {
 *   enabled: !!championshipId,
 * });
 */
export function usePools(
  championshipId: number,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: poolsKeys.byChampionship(championshipId),
    queryFn: () => poolsService.getByChampionshipId(championshipId),
    enabled: options?.enabled ?? !!championshipId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
