// src/frontend/features/competitions/pools/api/poolsQueries.ts
import type { QueryClient } from "@tanstack/react-query";

import type { Pool } from "../types";
import { poolsService } from "./pools.service";
import { poolsKeys } from "./poolsKeys";

/**
 * Global query configuration for pools feature.
 * Centralizes cache timing and behavior policies.
 */
const POOLS_CONFIG = {
  /**
   * Data remains fresh for 5 minutes.
   * Pool structure (teams, groups) is set at the start of a championship
   * and rarely changes mid-season.
   */
  staleTime: 5 * 60 * 1000,

  /**
   * Cached data garbage collected after 10 minutes of no usage.
   * Pools are loaded alongside championships and navigated heavily
   * within a session, so keeping them warm reduces redundant fetches.
   */
  gcTime: 10 * 60 * 1000,
} as const;

/**
 * Query options factory for pools.
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
export const poolsQueries = {
  /**
   * Query options for fetching all pools for a specific championship.
   * Used by both `usePools` (single) and `usePoolsByChampionshipIds` (parallel)
   * to ensure cache sharing across both hooks.
   *
   * @example
   * useQuery(poolsQueries.byChampionship(5))
   */
  byChampionship: (championshipId: number) => ({
    queryKey: poolsKeys.byChampionship(championshipId),
    queryFn: (): Promise<Pool[]> =>
      poolsService.getByChampionshipId(championshipId),
    ...POOLS_CONFIG,
  }),
} as const;

/**
 * Prefetch utilities for optimistic data loading.
 * Call these on hover/route changes to warm the cache.
 */
export const poolsPrefetch = {
  /**
   * Prefetch pools for a championship (e.g., on championship-card hover).
   *
   * @example
   * const prefetch = poolsPrefetch.byChampionship(queryClient);
   * <ChampionshipCard onMouseEnter={() => prefetch(championship.id)} />
   */
  byChampionship: (queryClient: QueryClient) => (championshipId: number) => {
    queryClient
      .prefetchQuery(poolsQueries.byChampionship(championshipId))
      .catch(() => {
        // Silently fail - prefetch is opportunistic
      });
  },
} as const;
