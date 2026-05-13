// src/frontend/features/competitions/pools/api/use-pools.ts
import type { UseQueryResult } from "@tanstack/react-query";
import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/shared/types";

import type { Pool } from "../types/Pool";
import { poolsPrefetch, poolsQueries } from "./poolsQueries";

/**
 * Hook to fetch all pools for a specific championship.
 *
 * Features:
 * - Automatic caching (5 minutes stale, 10 minutes GC)
 * - Background refetching on window focus
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
    ...poolsQueries.byChampionship(championshipId),
    enabled: options?.enabled ?? !!championshipId,
  });
}

/**
 * Hook to fetch pools for multiple championships simultaneously.
 *
 * Runs parallel queries for each championship ID and merges the results.
 * Reuses cached data from `usePools` when available (same query keys via
 * `poolsQueries.byChampionship`).
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
      ...poolsQueries.byChampionship(id),
      enabled: !!id,
    })),
  });

  return {
    data: results.flatMap((r) => r.data ?? []),
    isLoading: results.some((r) => r.isLoading),
    error: results.find((r) => r.error)?.error as ApiError | null,
  };
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
 * const prefetch = usePoolsPrefetch();
 * <ChampionshipCard onMouseEnter={() => prefetch.byChampionship(championship.id)} />
 */
export function usePoolsPrefetch() {
  const queryClient = useQueryClient();

  return {
    byChampionship: poolsPrefetch.byChampionship(queryClient),
  };
}
