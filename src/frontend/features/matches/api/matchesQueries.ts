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
} as const;
