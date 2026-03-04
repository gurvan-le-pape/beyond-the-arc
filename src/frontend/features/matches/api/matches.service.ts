// src/frontend/features/matches/api/matches.service.ts
import apiClient from "../../../lib/services/client/api-client";
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
 * import { matchesService } from '@/lib/services/client';
 * const matches = await matchesService.getAll({ championshipId: 1 });
 */
export const matchesService = {
  /**
   * Get all matches with optional filters and pagination.
   *
   * @param filters - Optional filter criteria (championshipId, poolId, page, limit, etc.)
   * @returns Paginated response with matches
   * @throws {AxiosError} 400 if validation fails
   *
   * @example
   * const response = await matchesService.getAll({
   *   championshipId: 1,
   *   page: 1,
   *   limit: 20,
   * });
   */
  async getAll(filters?: MatchFilters): Promise<MatchesPaginatedResponse> {
    const { data } = await apiClient.get<any>("/matches", {
      params: filters,
    });
    return data;
  },

  /**
   * Get detailed information for a single match.
   *
   * @param id - The match ID
   * @returns Detailed match information including teams, scores, and events
   * @throws {AxiosError} 404 if not found, 400 if invalid ID
   *
   * @example
   * const match = await matchesService.getById(12345);
   */
  async getById(id: number): Promise<MatchDetail> {
    const { data } = await apiClient.get<any>(`/matches/${id}`);
    return data;
  },

  /**
   * Get all matches for a specific pool.
   * Returns all matches unpaginated (limit: 500).
   *
   * @param poolId - The pool ID
   * @returns Array of all matches in the pool
   * @throws {AxiosError} 400 if validation fails, 404 if none found
   *
   * @example
   * const matches = await matchesService.getByPoolId(10);
   */
  async getByPoolId(poolId: number): Promise<Match[]> {
    const { data } = await apiClient.get<any>("/matches", {
      params: { poolId, limit: 500 },
    });
    return data.items ?? data;
  },

  /**
   * Get all matches for a specific championship.
   * Returns all matches unpaginated (limit: 500).
   *
   * @param championshipId - The championship ID
   * @returns Array of all matches in the championship
   * @throws {AxiosError} 400 if validation fails, 404 if none found
   *
   * @example
   * const matches = await matchesService.getByChampionshipId(5);
   */
  async getByChampionshipId(championshipId: number): Promise<Match[]> {
    const { data } = await apiClient.get<any>("/matches", {
      params: { championshipId, limit: 500 },
    });
    return data.items ?? data;
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
   * const events = await matchesService.getEventsByMatchId(12345);
   * // [{ type: 'point', minute: 23, playerId: 789, ... }, ...]
   */
  async getEventsByMatchId(matchId: number): Promise<MatchEvent[]> {
    const { data } = await apiClient.get<any>(`/matches/${matchId}/events`);
    return data;
  },

  /**
   * Get all events for matches involving a specific team.
   *
   * @param teamId - The team ID
   * @returns Array of match events for the team
   * @throws {AxiosError} 404 if team not found
   *
   * @example
   * const events = await matchesService.getEventsByTeamId(456);
   */
  async getEventsByTeamId(teamId: number): Promise<MatchEvent[]> {
    const { data } = await apiClient.get<any>(
      `/matches/teams/${teamId}/events`,
    );
    return data;
  },

  /**
   * Get all events involving a specific player.
   *
   * @param playerId - The player ID
   * @returns Array of match events for the player
   * @throws {AxiosError} 404 if player not found
   *
   * @example
   * const events = await matchesService.getEventsByPlayerId(789);
   */
  async getEventsByPlayerId(playerId: number): Promise<MatchEvent[]> {
    const { data } = await apiClient.get<any>(
      `/matches/player/${playerId}/events`,
    );
    return data;
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
   * const stats = await matchesService.getPlayerStatsByMatchId(12345);
   * // { homeTeam: [...], awayTeam: [...] }
   */
  async getPlayerStatsByMatchId(
    matchId: number,
  ): Promise<MatchPlayerStatsResponse> {
    const { data } = await apiClient.get<any>(
      `/matches/${matchId}/player-stats`,
    );
    return data;
  },
};
