// src/frontend/features/competitions/pools/api/pools.server.ts
import {
  buildQueryString,
  fetchApi,
} from "../../../../lib/services/server/server-api-client";
import type { Pool } from "../types/Pool";

/**
 * Service for interacting with the pools (groups/pools) API.
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
 * import { serverPoolsService } from '@/lib/services/client';
 * const pools = await serverPoolsService.getByChampionshipId(1);
 */
export const serverPoolsService = {
  /**
   * Get all pools for a specific championship.
   * Pools are the groups/pools within a championship.
   *
   * @param championshipId - The championship ID
   * @returns Array of pools in the championship
   * @throws {AxiosError} 400 if validation fails, 404 if none found
   *
   * @example
   * const pools = await serverPoolsService.getByChampionshipId(5);
   * // [{ id: 1, name: 'Pool A', ... }, { id: 2, name: 'Pool B', ... }]
   */
  async getByChampionshipId(championshipId: number): Promise<Pool[]> {
    const queryString = buildQueryString({ championshipId });
    return fetchApi<Pool[]>(`/pools${queryString}`);
  },
};
