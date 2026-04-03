// src/frontend/features/matches/api/matchesQueries.ts
import type { QueryClient } from "@tanstack/react-query";

import type { MatchFilters } from "../types/MatchFilters";
import { matchesService } from "./matches.service";
import { matchesKeys } from "./matchesKeys";

/**
 * Global query configuration for matches feature.
 * Centralizes cache timing and behavior policies.
 */
const MATCHES_CONFIG = {
  /**
   * Data remains fresh for 2 minutes.
   * After this, background refetch occurs on next mount/focus.
   */
  staleTime: 2 * 60 * 1000,

  /**
   * Cached data garbage collected after 5 minutes of no usage.
   * Prevents memory leaks from abandoned queries.
   */
  gcTime: 5 * 60 * 1000,
} as const;

/**
 * Query options factory for matches.
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
export const matchesQueries = {
  /**
   * Query options for fetching all matches with filters and pagination.
   *
   * @example
   * useQuery(matchesQueries.list({ championshipId: 1 }))
   */
  list: (filters?: MatchFilters) => ({
    queryKey: matchesKeys.list(filters),
    queryFn: () => matchesService.getAll(filters),
    ...MATCHES_CONFIG,
  }),

  /**
   * Query options for fetching detailed match information.
   *
   * @example
   * useQuery(matchesQueries.detail(123))
   */
  detail: (id: number) => ({
    queryKey: matchesKeys.detail(id),
    queryFn: () => matchesService.getById(id),
    ...MATCHES_CONFIG,
  }),

  /**
   * Query options for fetching matches by pool ID.
   * Returns unpaginated results (limit: 500).
   *
   * @example
   * useQuery(matchesQueries.byPool(10))
   */
  byPool: (poolId: number) => ({
    queryKey: matchesKeys.byPool(poolId),
    queryFn: () => matchesService.getByPoolId(poolId),
    ...MATCHES_CONFIG,
  }),

  /**
   * Query options for fetching matches by championship ID.
   * Returns unpaginated results (limit: 500).
   *
   * @example
   * useQuery(matchesQueries.byChampionship(5))
   */
  byChampionship: (championshipId: number) => ({
    queryKey: matchesKeys.byChampionship(championshipId),
    queryFn: () => matchesService.getByChampionshipId(championshipId),
    ...MATCHES_CONFIG,
  }),

  /**
   * Query options for fetching match events.
   * Events are immutable once created, so can be cached longer.
   *
   * @example
   * useQuery(matchesQueries.events(123))
   */
  events: (matchId: number) => ({
    queryKey: matchesKeys.events(matchId),
    queryFn: () => matchesService.getEventsByMatchId(matchId),
    ...MATCHES_CONFIG,
    // Events don't change after match ends - extend cache for finished matches
    staleTime: 5 * 60 * 1000,
  }),

  /**
   * Query options for fetching player statistics for a match.
   * Stats are immutable once match ends.
   *
   * @example
   * useQuery(matchesQueries.playerStats(123))
   */
  playerStats: (matchId: number) => ({
    queryKey: matchesKeys.playerStats(matchId),
    queryFn: () => matchesService.getPlayerStatsByMatchId(matchId),
    ...MATCHES_CONFIG,
    // Stats don't change after match ends - extend cache
    staleTime: 5 * 60 * 1000,
  }),
} as const;

/**
 * Prefetch utilities for optimistic data loading.
 * Call these on hover/route changes to warm the cache.
 */
export const matchesPrefetch = {
  /**
   * Prefetch match events (e.g., on accordion hover).
   *
   * @example
   * const prefetch = matchesPrefetch.events(queryClient);
   * <button onMouseEnter={() => prefetch(matchId)} />
   */
  events: (queryClient: QueryClient) => (matchId: number) => {
    queryClient.prefetchQuery(matchesQueries.events(matchId)).catch(() => {
      // Silently fail - prefetch is opportunistic
    });
  },

  /**
   * Prefetch match detail (e.g., on link hover).
   */
  detail: (queryClient: QueryClient) => (matchId: number) => {
    queryClient.prefetchQuery(matchesQueries.detail(matchId)).catch(() => {});
  },

  /**
   * Prefetch player stats (e.g., on tab navigation).
   */
  playerStats: (queryClient: QueryClient) => (matchId: number) => {
    queryClient
      .prefetchQuery(matchesQueries.playerStats(matchId))
      .catch(() => {});
  },
} as const;
