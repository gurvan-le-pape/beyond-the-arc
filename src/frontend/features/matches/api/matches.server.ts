// src/frontend/features/matches/api/matches.server.ts

// Kept out of the `api/` barrel by `barrelsby.json`, and poisoned for the client
// graph here: importing this from a client module is a build error, not a leak.
import "server-only";

import type { PaginatedResponse } from "@/shared/types";

import {
  buildQueryString,
  fetchApi,
  ServerRevalidate,
} from "../../../lib/services/server/server-api-client";
import type { Match } from "../types/Match";
import type { MatchDetail } from "../types/MatchDetail";
import type { MatchEvent } from "../types/MatchEvent";
import type { MatchFilters } from "../types/MatchFilters";
import type { MatchPlayerStatsResponse } from "../types/MatchPlayerStats";
import type { Shot } from "../types/Shot";

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
 * import { serverMatchesService } from "@/features/matches/api/matches.server";
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
  async getAll(filters?: MatchFilters): Promise<PaginatedResponse<Match>> {
    const queryString = buildQueryString(filters);
    return fetchApi<PaginatedResponse<Match>>(`/matches${queryString}`, {
      revalidate: ServerRevalidate.LIVE,
    });
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
    return fetchApi<MatchDetail>(`/matches/${id}`, {
      revalidate: ServerRevalidate.LIVE,
    });
  },

  /**
   * Every match of a pool, unpaginated.
   *
   * Uses the dedicated `/matches/pool/:id` endpoint, which returns a bare
   * array — the same one `matchesService.getByPoolId` calls. The paginated
   * `/matches?poolId=` returns `{ items, total, … }`, which does not match this
   * signature.
   *
   * @example
   * const matches = await serverMatchesService.getByPoolId(10);
   *
   * @param poolId - the pool whose fixtures to fetch
   * @returns every match in the pool, unpaginated — the caller slices for display
   */
  async getByPoolId(poolId: number): Promise<Match[]> {
    return fetchApi<Match[]>(`/matches/pool/${poolId}`, {
      revalidate: ServerRevalidate.LIVE,
    });
  },

  /**
   * Every match of a championship, unpaginated.
   *
   * Pages through `/matches` (max limit 100 per request) until every page is
   * fetched, then returns the combined list — the same loop the client half
   * (`matchesService.getByChampionshipId`) runs, so both halves of the mirror
   * return the same shape. A bare `GET /matches?championshipId=` would only
   * return the first page *and* type a paginated envelope as an array.
   *
   * @param championshipId - The championship ID
   * @returns every match in the championship, unpaginated
   * @throws {ApiError} 400 if validation fails
   *
   * @example
   * const matches = await serverMatchesService.getByChampionshipId(5);
   */
  async getByChampionshipId(championshipId: number): Promise<Match[]> {
    const limit = 100;
    const matches: Match[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const queryString = buildQueryString({ championshipId, page, limit });
      const { items, totalPages: pages } = await fetchApi<
        PaginatedResponse<Match>
      >(`/matches${queryString}`, { revalidate: ServerRevalidate.LIVE });
      matches.push(...items);
      totalPages = pages;
      page += 1;
    } while (page <= totalPages);

    return matches;
  },

  // ============================================================================
  // Match Events
  // ============================================================================

  /**
   * Get all events for a specific match.
   *
   * @param matchId - The match ID
   * @returns Array of match events
   * @throws {ApiError} 404 if match not found
   *
   * @example
   * const events = await serverMatchesService.getEventsByMatchId(12345);
   */
  async getEventsByMatchId(matchId: number): Promise<MatchEvent[]> {
    return fetchApi<MatchEvent[]>(`/matches/${matchId}/events`, {
      revalidate: ServerRevalidate.LIVE,
    });
  },

  /**
   * Get every shot a team took this season, for its shot chart.
   *
   * @param teamId - The team ID
   * @returns The team's shots: location and event type
   *
   * @example
   * const shots = await serverMatchesService.getShotsByTeamId(456);
   */
  async getShotsByTeamId(teamId: number): Promise<Shot[]> {
    return fetchApi<Shot[]>(`/matches/team/${teamId}/shots`, {
      revalidate: ServerRevalidate.LIVE,
    });
  },

  /**
   * Get every shot a player took this season, for their shot chart.
   *
   * @param playerId - The player ID
   * @returns The player's shots: location and event type
   *
   * @example
   * const shots = await serverMatchesService.getShotsByPlayerId(789);
   */
  async getShotsByPlayerId(playerId: number): Promise<Shot[]> {
    return fetchApi<Shot[]>(`/matches/player/${playerId}/shots`, {
      revalidate: ServerRevalidate.LIVE,
    });
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
      { revalidate: ServerRevalidate.LIVE },
    );
  },
};
