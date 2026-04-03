// src/frontend/features/organizations/clubs/api/clubsQueries.ts
import type { QueryClient } from "@tanstack/react-query";

import { safeFetch } from "@/shared/utils/safeFetch";

import type { ClubFilters } from "../types/ClubFilters";
import type { ClubStatsByRegion } from "../types/ClubStatsByRegion";
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
 * Extended cache config for static/aggregated data that is served
 * through Next.js API routes with their own server-side TTL.
 *
 * These endpoints cache at the server level (24h for regions, 1h for
 * departments/all), so client staleTime mirrors server TTL to avoid
 * redundant revalidations within the same window.
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
   */
  list: (filters?: ClubFilters) => ({
    queryKey: clubsKeys.list(filters),
    queryFn: () => clubsService.getAll(filters),
    ...CLUBS_CONFIG,
  }),

  /**
   * Query options for fetching detailed information for a single club.
   *
   * @example
   * useQuery(clubsQueries.detail(123))
   */
  detail: (id: number) => ({
    queryKey: clubsKeys.detail(id),
    queryFn: () => clubsService.getById(id),
    ...CLUBS_CONFIG,
  }),

  /**
   * Query options for fetching club statistics aggregated by region.
   * Hits the Next.js API route which caches at the server for 24 hours.
   * Client staleTime mirrors server TTL — no point revalidating sooner.
   *
   * @example
   * useQuery(clubsQueries.statsByRegion())
   */
  statsByRegion: () => ({
    queryKey: clubsKeys.statsByRegion(),
    queryFn: () => safeFetch<ClubStatsByRegion[]>("/api/clubs/regions"),
    ...CLUBS_STATIC_CONFIG,
    // Server caches for 24h — align client to avoid redundant network hits
    staleTime: 24 * 60 * 60 * 1000,
  }),

  /**
   * Query options for fetching club statistics aggregated by département.
   * Hits the Next.js API route which caches at the server for 1 hour.
   *
   * @example
   * useQuery(clubsQueries.statsByDepartment())
   */
  statsByDepartment: () => ({
    queryKey: clubsKeys.statsByDepartment(),
    queryFn: () =>
      safeFetch<
        import("../types/ClubStatsByDepartement").ClubStatsByDepartment[]
      >("/api/clubs/departments"),
    ...CLUBS_STATIC_CONFIG,
    // Server caches for 1h — align client staleTime accordingly
    staleTime: 60 * 60 * 1000,
  }),

  /**
   * Query options for fetching all clubs without filtering.
   * Hits the Next.js API route which caches at the server for 1 hour.
   * Used for typeaheads, selects, and autocomplete where a full list is needed.
   *
   * @example
   * useQuery(clubsQueries.allClubs())
   */
  allClubs: () => ({
    queryKey: clubsKeys.allClubs(),
    queryFn: () =>
      safeFetch<import("../types/ClubBasic").ClubBasic[]>("/api/clubs/all"),
    ...CLUBS_STATIC_CONFIG,
    // Server caches for 1h — align client staleTime accordingly
    staleTime: 60 * 60 * 1000,
  }),
} as const;

/**
 * Prefetch utilities for optimistic data loading.
 * Call these on hover/route changes to warm the cache.
 */
export const clubsPrefetch = {
  /**
   * Prefetch club detail (e.g., on list-item hover or link hover).
   *
   * @example
   * const prefetch = clubsPrefetch.detail(queryClient);
   * <tr onMouseEnter={() => prefetch(club.id)} />
   */
  detail: (queryClient: QueryClient) => (clubId: number) => {
    queryClient.prefetchQuery(clubsQueries.detail(clubId)).catch(() => {
      // Silently fail - prefetch is opportunistic
    });
  },

  /**
   * Prefetch clubs list with given filters (e.g., on tab/panel hover).
   *
   * @example
   * const prefetch = clubsPrefetch.list(queryClient);
   * <Tab onMouseEnter={() => prefetch({ committeeId: 5 })} />
   */
  list: (queryClient: QueryClient) => (filters?: ClubFilters) => {
    queryClient.prefetchQuery(clubsQueries.list(filters)).catch(() => {});
  },

  /**
   * Prefetch region stats (e.g., on map section hover).
   *
   * @example
   * const prefetch = clubsPrefetch.statsByRegion(queryClient);
   * <MapSection onMouseEnter={() => prefetch()} />
   */
  statsByRegion: (queryClient: QueryClient) => () => {
    queryClient.prefetchQuery(clubsQueries.statsByRegion()).catch(() => {});
  },

  /**
   * Prefetch department stats (e.g., on drill-down navigation).
   */
  statsByDepartment: (queryClient: QueryClient) => () => {
    queryClient.prefetchQuery(clubsQueries.statsByDepartment()).catch(() => {});
  },

  /**
   * Prefetch all clubs list (e.g., before a select/autocomplete mounts).
   */
  allClubs: (queryClient: QueryClient) => () => {
    queryClient.prefetchQuery(clubsQueries.allClubs()).catch(() => {});
  },
} as const;
