// src/frontend/features/players/api/players.service.ts
import apiClient from "../../../lib/services/client/api-client";
import type { Player } from "../types/Player";
import type { PlayerFilters } from "../types/PlayerFilters";
import type { PlayerMatchHistory } from "../types/PlayerMatchHistory";
import type { PlayersPaginatedResponse } from "../types/PlayersPaginatedResponse";

/**
 * Service for interacting with the players API.
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
 * import { playersService } from '@/lib/services/client';
 * const players = await playersService.getAll({ teamId: 1, page: 1 });
 */
export const playersService = {
  /**
   * Get all players with optional filters and pagination.
   *
   * @param filters - Optional filter criteria (teamId, name, page, limit, etc.)
   * @returns Paginated response with players and metadata
   * @throws {AxiosError} 400 if validation fails
   *
   * @example
   * const response = await playersService.getAll({
   *   teamId: 1,
   *   page: 1,
   *   limit: 20,
   * });
   */
  async getAll(filters?: PlayerFilters): Promise<PlayersPaginatedResponse> {
    const { data } = await apiClient.get<PlayersPaginatedResponse>("/players", {
      params: filters,
    });
    return data;
  },

  /**
   * Get detailed information for a single player.
   * Includes match statistics and performance data.
   *
   * @param playerId - The player ID
   * @returns Detailed player information with match stats
   * @throws {AxiosError} 404 if not found, 400 if invalid ID
   *
   * @example
   * const player = await playersService.getById(789);
   */
  async getById(playerId: number): Promise<Player> {
    const { data } = await apiClient.get<any>(`/players/${playerId}`);
    return data;
  },

  /**
   * Get all matches a player has participated in.
   *
   * @param playerId - The player ID
   * @returns Array of matches with player participation
   * @throws {AxiosError} 404 if player not found
   *
   * @example
   * const matches = await playersService.getMatches(789);
   */
  async getMatches(playerId: number): Promise<PlayerMatchHistory[]> {
    const { data } = await apiClient.get<any>(`/players/${playerId}/matches`);
    return data;
  },

  /**
   * Search players by name (used for dropdowns/autocomplete).
   * Returns a limited set of results (default: 20).
   *
   * @param name - Player name to search for (partial match)
   * @returns Array of matching players
   * @throws {AxiosError} 400 if validation fails
   *
   * @example
   * const players = await playersService.search('Dupont');
   * // Use in autocomplete: <Autocomplete options={players} />
   */
  async search(name: string): Promise<Player[]> {
    const { data } = await apiClient.get<any>("/players", {
      params: { name, limit: 20 },
    });
    // The backend returns { players, pagination, ... }, so extract players array
    return data.players || [];
  },
};
