// src/frontend/features/players/api/playersQueries.ts
import type { QueryFunctionContext } from "@tanstack/react-query";

import type { PlayerFilters } from "../types/PlayerFilters";
import type { PlayerSearchFilters } from "../types/PlayerSearchFilters";
import { playersService } from "./players.service";
import { playersKeys } from "./playersKeys";

/**
 * Global query configuration for players feature.
 * Centralizes cache timing and behavior policies.
 */
const PLAYERS_CONFIG = {
  /**
   * Data remains fresh for 5 minutes.
   * Player profiles and metadata change infrequently within a session.
   */
  staleTime: 5 * 60 * 1000,

  /**
   * Cached data garbage collected after 10 minutes of no usage.
   * Players are browsed heavily within a session (search → profile → matches),
   * so a generous gcTime avoids redundant fetches during navigation.
   */
  gcTime: 10 * 60 * 1000,
} as const;

/**
 * Query options factory for players.
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
export const playersQueries = {
  /**
   * Query options for fetching players with optional filters and pagination.
   *
   * @example
   * useQuery(playersQueries.list({ leagueId: 1, page: 1 }))
   *
   * @param filters - filter and pagination criteria; part of the cache key, so each combination caches separately
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  list: (filters?: PlayerFilters) => ({
    queryKey: playersKeys.list(filters),
    queryFn: ({ signal }: QueryFunctionContext) =>
      playersService.getAll(filters, signal),
    ...PLAYERS_CONFIG,
  }),

  /**
   * Query options for fetching match history for a specific player.
   * Uses a shorter staleTime than base config — match results update
   * throughout the week as fixtures are played, mirroring the teams feature.
   *
   * @example
   * useQuery(playersQueries.matches(123))
   *
   * @param id - the player whose matches to fetch
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  matches: (id: number) => ({
    queryKey: playersKeys.matches(id),
    queryFn: ({ signal }: QueryFunctionContext) =>
      playersService.getMatches(id, signal),
    ...PLAYERS_CONFIG,
    // Match results update regularly — refresh more aggressively than player metadata
    staleTime: 2 * 60 * 1000,
  }),

  /**
   * Query options for fetching available filter values for players.
   * Returns player numbers and team numbers scoped to an optional
   * committee or league.
   *
   * @example
   * useQuery(playersQueries.filterValues({ committeeId: 1 }))
   *
   * @param params - optional committee or league scope for the available values
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  filterValues: (params?: { committeeId?: number; leagueId?: number }) => ({
    queryKey: playersKeys.filterValues(params),
    queryFn: ({ signal }: QueryFunctionContext) =>
      playersService.getFilterValues(params, signal),
    ...PLAYERS_CONFIG,
  }),

  /**
   * Query options for the name-search autocomplete.
   * Shorter cache window than the base config — a search result set is
   * consulted once and rarely returned to, mirroring the clubs equivalent.
   *
   * @example
   * useQuery(playersQueries.search("dupont", { gender: Gender.M }))
   *
   * @param search - the search term, already debounced by the caller
   * @param filters - narrows the search to comparable players
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  search: (search: string, filters?: PlayerSearchFilters) => ({
    queryKey: playersKeys.search(search, filters),
    queryFn: ({ signal }: QueryFunctionContext) =>
      playersService.search(search, filters, signal),
    staleTime: 60 * 1000, // 1 min — search results change more than static lists
    gcTime: 2 * 60 * 1000,
  }),
} as const;
