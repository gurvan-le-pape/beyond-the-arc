// src/frontend/features/players/api/players.service.ts
import type { PaginatedResponse } from "@/shared/types";

import apiClient from "../../../lib/services/client/api-client";
import type { Player } from "../types/Player";
import type { PlayerFilters } from "../types/PlayerFilters";
import type { PlayerFilterValues } from "../types/PlayerFilterValues";
import type { PlayerMatchHistoryResponse } from "../types/PlayerMatchHistory";
import type { PlayerSearchFilters } from "../types/PlayerSearchFilters";

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
 * import { playersService } from "@/features/players/api";
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
   *
   * @param signal - TanStack Query's `queryFn` signal; without it a superseded request runs to completion
   */
  async getAll(
    filters?: PlayerFilters,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<Player>> {
    const { data } = await apiClient.get<PaginatedResponse<Player>>(
      "/players",
      {
        params: filters,
        signal,
      },
    );
    return data;
  },

  /**
   * Get detailed information for a single player.
   * Includes match statistics and performance data.
   *
   * @param playerId - the player's id
   * @param signal - TanStack Query's `queryFn` signal; without it a superseded request runs to completion
   * @returns the fully hydrated player, with team, club and committee
   * @throws {AxiosError} 404 if not found, 400 if invalid ID
   */
  async getById(playerId: number, signal?: AbortSignal): Promise<Player> {
    const { data } = await apiClient.get<Player>(`/players/${playerId}`, {
      signal,
    });
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
   *
   * @param signal - TanStack Query's `queryFn` signal; without it a superseded request runs to completion
   */
  async getMatches(
    playerId: number,
    signal?: AbortSignal,
  ): Promise<PlayerMatchHistoryResponse> {
    const { data } = await apiClient.get<PlayerMatchHistoryResponse>(
      `/players/${playerId}/matches`,
      { signal },
    );
    return data;
  },

  /**
   * Get available filter values for players (player numbers, team numbers).
   *
   * @returns Filter values for players
   * @example
   * const filterValues = await playersService.getFilterValues();
   *
   * @param params - optional committee or league to scope the values to; omitted, they span every player
   * @param signal - TanStack Query's `queryFn` signal; without it a superseded request runs to completion
   */
  async getFilterValues(
    params?: {
      committeeId?: number;
      leagueId?: number;
    },
    signal?: AbortSignal,
  ): Promise<PlayerFilterValues> {
    const { data } = await apiClient.get<PlayerFilterValues>(
      "/players/filter-values",
      { params, signal },
    );
    return data;
  },

  /**
   * Search players by name (used for dropdowns/autocomplete).
   * Returns a limited set of results (default: 20).
   *
   * @param query - Player name to search for (partial match)
   * @param filters - Optional gender/category scoping, applied server-side
   * @returns Array of matching players
   * @throws {AxiosError} 400 if validation fails
   *
   * @example
   * const players = await playersService.search('Dupont');
   * // Use in autocomplete: <Autocomplete options={players} />
   *
   * @param signal - TanStack Query's `queryFn` signal; without it a superseded request runs to completion
   */
  async search(
    query: string,
    filters?: PlayerSearchFilters,
    signal?: AbortSignal,
  ): Promise<Player[]> {
    const { data } = await apiClient.get<PaginatedResponse<Player>>(
      "/players",
      {
        params: {
          search: query,
          limit: 20,
          ...(filters?.gender && { gender: filters.gender }),
          ...(filters?.category && { category: filters.category }),
        },
        signal,
      },
    );

    return data.items ?? [];
  },
};
