// src/frontend/features/matches/api/matches.service.ts
import { request, ServerRevalidate } from "@/lib/services/api";
import type { PaginatedResponse } from "@/shared/types";

import type { Match } from "../types/Match";
import type { MatchDetail } from "../types/MatchDetail";
import type { MatchEvent } from "../types/MatchEvent";
import type { MatchFilters } from "../types/MatchFilters";
import type { MatchPlayerStatsResponse } from "../types/MatchPlayerStats";
import type { Shot } from "../types/Shot";

/** Everything here is written by the match scheduler. */
const revalidate = ServerRevalidate.LIVE;

/**
 * The matches endpoints, callable from a server component or from a query
 * function alike.
 *
 * Server components call a method bare; query functions pass TanStack's
 * `signal` so a superseded request is aborted. Failures throw an `ApiError` —
 * see `request`.
 *
 * @example
 * const match = await matchesService.getById(12345);
 */
export const matchesService = {
  /**
   * One page of matches matching the filters.
   *
   * @param filters - filter and pagination criteria
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the page, with its pagination
   */
  getAll(
    filters?: MatchFilters,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<Match>> {
    return request("/matches", { params: filters, revalidate, signal });
  },

  /**
   * One match, with its teams, venue and score by period.
   *
   * @param id - the match's id
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the match — a 404 throws an `ApiError`
   */
  getById(id: number, signal?: AbortSignal): Promise<MatchDetail> {
    return request(`/matches/${id}`, { revalidate, signal });
  },

  /**
   * Every match of a pool, unpaginated.
   *
   * Uses the dedicated `/matches/pool/:id` endpoint, which returns a bare
   * array. The paginated `/matches?poolId=` returns `{ items, total, … }`,
   * which does not match this signature.
   *
   * @param poolId - the pool whose fixtures to fetch
   * @param signal - TanStack Query's `queryFn` signal
   * @returns every match in the pool — the caller slices for display
   */
  getByPoolId(poolId: number, signal?: AbortSignal): Promise<Match[]> {
    return request(`/matches/pool/${poolId}`, { revalidate, signal });
  },

  /**
   * Every match of a championship, unpaginated.
   *
   * Pages through `/matches` at the API's maximum page size until every page
   * is fetched. A bare `GET /matches?championshipId=` would only return the
   * first page, inside a paginated envelope.
   *
   * @param championshipId - the championship whose matches to fetch
   * @param signal - TanStack Query's `queryFn` signal
   * @returns every match in the championship
   */
  async getByChampionshipId(
    championshipId: number,
    signal?: AbortSignal,
  ): Promise<Match[]> {
    const limit = 100;
    const matches: Match[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const { items, totalPages: pages } = await request<
        PaginatedResponse<Match>
      >("/matches", {
        params: { championshipId, page, limit },
        revalidate,
        signal,
      });
      matches.push(...items);
      totalPages = pages;
      page += 1;
    } while (page <= totalPages);

    return matches;
  },

  /**
   * Every event of a match, in game order.
   *
   * @param matchId - the match whose events to fetch
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the match's events — a 404 throws an `ApiError`
   */
  getEventsByMatchId(
    matchId: number,
    signal?: AbortSignal,
  ): Promise<MatchEvent[]> {
    return request(`/matches/${matchId}/events`, { revalidate, signal });
  },

  /**
   * Every shot a team took this season, for its shot chart.
   *
   * @param teamId - the team whose shots to fetch
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the team's shots: location and event type
   */
  getShotsByTeamId(teamId: number, signal?: AbortSignal): Promise<Shot[]> {
    return request(`/matches/team/${teamId}/shots`, { revalidate, signal });
  },

  /**
   * Every shot a player took this season, for their shot chart.
   *
   * @param playerId - the player whose shots to fetch
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the player's shots: location and event type
   */
  getShotsByPlayerId(playerId: number, signal?: AbortSignal): Promise<Shot[]> {
    return request(`/matches/player/${playerId}/shots`, { revalidate, signal });
  },

  /**
   * Both teams' per-player box-score lines for one match.
   *
   * @param matchId - the match whose box score to fetch
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the box score — a 404 throws an `ApiError`
   */
  getPlayerStatsByMatchId(
    matchId: number,
    signal?: AbortSignal,
  ): Promise<MatchPlayerStatsResponse> {
    return request(`/matches/${matchId}/player-stats`, { revalidate, signal });
  },
};
