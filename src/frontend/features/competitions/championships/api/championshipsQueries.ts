// src/frontend/features/competitions/championships/api/championshipsQueries.ts
import type { QueryClient } from "@tanstack/react-query";

import type { ChampionshipFilters } from "../types/ChampionshipFilters";
import { championshipsService } from "./championships.service";
import { championshipsKeys } from "./championshipsKeys";

/**
 * Global query configuration for championships feature.
 * Centralizes cache timing and behavior policies.
 */
const CHAMPIONSHIPS_CONFIG = {
  /**
   * Data remains fresh for 5 minutes.
   * Championship metadata (name, dates, level) is stable within a session
   * but can be updated by admins between visits.
   */
  staleTime: 5 * 60 * 1000,

  /**
   * Cached data garbage collected after 10 minutes of no usage.
   * Championships are a top-level navigation entry point, browsed
   * heavily within a session across pools, leaderboards, and matches.
   */
  gcTime: 10 * 60 * 1000,
} as const;

/**
 * Query options factory for championships.
 *
 * Implements the Query Options pattern for:
 * - Single source of truth (queryKey + queryFn + config)
 * - Type-safe options spreading
 * - Consistency between useQuery, prefetchQuery, and mutations
 * - Easy testing (export options, test queryFn directly)
 *
 * @see https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories
 * @see https://tkdodo.eu/blog/leveraging-the-query-function-context
 */
export const championshipsQueries = {
  /**
   * Query options for fetching championships with optional filters.
   *
   * @example
   * useQuery(championshipsQueries.list({ level: 'national' }))
   */
  list: (filters?: ChampionshipFilters) => ({
    queryKey: championshipsKeys.list(filters),
    queryFn: () => championshipsService.getAll(filters),
    ...CHAMPIONSHIPS_CONFIG,
  }),

  /**
   * Query options for fetching a single championship by ID.
   *
   * @example
   * useQuery(championshipsQueries.detail(123))
   */
  detail: (id: number) => ({
    queryKey: championshipsKeys.detail(id),
    queryFn: () => championshipsService.getById(id),
    ...CHAMPIONSHIPS_CONFIG,
  }),
} as const;

/**
 * Prefetch utilities for optimistic data loading.
 * Call these on hover/route changes to warm the cache.
 */
export const championshipsPrefetch = {
  /**
   * Prefetch championship detail (e.g., on list-row hover).
   *
   * @example
   * const prefetch = championshipsPrefetch.detail(queryClient);
   * <tr onMouseEnter={() => prefetch(championship.id)} />
   */
  detail: (queryClient: QueryClient) => (championshipId: number) => {
    queryClient
      .prefetchQuery(championshipsQueries.detail(championshipId))
      .catch(() => {
        // Silently fail - prefetch is opportunistic
      });
  },

  /**
   * Prefetch championships list with given filters (e.g., before a filter panel opens).
   *
   * @example
   * const prefetch = championshipsPrefetch.list(queryClient);
   * <FilterPanel onOpen={() => prefetch({ level: 'regional' })} />
   */
  list: (queryClient: QueryClient) => (filters?: ChampionshipFilters) => {
    queryClient
      .prefetchQuery(championshipsQueries.list(filters))
      .catch(() => {});
  },
} as const;
