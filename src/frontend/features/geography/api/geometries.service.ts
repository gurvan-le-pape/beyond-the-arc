// src/frontend/features/geography/api/geometries.service.ts
import apiClient from "../../../lib/services/client/api-client";

/**
 * Service for interacting with the geography/geometry API.
 * Returns GeoJSON data for rendering maps.
 *
 * Architecture:
 * - Uses apiClient (axios) for HTTP requests
 * - Backend responses are unwrapped by axios interceptor
 * - Returns GeoJSON FeatureCollection objects
 * - Errors are handled globally by interceptor
 *
 * Usage:
 * - Import this service in React Query hooks
 * - Never call directly from components
 * - Use with mapping libraries (Leaflet, Mapbox, etc.)
 *
 * @example
 * import { geometriesService } from '@/lib/services/client';
 * const regionsGeoJson = await geometriesService.getRegionsGeoJson();
 */
export const geometriesService = {
  /**
   * Get GeoJSON data for all French regions.
   * Returns a GeoJSON FeatureCollection suitable for map rendering.
   *
   * @returns GeoJSON FeatureCollection of regions
   * @throws {AxiosError} 500 if server error
   *
   * @example
   * const geoJson = await geometriesService.getRegionsGeoJson();
   * // Use with Leaflet: L.geoJSON(geoJson).addTo(map);
   */
  async getRegionsGeoJson(): Promise<any> {
    const { data } = await apiClient.get<any>("/geo/regions");
    return data;
  },

  /**
   * Get GeoJSON data for all French départements.
   * Returns a GeoJSON FeatureCollection suitable for map rendering.
   *
   * @returns GeoJSON FeatureCollection of départements
   * @throws {AxiosError} 500 if server error
   *
   * @example
   * const geoJson = await geometriesService.getDepartmentsGeoJson();
   * // Use with Leaflet: L.geoJSON(geoJson).addTo(map);
   */
  async getDepartmentsGeoJson(): Promise<any> {
    const { data } = await apiClient.get<any>("/geo/departments");
    return data;
  },
};
