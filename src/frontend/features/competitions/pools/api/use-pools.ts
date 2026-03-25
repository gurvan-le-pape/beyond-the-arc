// src/frontend/features/competitions/pools/api/use-pools.ts
import type { UseQueryResult } from "@tanstack/react-query";
import { useQueries, useQuery } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types/Api";

import type { Pool } from "../types/Pool";
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
 * @returns React Query result with pools data (empty array if none exist)
 *
 * @example
 * const { data: pools = [], isLoading } = usePools(5);
 *
 * @example
 * // Conditionally enabled
 * const { data: pools = [] } = usePools(championshipId, {
 *   enabled: !!championshipId,
 * });
 */
export function usePools(
  championshipId: number,
  options?: { enabled?: boolean },
) {
  return useQuery<Pool[], ApiError>({
    queryKey: poolsKeys.byChampionship(championshipId),
    queryFn: () => poolsService.getByChampionshipId(championshipId),
    enabled: options?.enabled ?? !!championshipId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch pools for multiple championships simultaneously.
 *
 * Runs parallel queries for each championship ID and merges the results.
 * Reuses cached data from `usePools` when available (same query keys).
 * Returns an empty array if no championship IDs are provided.
 *
 * @param championshipIds - Array of championship IDs to fetch pools for
 * @returns Merged pools array, combined loading state, and first error if any
 *
 * @example
 * const championshipIds = championships
 *   .filter((c) => String(c.division) === String(division))
 *   .map((c) => c.id);
 *
 * const { data: pools, isLoading } = usePoolsByChampionshipIds(championshipIds);
 */
export function usePoolsByChampionshipIds(championshipIds: number[]) {
  const results = useQueries<UseQueryResult<Pool[], ApiError>[]>({
    queries: championshipIds.map((id) => ({
      queryKey: poolsKeys.byChampionship(id),
      queryFn: (): Promise<Pool[]> => poolsService.getByChampionshipId(id),
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    })),
  });

  return {
    data: results.flatMap((r) => r.data ?? []),
    isLoading: results.some((r) => r.isLoading),
    error: results.find((r) => r.error)?.error as ApiError | null,
  };
}
