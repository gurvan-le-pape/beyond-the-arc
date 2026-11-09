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
   * The shortest window of the feature caches: scores and statuses change
   * while matches are played. Window-focus refetching is off app-wide, so a
   * stale entry refetches on the next mount, not when the tab regains focus.
   */
  staleTime: 2 * 60 * 1000,
  gcTime: 5 * 60 * 1000,
} as const;

/**
 * Query options for every matches request: key, fetcher and cache policy in
 * one object, spread by the hooks in `useMatches.ts` and the prefetch helpers
 * below, so call sites cannot disagree on any of the three. The pattern is
 * described in `docs/frontend.md`.
 */
export const matchesQueries = {
  /**
   * Query options for fetching all matches with filters and pagination.
   *
   * @example
   * useQuery(matchesQueries.list({ poolId: 1 }))
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
