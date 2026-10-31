// src/frontend/features/players/api/players.service.ts
import { request, ServerRevalidate } from "@/lib/services/api";
import type { PaginatedResponse } from "@/shared/types";

import type { Player } from "../types/Player";
import type { PlayerFilters } from "../types/PlayerFilters";
import type { PlayerFilterValues } from "../types/PlayerFilterValues";
import type { PlayerMatchHistoryResponse } from "../types/PlayerMatchHistory";
import type { PlayerSearchFilters } from "../types/PlayerSearchFilters";

/**
 * The players endpoints, callable from a server component or from a query
 * function alike — server components call a method bare, query functions pass
 * TanStack's `signal`. Failures throw an `ApiError`; see `request`.
 *
 * @example
 * const player = await playersService.getById(789);
 */
export const playersService = {
  /**
   * One page of players matching the filters.
   *
   * @param filters - filter and pagination criteria
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the page, with its pagination
   */
  getAll(
    filters?: PlayerFilters,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<Player>> {
    return request("/players", {
      params: filters,
      revalidate: ServerRevalidate.DEFAULT,
      signal,
    });
  },

  /**
   * One player, with their team and season stats.
   *
   * @param playerId - the player's id
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the player — a 404 throws an `ApiError`
   */
  getById(playerId: number, signal?: AbortSignal): Promise<Player> {
    return request(`/players/${playerId}`, {
      revalidate: ServerRevalidate.DEFAULT,
      signal,
    });
  },

  /**
   * The player's match history this season, one line per match played.
   *
   * @param playerId - the player whose history to fetch
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the history and its season totals
   */
  getMatches(
    playerId: number,
    signal?: AbortSignal,
  ): Promise<PlayerMatchHistoryResponse> {
    return request(`/players/${playerId}/matches`, {
      revalidate: ServerRevalidate.LIVE,
      signal,
    });
  },

  /**
   * The categories, genders and levels that occur among players in a league
   * or committee, for the players filters to offer.
   *
   * @param params - the league or committee to narrow to
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the values present
   */
  getFilterValues(
    params?: { committeeId?: number; leagueId?: number },
    signal?: AbortSignal,
  ): Promise<PlayerFilterValues> {
    return request("/players/filter-values", {
      params,
      revalidate: ServerRevalidate.DEFAULT,
      signal,
    });
  },

  /**
   * The first 20 players whose name matches, for a picker.
   *
   * @param query - the name, or part of it
   * @param filters - gender and category to narrow to
   * @param signal - TanStack Query's `queryFn` signal
   * @returns up to 20 players
   */
  async search(
    query: string,
    filters?: PlayerSearchFilters,
    signal?: AbortSignal,
  ): Promise<Player[]> {
    const { items } = await request<PaginatedResponse<Player>>("/players", {
      params: {
        search: query,
        limit: 20,
        gender: filters?.gender,
        category: filters?.category,
      },
      revalidate: ServerRevalidate.DEFAULT,
      signal,
    });
    return items;
  },
};
