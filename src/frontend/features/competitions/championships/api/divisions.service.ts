// src/frontend/features/competitions/championships/api/divisions.service.ts
import apiClient from "../../../../lib/services/client/api-client";
import type { Division } from "../types/Division";

/**
 * Service for interacting with the divisions API.
 *
 * Architecture:
 * - Uses apiClient (axios) for HTTP requests
 * - Backend responses are unwrapped by axios interceptor
 * - Services work directly with typed data
 * - Errors are handled globally by interceptor
 *
 * Usage:
 * - Import this service in React Query hooks
 * - Never call directly from components
 *
 * Note: This service is a simple wrapper around championships/divisions.
 * Consider using championshipService.getDivisions() directly instead.
 *
 * @example
 * import { divisionsService } from '@/lib/services/client';
 * const divisions = await divisionsService.getAll();
 */
export const divisionsService = {
  /**
   * Get all available championship divisions.
   * Results are cached on the server for 10 minutes.
   *
   * @returns Array of all distinct divisions
   * @throws {AxiosError} 500 if server error
   *
   * @example
   * const divisions = await divisionsService.getAll();
   * // [{ id: 1, name: 'Nationale 1' }, { id: 2, name: 'Régionale 1' }]
   */
  async getAll(): Promise<Division[]> {
    const { data } = await apiClient.get<Division[]>(
      "/championships/divisions",
    );
    return data;
  },
};
