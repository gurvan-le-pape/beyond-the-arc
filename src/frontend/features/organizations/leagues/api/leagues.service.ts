// src/frontend/features/organizations/leagues/api/leagues.service.ts
import apiClient from "../../../../lib/services/client/api-client";
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
 * import { leaguesService } from '@/lib/services/client';
 * const leagues = await leaguesService.getAll();
 */
export const leaguesService = {
  /**
   * Get all regional leagues.
   *
   * @returns Array of all leagues
   * @throws {AxiosError} 500 if server error
   *
   * @example
   * const leagues = await leaguesService.getAll();
   */
  async getAll(): Promise<League[]> {
    const { data } = await apiClient.get<League[]>("/leagues");
    return data;
  },

  /**
   * Get a single league by ID.
   *
   * @param id - The league ID
   * @returns The league details
   * @throws {AxiosError} 404 if not found, 400 if invalid ID
   *
   * @example
   * const league = await leaguesService.getById(1);
   */
  async getById(id: number): Promise<League> {
    const { data } = await apiClient.get<League>(`/leagues/${id}`);
    return data;
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
   * const leagues = await leaguesService.getByIds([1, 2, 3]);
   */
  async getByIds(ids: number[]): Promise<League[]> {
    const { data } = await apiClient.get<League[]>(`/leagues/${ids.join(",")}`);
    return data;
  },
};
