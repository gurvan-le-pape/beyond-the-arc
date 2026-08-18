// src/frontend/features/matches/api/matchesQueries.ts
import type { QueryClient, QueryFunctionContext } from "@tanstack/react-query";

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
   *
   * @param filters - filter and pagination criteria; part of the cache key, so each combination caches separately
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  list: (filters?: MatchFilters) => ({
    queryKey: matchesKeys.list(filters),
    queryFn: ({ signal }: QueryFunctionContext) =>
      matchesService.getAll(filters, signal),
    ...MATCHES_CONFIG,
  }),

  /**
   * Query options for fetching detailed match information.
   *
   * @example
   * useQuery(matchesQueries.detail(123))
   *
   * @param id - the match's id
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  detail: (id: number) => ({
    queryKey: matchesKeys.detail(id),
    queryFn: ({ signal }: QueryFunctionContext) =>
      matchesService.getById(id, signal),
    ...MATCHES_CONFIG,
  }),

  /**
   * Query options for fetching matches by pool ID.
   * Returns unpaginated results (limit: 500).
   *
   * @example
   * useQuery(matchesQueries.byPool(10))
   *
   * @param poolId - the pool whose fixtures to list
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  byPool: (poolId: number) => ({
    queryKey: matchesKeys.byPool(poolId),
    queryFn: ({ signal }: QueryFunctionContext) =>
      matchesService.getByPoolId(poolId, signal),
    ...MATCHES_CONFIG,
  }),

  /**
   * Query options for fetching matches by championship ID.
   * Returns unpaginated results (limit: 500).
   *
   * @example
   * useQuery(matchesQueries.byChampionship(5))
   *
   * @param championshipId - the championship whose matches to list
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  byChampionship: (championshipId: number) => ({
    queryKey: matchesKeys.byChampionship(championshipId),
    queryFn: ({ signal }: QueryFunctionContext) =>
      matchesService.getByChampionshipId(championshipId, signal),
    ...MATCHES_CONFIG,
  }),

  /**
   * Query options for fetching match events.
   * Events are immutable once created, so can be cached longer.
   *
   * @example
   * useQuery(matchesQueries.events(123))
   *
   * @param matchId - the match whose events to load
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  events: (matchId: number) => ({
    queryKey: matchesKeys.events(matchId),
    queryFn: ({ signal }: QueryFunctionContext) =>
      matchesService.getEventsByMatchId(matchId, signal),
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
   *
   * @param matchId - the match whose box score to load
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  playerStats: (matchId: number) => ({
    queryKey: matchesKeys.playerStats(matchId),
    queryFn: ({ signal }: QueryFunctionContext) =>
      matchesService.getPlayerStatsByMatchId(matchId, signal),
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
   *
   * @param queryClient - the client to warm
   * @returns a prefetcher taking a match id — call it on hover or focus, before navigation
   */
  events: (queryClient: QueryClient) => (matchId: number) => {
    queryClient.prefetchQuery(matchesQueries.events(matchId)).catch(() => {
      // Silently fail - prefetch is opportunistic
    });
  },

  /**
   * Prefetch match detail (e.g., on link hover).
   *
   * @param queryClient - the client to warm
   * @returns a prefetcher taking a match id — call it on hover or focus, before navigation
   */
  detail: (queryClient: QueryClient) => (matchId: number) => {
    queryClient.prefetchQuery(matchesQueries.detail(matchId)).catch(() => {});
  },

  /**
   * Prefetch player stats (e.g., on tab navigation).
   *
   * @param queryClient - the client to warm
   * @returns a prefetcher taking a match id — call it on hover or focus, before navigation
   */
  playerStats: (queryClient: QueryClient) => (matchId: number) => {
    queryClient
      .prefetchQuery(matchesQueries.playerStats(matchId))
      .catch(() => {});
  },

  /**
   * Prefetch matches for a specific pool (e.g., on pool selector hover).
   *
   * @param queryClient - the client to warm
   * @returns a prefetcher taking a pool id — warms the same key the pool query will read
   */
  byPool: (queryClient: QueryClient) => (poolId: number) => {
    queryClient.prefetchQuery(matchesQueries.byPool(poolId)).catch(() => {});
  },
} as const;
