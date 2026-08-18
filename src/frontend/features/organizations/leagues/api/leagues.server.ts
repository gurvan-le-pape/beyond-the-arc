// src/frontend/features/organizations/leagues/api/leagues.server.ts

// Kept out of the `api/` barrel by `barrelsby.json`, and poisoned for the client
// graph here: importing this from a client module is a build error, not a leak.
import "server-only";

import {
  fetchApi,
  ServerRevalidate,
} from "../../../../lib/services/server/server-api-client";
import type { League } from "../types/League";

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
 * import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
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
    return fetchApi<League[]>("/leagues", {
      revalidate: ServerRevalidate.REFERENCE,
    });
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
    return fetchApi<League>(`/leagues/${id}`, {
      revalidate: ServerRevalidate.REFERENCE,
    });
  },

  /**
   * Get multiple leagues by their IDs.
   * Efficient bulk fetch for multiple leagues.
   *
   * @param ids - Array of league IDs
   * @returns Array of leagues
   * @throws {AxiosError} 400 if validation fails
   *
   * @example
   * const leagues = await serverLeaguesService.getByIds(["1", "2", "3"]);
   */
  async getByIds(ids: number[]): Promise<League[]> {
    return fetchApi<League[]>(`/leagues/${ids.join(",")}`, {
      revalidate: ServerRevalidate.REFERENCE,
    });
  },
};
