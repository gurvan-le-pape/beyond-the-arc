// src/frontend/features/organizations/clubs/api/clubs.service.ts
import type { ClubStatsByRegion } from "@/features/organizations/clubs/types";
import apiClient from "@/lib/services/client/api-client";

import type { ClubBasic } from "../types/ClubBasic";
import type { ClubDetailed } from "../types/ClubDetailed";
import type { ClubFilters } from "../types/ClubFilters";
import type { ClubsPaginatedResponse } from "../types/ClubsPaginatedResponse";
import type { ClubStatsByDepartment } from "../types/ClubStatsByDepartment";

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
 * import { clubsService } from "@/features/organizations/clubs/api";
 * const clubs = await clubsService.getAll({ leagueId: 1 });
 */
export const clubsService = {
  /**
   * Get all clubs with optional filters.
   *
   * @param filters - Optional filter criteria
   * @returns Array of clubs
   * @throws {AxiosError} 400 if validation fails
   *
   * @example
   * const clubs = await clubsService.getAll({ leagueId: 1 });
   *
   * @param signal - TanStack Query's `queryFn` signal; without it a superseded request runs to completion
   */
  async getAll(
    filters?: ClubFilters,
    signal?: AbortSignal,
  ): Promise<ClubsPaginatedResponse> {
    const { data } = await apiClient.get<ClubsPaginatedResponse>("/clubs", {
      params: filters,
      signal,
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
   *
   * @param signal - TanStack Query's `queryFn` signal; without it a superseded request runs to completion
   */
  async getById(id: number, signal?: AbortSignal): Promise<ClubDetailed> {
    const { data } = await apiClient.get<ClubDetailed>(`/clubs/${id}`, {
      signal,
    });
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
   *
   * @param signal - TanStack Query's `queryFn` signal; without it a superseded request runs to completion
   */
  async getStatsByRegion(signal?: AbortSignal): Promise<ClubStatsByRegion[]> {
    const { data } = await apiClient.get<ClubStatsByRegion[]>(
      "/clubs/stats/by-region",
      { signal },
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
   *
   * @param signal - TanStack Query's `queryFn` signal; without it a superseded request runs to completion
   */
  async getStatsByDepartment(
    leagueId?: number,
    signal?: AbortSignal,
  ): Promise<ClubStatsByDepartment[]> {
    const { data } = await apiClient.get<ClubStatsByDepartment[]>(
      "/clubs/stats/by-department",
      {
        params: leagueId ? { leagueId } : undefined,
        signal,
      },
    );
    return data;
  },

  /**
   * Get all clubs without any filtering.
   * Used for map initial load, typeaheads, and autocomplete widgets.
   *
   * @returns Array of all clubs
   * @throws {AxiosError} 500 if server error
   *
   * @example
   * const clubs = await clubsService.getAllClubs();
   *
   * @param signal - TanStack Query's `queryFn` signal; without it a superseded request runs to completion
   */
  async getAllClubs(signal?: AbortSignal): Promise<ClubBasic[]> {
    const { data } = await apiClient.get<ClubBasic[]>("/clubs/all", { signal });
    return data;
  },
};
