// src/frontend/features/competitions/pools/api/pools.service.ts
import apiClient from "../../../../lib/services/client/api-client";
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
 * import { poolsService } from '@/lib/services/client';
 * const pools = await poolsService.getByChampionshipId(1);
 */
export const poolsService = {
  /**
   * Get all pools for a specific championship.
   * Pools are the groups/pools within a championship.
   *
   * @param championshipId - The championship ID
   * @returns Array of pools in the championship
   * @throws {AxiosError} 400 if validation fails, 404 if none found
   *
   * @example
   * const pools = await poolsService.getByChampionshipId(5);
   * // [{ id: 1, name: 'Pool A', ... }, { id: 2, name: 'Pool B', ... }]
   */
  async getByChampionshipId(championshipId: number): Promise<Pool[]> {
    const { data } = await apiClient.get<Pool[]>("/pools", {
      params: { championshipId },
    });
    return data;
  },
};
