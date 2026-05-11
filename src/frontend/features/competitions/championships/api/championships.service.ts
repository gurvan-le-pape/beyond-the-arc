// src/frontend/features/competitions/championships/api/championships.service.ts
import type { Championship } from "@/features/competitions/championships/types/Championship";
import type { ChampionshipFilters } from "@/features/competitions/championships/types/ChampionshipFilters";

import apiClient from "../../../../lib/services/client/api-client";

/**
 * Service for interacting with the championships API.
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
 * import { championshipService } from '@/lib/services/client';
 * const championships = await championshipService.getAll({ level: 'regional', id: '1' });
 */
export const championshipService = {
  /**
   * Get championships filtered by competition level and associated ID.
   *
   * @param filters - Filter criteria (both level and id are required)
   * @returns Array of championships matching the criteria
   * @throws {AxiosError} 400 if validation fails, 404 if none found
   *
   * @example
   * const championships = await championshipService.getAll({
   *   level: CompetitionLevel.REGIONAL,
   *   id: '1',
   * });
   */
  async getAll(filters?: ChampionshipFilters): Promise<Championship[]> {
    const { data } = await apiClient.get<Championship[]>("/championships", {
      params: {
        level: filters?.level,
        id: filters?.id,
      },
    });
    return data;
  },

  /**
   * Get a single championship by its ID.
   *
   * @param id - The championship ID
   * @returns The championship details
   * @throws {AxiosError} 404 if not found, 400 if invalid ID
   *
   * @example
   * const championship = await championshipService.getById('123');
   */
  async getById(id: number): Promise<Championship> {
    const { data } = await apiClient.get<Championship>(`/championships/${id}`);
    return data;
  },
};
