// src/frontend/features/organizations/clubs/api/clubs.server.ts
import type { ClubBasic } from "@/features/organizations/clubs/types/ClubBasic";
import type { ClubDetailed } from "@/features/organizations/clubs/types/ClubDetailed";
import type { ClubStatsByRegion } from "@/features/organizations/clubs/types/ClubStatsByRegion";
import {
  buildQueryString,
  fetchApi,
} from "@/lib/services/server/server-api-client";

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
 * import { serverClubsService } from '@/lib/services/client';
 * const clubs = await serverClubsService.getAll({ leagueId: 1 });
 */
export const serverClubsService = {
  /**
   * Get all clubs with optional filters.
   *
   * @param filters - Optional filter criteria
   * @returns Array of clubs
   * @throws {AxiosError} 400 if validation fails, 404 if none found
   *
   * @example
   * const clubs = await serverClubsService.getAll({ leagueId: 1 });
   */
  async getAll(filters?: ClubFilters): Promise<ClubBasic[]> {
    const queryString = buildQueryString(filters);
    return fetchApi<ClubBasic[]>(`/clubs${queryString}`);
  },

  /**
   * Get a single club by ID.
   *
   * @param id - The club ID
   * @returns The club details
   * @throws {AxiosError} 404 if not found, 400 if invalid ID
   *
   * @example
   * const club = await serverClubsService.getById(123);
   */
  async getById(id: number): Promise<ClubDetailed> {
    return fetchApi<ClubDetailed>(`/clubs/${id}`);
  },

  /**
   * Get club statistics aggregated by region.
   *
   * @returns Statistics grouped by region
   * @throws {AxiosError} 500 if server error
   *
   * @example
   * const stats = await serverClubsService.getStatsByRegion();
   * // [{ regionId: 1, regionName: 'Bretagne', clubCount: 45 }, ...]
   */
  async getStatsByRegion(): Promise<ClubStatsByRegion[]> {
    return fetchApi<ClubStatsByRegion[]>("/clubs/stats/by-region");
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
   * const stats = await serverClubsService.getStatsByDepartment();
   *
   * @example
   * // Filter by regional league
   * const stats = await serverClubsService.getStatsByDepartment(1);
   */
  async getStatsByDepartment(
    leagueId?: number,
  ): Promise<ClubStatsByDepartment[]> {
    const queryString = buildQueryString(leagueId ? { leagueId } : undefined);
    return fetchApi<ClubStatsByDepartment[]>(
      `/clubs/stats/by-department${queryString}`,
    );
  },

  /**
   * Get ALL clubs without any filtering.
   * Used for initial map load.
   */
  async getAllClubs(): Promise<ClubBasic[]> {
    return fetchApi<ClubBasic[]>("/clubs/all");
  },

  /**
   * Get ALL departments without filtering.
   * Used for initial map load.
   */
  async getAllDepartments(): Promise<ClubStatsByDepartment[]> {
    return fetchApi<ClubStatsByDepartment[]>("/clubs/departments");
  },
};
