// src/frontend/features/geography/api/use-geometries.ts
import { useQuery } from "@tanstack/react-query";

import type { GeoJsonData } from "@/features/organizations/clubs/types/Map";
import type { ApiError } from "@/shared/types/Api";
import { safeFetch } from "@/shared/utils/safeFetch";

import { geometriesKeys } from "./geometriesKeys";

/**
 * Hook to fetch GeoJSON boundaries for all French regions.
 * Data is static and never changes — cached indefinitely.
 *
 * @returns React Query result with regions GeoJSON
 *
 * @example
 * const { data: regionsGeoJson } = useRegionsGeoJson();
 */
export function useRegionsGeoJson() {
  return useQuery<GeoJsonData, ApiError>({
    queryKey: geometriesKeys.regions(),
    queryFn: () => safeFetch<GeoJsonData>("/geojson/regions.json"),
    staleTime: Infinity,
  });
}

/**
 * Hook to fetch GeoJSON boundaries for all French departements.
 * Data is static and never changes — cached indefinitely.
 *
 * @returns React Query result with départements GeoJSON
 *
 * @example
 * const { data: departmentsGeoJson } = useDepartmentsGeoJson();
 */
export function useDepartmentsGeoJson() {
  return useQuery<GeoJsonData, ApiError>({
    queryKey: geometriesKeys.departments(),
    queryFn: () => safeFetch<GeoJsonData>("/geojson/departments.json"),
    staleTime: Infinity,
  });
}
