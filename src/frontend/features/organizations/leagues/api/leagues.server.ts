// src/frontend/features/organizations/leagues/api/leagues.server.ts
import { fetchApi } from "../../../../lib/services/server/server-api-client";
import type { League } from "../types/Ligue";

/**
 * Service for interacting with the leagues (regional leagues) API.
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
 * @example
 * import { serverLeaguesService } from '@/lib/services/client';
 * const leagues = await serverLeaguesService.getAll();
 */
export const serverLeaguesService = {
  /**
   * Get all regional leagues.
   *
   * @returns Array of all leagues
   * @throws {AxiosError} 500 if server error
   *
   * @example
   * const leagues = await serverLeaguesService.getAll();
   */
  async getAll(): Promise<League[]> {
    return fetchApi<League[]>("/leagues");
  },

  /**
   * Get a single league by ID.
   *
   * @param id - The league ID
   * @returns The league details
   * @throws {AxiosError} 404 if not found, 400 if invalid ID
   *
   * @example
   * const league = await serverLeaguesService.getById("1");
   */
  async getById(id: number): Promise<League> {
    return fetchApi<League>(`/leagues/${id}`);
  },

  /**
   * Get multiple leagues by their IDs.
   * Efficient bulk fetch for multiple leagues.
   *
   * @param ids - Array of league IDs
   * @returns Array of leagues
   * @throws {AxiosError} 400 if validation fails, 404 if none found
   *
   * @example
   * const leagues = await serverLeaguesService.getByIds(["1", "2", "3"]);
   */
  async getByIds(ids: number[]): Promise<League[]> {
    return fetchApi<League[]>(`/leagues/${ids.join(",")}`);
  },
};
