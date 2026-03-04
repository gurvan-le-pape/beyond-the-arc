// src/frontend/features/matches/api/matches.server.ts
import {
  buildQueryString,
  fetchApi,
} from "../../../lib/services/server/server-api-client";
import type { Match } from "../types/Match";
import type { MatchDetail } from "../types/MatchDetail";
import type { MatchesPaginatedResponse } from "../types/MatchesPaginatedResponse";
import type { MatchEvent } from "../types/MatchEvent";
import type { MatchFilters } from "../types/MatchFilters";
import type { MatchPlayerStatsResponse } from "../types/MatchPlayerStats";

/**
 * Service for interacting with the matches API.
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
 * import { serverMatchesService } from '@/lib/services/client';
 * const matches = await serverMatchesService.getAll({ championshipId: 1 });
 */
export const serverMatchesService = {
  /**
   * Get all matches with optional filters and pagination.
   *
   * @param filters - Optional filter criteria (championshipId, poolId, page, limit, etc.)
   * @returns Paginated response with matches
   * @throws {AxiosError} 400 if validation fails
   *
   * @example
   * const response = await serverMatchesService.getAll({
   *   championshipId: 1,
   *   page: 1,
   *   limit: 20,
   * });
   */
  async getAll(filters?: MatchFilters): Promise<MatchesPaginatedResponse> {
    const queryString = buildQueryString(filters);
    return fetchApi<MatchesPaginatedResponse>(`/matches${queryString}`);
  },

  /**
   * Get detailed information for a single match.
   *
   * @param id - The match ID
   * @returns Detailed match information including teams, scores, and events
   * @throws {AxiosError} 404 if not found, 400 if invalid ID
   *
   * @example
   * const match = await serverMatchesService.getById(12345);
   */
  async getById(id: number): Promise<MatchDetail> {
    return fetchApi<MatchDetail>(`/matches/${id}`);
  },

  /**
   * Get all matches for a specific pool.
   *
   * @param poolId - The pool ID
   * @returns Array of matches in the pool
   * @throws {AxiosError} 400 if validation fails, 404 if none found
   *
   * @example
   * const matches = await serverMatchesService.getByPoolId(10);
   */
  async getByPoolId(poolId: number): Promise<Match[]> {
    const queryString = buildQueryString({ poolId });
    return fetchApi<Match[]>(`/matches${queryString}`);
  },

  /**
   * Get all matches for a specific championship.
   *
   * @param championshipId - The championship ID
   * @returns Array of matches in the championship
   * @throws {AxiosError} 400 if validation fails, 404 if none found
   *
   * @example
   * const matches = await serverMatchesService.getByChampionshipId(5);
   */
  async getByChampionshipId(championshipId: number): Promise<Match[]> {
    const queryString = buildQueryString({ championshipId });
    return fetchApi<Match[]>(`/matches${queryString}`);
  },

  // ============================================================================
  // Match Events
  // ============================================================================

  /**
   * Get all events (goals, cards, substitutions) for a specific match.
   *
   * @param matchId - The match ID
   * @returns Array of match events
   * @throws {AxiosError} 404 if match not found
   *
   * @example
   * const events = await serverMatchesService.getEventsByMatchId(12345);
   * // [{ type: 'point', minute: 23, playerId: 789, ... }, ...]
   */
  async getEventsByMatchId(matchId: number): Promise<MatchEvent[]> {
    return fetchApi<MatchEvent[]>(`/matches/${matchId}/events`);
  },

  /**
   * Get all events for matches involving a specific team.
   *
   * @param teamId - The team ID
   * @returns Array of match events for the team
   * @throws {AxiosError} 404 if team not found
   *
   * @example
   * const events = await serverMatchesService.getEventsByTeamId(456);
   */
  async getEventsByTeamId(teamId: number): Promise<MatchEvent[]> {
    return fetchApi<MatchEvent[]>(`/matches/team/${teamId}/events`);
  },

  /**
   * Get all events involving a specific player.
   *
   * @param playerId - The player ID
   * @returns Array of match events for the player
   * @throws {AxiosError} 404 if player not found
   *
   * @example
   * const events = await serverMatchesService.getEventsByPlayerId(789);
   */
  async getEventsByPlayerId(playerId: number): Promise<MatchEvent[]> {
    return fetchApi<MatchEvent[]>(`/matches/player/${playerId}/events`);
  },

  // ============================================================================
  // Match Player Statistics
  // ============================================================================

  /**
   * Get detailed player statistics for a specific match.
   * Includes goals, assists, cards, and other performance metrics.
   *
   * @param matchId - The match ID
   * @returns Player statistics for both teams
   * @throws {AxiosError} 404 if match not found
   *
   * @example
   * const stats = await serverMatchesService.getPlayerStatsByMatchId(12345);
   * // { homeTeam: [...], awayTeam: [...] }
   */
  async getPlayerStatsByMatchId(
    matchId: number,
  ): Promise<MatchPlayerStatsResponse> {
    return fetchApi<MatchPlayerStatsResponse>(
      `/matches/${matchId}/player-stats`,
    );
  },
};
