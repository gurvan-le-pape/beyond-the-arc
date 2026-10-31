// src/frontend/features/organizations/clubs/api/clubsQueries.ts
import type { QueryFunctionContext } from "@tanstack/react-query";

import type { ClubFilters } from "../types/ClubFilters";
import { clubsService } from "./clubs.service";
import { clubsKeys } from "./clubsKeys";

/**
 * Global query configuration for clubs feature.
 * Centralizes cache timing and behavior policies.
 */
const CLUBS_CONFIG = {
  /**
   * Data remains fresh for 5 minutes.
   * Club data changes infrequently (roster updates, address changes),
   * so a longer staleTime than matches (2 min) is appropriate.
   */
  staleTime: 5 * 60 * 1000,

  /**
   * Cached data garbage collected after 10 minutes of no usage.
   * Longer than matches (5 min) because club data is cheap to hold
   * and users navigate between clubs frequently within a session.
   */
  gcTime: 10 * 60 * 1000,
} as const;

/**
 * Cache config for the three aggregate endpoints — by-region, by-department,
 * and the full club list. They are read straight from the backend over HTTP:
 * this app declares no Route Handlers and no rewrites, so nothing sits between
 * the browser and the API to cache on the way past.
 *
 * The server-side window is set on the endpoints themselves: `clubsService`
 * passes `ServerRevalidate.REFERENCE` (24 h) for all three, and `/map` renders
 * from that — which is also why the client
 * `queryFn`s below do not run there: `useMapData` seeds every one of them with
 * `initialData` from that server fetch, and seeded data counts as fresh.
 *
 * Only `gcTime` is shared here; each query states its own `staleTime`. Note
 * that `gcTime` caps them: an inactive query is evicted after 10 minutes, and
 * the next mount refetches however long its `staleTime` said.
 */
const CLUBS_STATIC_CONFIG = {
  gcTime: CLUBS_CONFIG.gcTime,
} as const;

/**
 * Query options factory for clubs.
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
export const clubsQueries = {
  /**
   * Query options for fetching clubs with optional filters and pagination.
   *
   * @example
   * useQuery(clubsQueries.list({ committeeId: 123 }))
   *
   * @param filters - filter and pagination criteria; part of the cache key, so each combination caches separately
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  list: (filters?: ClubFilters) => ({
    queryKey: clubsKeys.list(filters),
    queryFn: ({ signal }: QueryFunctionContext) =>
      clubsService.getAll(filters, signal),
    ...CLUBS_CONFIG,
  }),

  /**
   * Query options for fetching club statistics aggregated by region.
   * `GET /clubs/stats/by-region`, 24 h `staleTime` — matching the 24 h
   * `ServerRevalidate.REFERENCE` window the server half uses for it.
   *
   * @example
   * useQuery(clubsQueries.statsByRegion())
   *
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  statsByRegion: () => ({
    queryKey: clubsKeys.statsByRegion(),
    queryFn: ({ signal }: QueryFunctionContext) =>
      clubsService.getStatsByRegion(signal),
    ...CLUBS_STATIC_CONFIG,
    staleTime: 24 * 60 * 60 * 1000,
  }),

  /**
   * Query options for fetching club statistics aggregated by département.
   * `GET /clubs/stats/by-department`, 24 h `staleTime` — the same window the
   * server half uses (`ServerRevalidate.REFERENCE`) and the same as
   * `statsByRegion`, because all three move only when the static-data refresh
   * runs.
   *
   * @example
   * useQuery(clubsQueries.statsByDepartment())
   *
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  statsByDepartment: () => ({
    queryKey: clubsKeys.statsByDepartment(),
    queryFn: ({ signal }: QueryFunctionContext) =>
      clubsService.getStatsByDepartment(undefined, signal),
    ...CLUBS_STATIC_CONFIG,
    staleTime: 24 * 60 * 60 * 1000,
  }),

  /**
   * Query options for fetching all clubs without filtering.
   * `GET /clubs/all`, 24 h `staleTime` — see `statsByDepartment` above.
   *
   * @example
   * useQuery(clubsQueries.allClubs())
   *
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  allClubs: () => ({
    queryKey: clubsKeys.allClubs(),
    queryFn: ({ signal }: QueryFunctionContext) =>
      clubsService.getAllClubs(signal),
    ...CLUBS_STATIC_CONFIG,
    staleTime: 24 * 60 * 60 * 1000,
  }),

  /**
   * Query options for the club name-search combo box.
   *
   * No `enabled` here, deliberately. Whether a search should run is a decision
   * about the *call site* — `usePlayerSearch` gates its equivalent at two
   * characters, while `ClubComboBoxFilter` wants the first twenty clubs listed
   * before the user types anything, because it is a filter dropdown rather than
   * an autocomplete. A shared options factory is the wrong place to settle
   * that: it is spread into every consumer, and a consumer reading its own
   * `useQuery` call cannot see the flag that decides whether it fetches.
   *
   * @example
   * useQuery(clubsQueries.search("monaco", { leagueId: 3 }))
   *
   * @param search - the term to match club names against
   * @param filters - optional committee or league scope
   * @returns query options to spread into `useQuery` — key, fetcher and cache policy together
   */
  search: (
    search: string,
    filters?: Pick<ClubFilters, "committeeId" | "leagueId">,
  ) => ({
    queryKey: clubsKeys.search(search, filters),
    queryFn: ({ signal }: QueryFunctionContext) =>
      clubsService.getAll({ search, ...filters, limit: 20, page: 1 }, signal),
    staleTime: 60 * 1000, // 1 min — search results change more than static lists
    gcTime: 2 * 60 * 1000,
  }),
} as const;
