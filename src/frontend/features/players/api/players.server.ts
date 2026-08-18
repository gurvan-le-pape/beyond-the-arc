// src/frontend/features/players/api/players.server.ts

// Kept out of the `api/` barrel by `barrelsby.json`, and poisoned for the client
// graph here: importing this from a client module is a build error, not a leak.
import "server-only";

import type { PaginatedResponse } from "@/shared/types";

import {
  buildQueryString,
  fetchApi,
  ServerRevalidate,
} from "../../../lib/services/server/server-api-client";
import type { Player } from "../types/Player";
import type { PlayerFilters } from "../types/PlayerFilters";
import type { PlayerMatchHistoryResponse } from "../types/PlayerMatchHistory";

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
 * import { serverPlayersService } from "@/features/players/api/players.server";
 * const players = await serverPlayersService.getAll({ teamId: 1, page: 1 });
 */
export const serverPlayersService = {
  /**
   * Get all players with optional filters and pagination.
   *
   * @param filters - Optional filter criteria (teamId, name, page, limit, etc.)
   * @returns Paginated response with players and metadata
   * @throws {AxiosError} 400 if validation fails
   *
   * @example
   * const response = await serverPlayersService.getAll({
   *   teamId: 1,
   *   page: 1,
   *   limit: 20,
   * });
   */
  async getAll(filters?: PlayerFilters): Promise<PaginatedResponse<Player>> {
    const queryString = buildQueryString(filters);
    return fetchApi<PaginatedResponse<Player>>(`/players${queryString}`, {
      revalidate: ServerRevalidate.DEFAULT,
    });
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
   * const player = await serverPlayersService.getById(789);
   */
  async getById(playerId: number): Promise<Player> {
    return fetchApi<Player>(`/players/${playerId}`, {
      revalidate: ServerRevalidate.DEFAULT,
    });
  },

  /**
   * Get all matches a player has participated in.
   *
   * @param playerId - The player ID
   * @returns Array of matches with player participation
   * @throws {AxiosError} 404 if player not found
   *
   * @example
   * const matches = await serverPlayersService.getMatches(789);
   */
  async getMatches(playerId: number): Promise<PlayerMatchHistoryResponse> {
    return fetchApi<PlayerMatchHistoryResponse>(
      `/players/${playerId}/matches`,
      {
        revalidate: ServerRevalidate.LIVE,
      },
    );
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
   * const players = await serverPlayersService.search('Dupont');
   * // Use in autocomplete: <Autocomplete options={players} />
   */
  async search(name: string): Promise<Player[]> {
    const queryString = buildQueryString({ search: name, limit: 20 });
    const data = await fetchApi<PaginatedResponse<Player>>(
      `/players${queryString}`,
      {
        revalidate: ServerRevalidate.DEFAULT,
      },
    );
    return data.items;
  },
};
