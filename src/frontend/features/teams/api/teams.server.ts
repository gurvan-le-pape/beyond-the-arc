// src/frontend/features/teams/api/teams.server.ts
import {
  buildQueryString,
  fetchApi,
} from "../../../lib/services/server/server-api-client";
import type { TeamDetail } from "../types/TeamDetail";
import type { TeamFilters } from "../types/TeamFilters";
import type { TeamMatchHistory } from "../types/TeamMatchHistory";
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
 * import { serverTeamsService } from '@/lib/services/client';
 * const teams = await serverTeamsService.getAll({ clubId: 1 });
 */
export const serverTeamsService = {
  /**
   * Get all teams with optional filters.
   *
   * @param filters - Optional filter criteria (clubId, championshipId, etc.)
   * @returns Paginated or filtered team data
   * @throws {AxiosError} 400 if validation fails
   *
   * @example
   * const teams = await serverTeamsService.getAll({ clubId: 1 });
   *
   * @example
   * const teams = await serverTeamsService.getAll({ championshipId: 5 });
   */
  async getAll(filters?: TeamFilters): Promise<TeamsPaginatedResponse> {
    const queryString = buildQueryString(filters);
    return fetchApi<any>(`/teams${queryString}`);
  },

  /**
   * Get detailed information for a single team.
   *
   * @param teamId - The team ID
   * @returns Detailed team information
   * @throws {AxiosError} 404 if not found, 400 if invalid ID
   *
   * @example
   * const team = await serverTeamsService.getById(123);
   */
  async getById(teamId: number): Promise<TeamDetail> {
    return fetchApi<any>(`/teams/${teamId}`);
  },

  /**
   * Get all matches for a specific team.
   *
   * @param teamId - The team ID
   * @returns Array of matches involving the team
   * @throws {AxiosError} 404 if team not found
   *
   * @example
   * const matches = await serverTeamsService.getMatches(123);
   */
  async getMatches(teamId: number): Promise<TeamMatchHistory[]> {
    return fetchApi<any>(`/teams/${teamId}/matches`);
  },
};
