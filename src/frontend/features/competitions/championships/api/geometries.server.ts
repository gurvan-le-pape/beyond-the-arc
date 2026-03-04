// src/frontend/features/competitions/championships/api/geometries.server.ts
import { fetchApi } from "../../../../lib/services/server/server-api-client";

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
 * import { serverGeometriesService } from '@/lib/services/client';
 * const regionsGeoJson = await serverGeometriesService.getRegionsGeoJson();
 */
export const serverGeometriesService = {
  /**
   * Get GeoJSON data for all French regions.
   * Returns a GeoJSON FeatureCollection suitable for map rendering.
   *
   * @returns GeoJSON FeatureCollection of regions
   * @throws {AxiosError} 500 if server error
   *
   * @example
   * const geoJson = await serverGeometriesService.getRegionsGeoJson();
   * // Use with Leaflet: L.geoJSON(geoJson).addTo(map);
   */
  async getRegionsGeoJson(): Promise<any> {
    return fetchApi<any>("/geo/regions");
  },

  /**
   * Get GeoJSON data for all French départements.
   * Returns a GeoJSON FeatureCollection suitable for map rendering.
   *
   * @returns GeoJSON FeatureCollection of départements
   * @throws {AxiosError} 500 if server error
   *
   * @example
   * const geoJson = await serverGeometriesService.getDepartmentsGeoJson();
   * // Use with Leaflet: L.geoJSON(geoJson).addTo(map);
   */
  async getDepartmentsGeoJson(): Promise<any> {
    return fetchApi<any>("/geo/departments");
  },
};
