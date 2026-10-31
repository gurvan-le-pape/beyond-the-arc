// src/frontend/features/geography/api/useGeometries.ts
import { useQuery } from "@tanstack/react-query";

import type { GeoJsonData } from "@/features/geography/types";
import type { ApiError } from "@/shared/types";

import { geometriesQueries } from "./geometriesQueries";

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
