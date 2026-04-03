// src/frontend/features/geography/api/geometriesQueries.ts
import type { QueryClient } from "@tanstack/react-query";

import type { GeoJsonData } from "@/features/organizations/clubs/types/Map";
import { safeFetch } from "@/shared/utils/safeFetch";

import { geometriesKeys } from "./geometriesKeys";

/**
 * Global query configuration for geometries feature.
 *
 * GeoJSON boundary files are static assets bundled with the app —
 * French administrative boundaries do not change. Both staleTime and
 * gcTime are set to Infinity: never refetch, never evict from cache.
 * Once loaded they should live for the entire session.
 */
const GEOMETRIES_CONFIG = {
  staleTime: Infinity,
  gcTime: Infinity,
} as const;

/**
 * Query options factory for geometries.
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
export const geometriesQueries = {
  /**
   * Query options for fetching GeoJSON boundaries for all French regions.
   * Served from a static asset — never stale, never evicted.
   *
   * @example
   * useQuery(geometriesQueries.regions())
   */
  regions: () => ({
    queryKey: geometriesKeys.regions(),
    queryFn: () => safeFetch<GeoJsonData>("/geojson/regions.json"),
    ...GEOMETRIES_CONFIG,
  }),

  /**
   * Query options for fetching GeoJSON boundaries for all French départements.
   * Served from a static asset — never stale, never evicted.
   *
   * @example
   * useQuery(geometriesQueries.departments())
   */
  departments: () => ({
    queryKey: geometriesKeys.departments(),
    queryFn: () => safeFetch<GeoJsonData>("/geojson/departments.json"),
    ...GEOMETRIES_CONFIG,
  }),
} as const;

/**
 * Prefetch utilities for optimistic data loading.
 * GeoJSON files are large — prefetching before the map mounts
 * eliminates the loading flash on first render.
 */
export const geometriesPrefetch = {
  /**
   * Prefetch regions GeoJSON (e.g., before a map component mounts).
   *
   * @example
   * const prefetch = geometriesPrefetch.regions(queryClient);
   * <MapSection onMouseEnter={() => prefetch()} />
   */
  regions: (queryClient: QueryClient) => () => {
    queryClient.prefetchQuery(geometriesQueries.regions()).catch(() => {
      // Silently fail - prefetch is opportunistic
    });
  },

  /**
   * Prefetch départements GeoJSON (e.g., on drill-down navigation to department map).
   *
   * @example
   * const prefetch = geometriesPrefetch.departments(queryClient);
   * <RegionCard onMouseEnter={() => prefetch()} />
   */
  departments: (queryClient: QueryClient) => () => {
    queryClient.prefetchQuery(geometriesQueries.departments()).catch(() => {});
  },
} as const;
