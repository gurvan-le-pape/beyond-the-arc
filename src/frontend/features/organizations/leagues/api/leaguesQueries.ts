// src/frontend/features/organizations/leagues/api/leaguesQueries.ts
import type { QueryClient, QueryFunctionContext } from "@tanstack/react-query";

import { leaguesService } from "./leagues.service";
import { leaguesKeys } from "./leaguesKeys";

/**
 * Global query configuration for leagues feature.
 * Centralizes cache timing and behavior policies.
 */
const LEAGUES_CONFIG = {
  /**
   * Data remains fresh for 5 minutes.
   * League data (names, regions) is among the most stable in the app —
   * changes are rare and administrative, not match-driven.
   */
  staleTime: 5 * 60 * 1000,

  /**
   * Cached data garbage collected after 15 minutes of no usage.
   * Leagues are reference data loaded early and reused across many
   * features (committees, clubs, championships), so a generous gcTime
   * avoids redundant fetches during deep navigation sessions.
   */
  gcTime: 15 * 60 * 1000,
} as const;

/**
 * Query options factory for leagues.
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
export const leaguesQueries = {
  /**
   * Query options for fetching all leagues.
   *
   * Keyed on the `lists()` rung even though the list takes no filters. Keying
   * it on `all` — the tempting reading of "there are no filters" — puts it
   * *above* the rung, so `invalidateQueries({ queryKey: leaguesKeys.lists() })`
   * misses the full list while still matching `byIds`. Measured: 1 match
   * without the list, against 2 with it. Every feature keys its list this way.
   *
   * @example
   * useQuery(leaguesQueries.list())
   */
  list: () => ({
    queryKey: leaguesKeys.lists(),
    queryFn: ({ signal }: QueryFunctionContext) =>
      leaguesService.getAll(signal),
    ...LEAGUES_CONFIG,
  }),

  /**
   * Query options for fetching a single league by ID.
   *
   * @example
   * useQuery(leaguesQueries.detail(1))
   */
  detail: (id: number) => ({
    queryKey: leaguesKeys.detail(id),
    queryFn: ({ signal }: QueryFunctionContext) =>
      leaguesService.getById(id, signal),
    ...LEAGUES_CONFIG,
  }),

  /**
   * Query options for fetching multiple leagues by their IDs.
   * Useful when a view needs a specific subset without loading all leagues.
   *
   * @example
   * useQuery(leaguesQueries.byIds([1, 2, 3]))
   */
  byIds: (ids: number[]) => ({
    queryKey: leaguesKeys.byIds(ids),
    queryFn: ({ signal }: QueryFunctionContext) =>
      leaguesService.getByIds(ids, signal),
    ...LEAGUES_CONFIG,
  }),
} as const;

/**
 * Prefetch utilities for optimistic data loading.
 * Call these on hover/route changes to warm the cache.
 */
export const leaguesPrefetch = {
  /**
   * Prefetch the full leagues list (e.g., before a league-selector mounts).
   *
   * @example
   * const prefetch = leaguesPrefetch.list(queryClient);
   * <LeagueSelector onOpen={() => prefetch()} />
   */
  list: (queryClient: QueryClient) => () => {
    queryClient.prefetchQuery(leaguesQueries.list()).catch(() => {
      // Silently fail - prefetch is opportunistic
    });
  },

  /**
   * Prefetch league detail (e.g., on list-item hover).
   *
   * @example
   * const prefetch = leaguesPrefetch.detail(queryClient);
   * <tr onMouseEnter={() => prefetch(league.id)} />
   */
  detail: (queryClient: QueryClient) => (leagueId: number) => {
    queryClient.prefetchQuery(leaguesQueries.detail(leagueId)).catch(() => {});
  },
} as const;
