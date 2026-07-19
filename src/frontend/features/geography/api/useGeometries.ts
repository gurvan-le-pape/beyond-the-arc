// src/frontend/features/geography/api/useGeometries.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { GeoJsonData } from "@/features/organizations/clubs/types";
import type { ApiError } from "@/shared/types";

import { geometriesPrefetch, geometriesQueries } from "./geometriesQueries";

/**
 * Hook to fetch GeoJSON boundaries for all French regions.
 * Served from a static asset — cached indefinitely, never refetched.
 *
 * @returns React Query result with regions GeoJSON
 *
 * @example
 * const { data: regionsGeoJson } = useRegionsGeoJson();
 */
export function useRegionsGeoJson() {
  return useQuery<GeoJsonData, ApiError>(geometriesQueries.regions());
}

/**
 * Hook to fetch GeoJSON boundaries for all French départements.
 * Served from a static asset — cached indefinitely, never refetched.
 *
 * @returns React Query result with départements GeoJSON
 *
 * @example
 * const { data: departmentsGeoJson } = useDepartmentsGeoJson();
 */
export function useDepartmentsGeoJson() {
  return useQuery<GeoJsonData, ApiError>(geometriesQueries.departments());
}

/**
 * Hook returning prefetch utilities for optimistic loading.
 *
 * GeoJSON files are large — prefetching before a map mounts eliminates
 * the loading flash on first render. Once fetched they are cached for
 * the entire session and never requested again.
 *
 * @returns Object with prefetch functions
 *
 * @example
 * const prefetch = useGeometriesPrefetch();
 * <MapSection onMouseEnter={() => prefetch.regions()} />
 */
export function useGeometriesPrefetch() {
  const queryClient = useQueryClient();

  return {
    regions: geometriesPrefetch.regions(queryClient),
    departments: geometriesPrefetch.departments(queryClient),
  };
}
