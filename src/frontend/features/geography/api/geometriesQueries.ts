// src/frontend/features/geography/api/geometriesQueries.ts
import type { QueryClient, QueryFunctionContext } from "@tanstack/react-query";

import type { GeoJsonData } from "@/features/organizations/clubs/types";
import { safeFetch } from "@/shared/utils";

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
/**
 * Metropolitan France, with generous margins. Corsica reaches ~9.6°E and
 * Dunkerque ~51.1°N; the box below clears both.
 */
const FRANCE_LNG_RANGE = [-5.5, 10] as const;
const FRANCE_LAT_RANGE = [41, 51.5] as const;

/**
 * Assert that a GeoJSON asset is in `[lng, lat]` order, and reject it if not.
 *
 * `GeoJsonData` types `coordinates` as `any`, so nothing else in the app can
 * tell a correct file from a transposed one — and the two static assets carry
 * **255,709 coordinate pairs** between them (75,961 in regions, 179,748 in
 * departments), consumed raw by `@turf/centroid`. A transposed file does not
 * throw anywhere; it draws France somewhere off the coast of Somalia.
 *
 * The check is one coordinate pair, not all 255,709, and that is deliberate:
 * the realistic failure is a whole file re-exported in the wrong order, not
 * one corrupt vertex, and an O(n) walk over 8.7 MB on every load would cost
 * more than it catches.
 *
 * The bounding box is what makes the single sample decisive. In `[lng, lat]`
 * a French coordinate is roughly `[2.6, 49.1]`; transposed it becomes
 * `[49.1, 2.6]`, and 49.1 is far outside the longitude range France occupies.
 * The two ranges do not overlap, so the order is recoverable from one point.
 */
function assertLngLatOrder(data: GeoJsonData, source: string): GeoJsonData {
  const feature = data.features?.[0];
  if (!feature) return data;

  // Walk into the first ring of whatever geometry this is — Polygon nests one
  // level deeper than LineString, MultiPolygon one deeper still.
  let node: unknown = feature.geometry?.coordinates;
  while (Array.isArray(node) && Array.isArray(node[0])) node = node[0];

  if (!Array.isArray(node) || node.length < 2) return data;
  const [lng, lat] = node as number[];

  const inLng = lng >= FRANCE_LNG_RANGE[0] && lng <= FRANCE_LNG_RANGE[1];
  const inLat = lat >= FRANCE_LAT_RANGE[0] && lat <= FRANCE_LAT_RANGE[1];

  if (!inLng || !inLat) {
    throw new Error(
      `${source}: first coordinate [${lng}, ${lat}] is outside metropolitan France. ` +
        `GeoJSON is [lng, lat] — a transposed file lands here.`,
    );
  }

  return data;
}

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
    queryFn: ({ signal }: QueryFunctionContext) =>
      safeFetch<GeoJsonData>("/geojson/regions.json", signal).then((d) =>
        assertLngLatOrder(d, "regions.json"),
      ),
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
    queryFn: ({ signal }: QueryFunctionContext) =>
      safeFetch<GeoJsonData>("/geojson/departments.json", signal).then((d) =>
        assertLngLatOrder(d, "departments.json"),
      ),
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
