// src/frontend/features/teams/api/teams.service.ts
import apiClient from "../../../lib/services/client/api-client";
import type { Team } from "../types/Team";
import type { TeamFilters } from "../types/TeamFilters";
import type { TeamFilterValues } from "../types/TeamFilterValues";
import type { TeamsPaginatedResponse } from "../types/TeamsPaginatedResponse";

/**
 * Service for interacting with the teams API.
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
 * import { teamsService } from '@/lib/services/client';
 * const teams = await teamsService.getAll({ clubId: 1 });
 */
export const teamsService = {
  /**
   * Get all teams with optional filters.
   *
   * @param filters - Optional filter criteria (clubId, championshipId, etc.)
   * @returns Paginated or filtered team data
   * @throws {AxiosError} 400 if validation fails
   *
   * @example
   * const teams = await teamsService.getAll({ clubId: 1 });
   *
   * @example
   * const teams = await teamsService.getAll({ championshipId: 5 });
   */
  async getAll(filters?: TeamFilters): Promise<TeamsPaginatedResponse> {
    const { data } = await apiClient.get<TeamsPaginatedResponse>("/teams", {
      params: filters,
    });
    return data;
  },

  /**
   * Get detailed information for a single team.
   *
   * @param teamId - The team ID
   * @returns Detailed team information
   * @throws {AxiosError} 404 if not found, 400 if invalid ID
   *
   * @example
   * const team = await teamsService.getById(123);
   */
  async getById(teamId: number): Promise<Team> {
    const { data } = await apiClient.get<Team>(`/teams/${teamId}`);
    return data;
  },

  /**
   * Get all matches for a specific team.
   *
   * @param teamId - The team ID
   * @returns Array of matches involving the team
   * @throws {AxiosError} 404 if team not found
   *
   * @example
   * const matches = await teamsService.getMatches(123);
   */
  async getMatches(teamId: number): Promise<any> {
    const { data } = await apiClient.get<any>(`/teams/${teamId}/matches`);
    return data;
  },

  /**
   * Get available filter values for teams (numbers, pool letters, divisions).
   *
   * @returns Filter values for teams
   * @example
   * const filterValues = await teamsService.getFilterValues();
   */
  async getFilterValues(params?: {
    committeeId?: number;
    leagueId?: number;
  }): Promise<TeamFilterValues> {
    const { data } = await apiClient.get<TeamFilterValues>(
      "/teams/filter-values",
      { params },
    );
    return data;
  },
};
