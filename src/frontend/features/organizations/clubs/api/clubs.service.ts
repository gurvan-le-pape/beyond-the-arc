// src/frontend/features/organizations/clubs/api/clubs.service.ts
import type { ClubStatsByRegion } from "@/features/organizations/clubs/types/ClubStatsByRegion";
import apiClient from "@/lib/services/client/api-client";

import type { ClubBasic } from "../types/ClubBasic";
import type { ClubDetailed } from "../types/ClubDetailed";
import type { ClubFilters } from "../types/ClubFilters";
import type { ClubStatsByDepartment } from "../types/ClubStatsByDepartement";

/**
 * Service for interacting with the clubs API.
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
 * import { clubsService } from '@/lib/services/client';
 * const clubs = await clubsService.getAll({ leagueId: 1 });
 */
export const clubsService = {
  /**
   * Get all clubs with optional filters.
   *
   * @param filters - Optional filter criteria
   * @returns Array of clubs
   * @throws {AxiosError} 400 if validation fails, 404 if none found
   *
   * @example
   * const clubs = await clubsService.getAll({ leagueId: 1 });
   */
  async getAll(filters?: ClubFilters): Promise<ClubBasic[]> {
    const { data } = await apiClient.get<ClubBasic[]>("/clubs", {
      params: filters,
    });
    return data;
  },

  /**
   * Get a single club by ID.
   *
   * @param id - The club ID
   * @returns The club details
   * @throws {AxiosError} 404 if not found, 400 if invalid ID
   *
   * @example
   * const club = await clubsService.getById(123);
   */
  async getById(id: number): Promise<ClubDetailed> {
    const { data } = await apiClient.get<ClubDetailed>(`/clubs/${id}`);
    return data;
  },

  /**
   * Get club statistics aggregated by region.
   *
   * @returns Statistics grouped by region
   * @throws {AxiosError} 500 if server error
   *
   * @example
   * const stats = await clubsService.getStatsByRegion();
   * // [{ regionId: 1, regionName: 'Bretagne', clubCount: 45 }, ...]
   */
  async getStatsByRegion(): Promise<ClubStatsByRegion[]> {
    const { data } = await apiClient.get<ClubStatsByRegion[]>(
      "/clubs/stats/by-region",
    );
    return data;
  },

  /**
   * Get club statistics aggregated by département.
   * Optionally filter by a specific regional league.
   *
   * @param leagueId - Optional regional league ID to filter by
   * @returns Statistics grouped by département
   * @throws {AxiosError} 500 if server error
   *
   * @example
   * // All départements
   * const stats = await clubsService.getStatsByDepartment();
   *
   * @example
   * // Filter by regional league
   * const stats = await clubsService.getStatsByDepartment(1);
   */
  async getStatsByDepartment(
    leagueId?: number,
  ): Promise<ClubStatsByDepartment[]> {
    const { data } = await apiClient.get<ClubStatsByDepartment[]>(
      "/clubs/stats/by-department",
      {
        params: leagueId ? { leagueId } : undefined,
      },
    );
    return data;
  },
};
