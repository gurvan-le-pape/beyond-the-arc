// src/frontend/features/teams/api/teams.service.ts
import { request, ServerRevalidate } from "@/lib/services/api";
import type { PaginatedResponse } from "@/shared/types";

import type { Team } from "../types/Team";
import type { TeamDetail } from "../types/TeamDetail";
import type { TeamFilters } from "../types/TeamFilters";
import type { TeamFilterValues } from "../types/TeamFilterValues";
import type { TeamMatchHistoryResponse } from "../types/TeamMatchHistory";

/**
 * The teams endpoints, callable from a server component or from a query
 * function alike — server components call a method bare, query functions pass
 * TanStack's `signal`. Failures throw an `ApiError`; see `request`.
 *
 * @example
 * const team = await teamsService.getById(456);
 */
export const teamsService = {
  /**
   * One page of teams matching the filters.
   *
   * @param filters - filter and pagination criteria
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the page, with its pagination
   */
  getAll(
    filters?: TeamFilters,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<Team>> {
    return request("/teams", {
      params: filters,
      revalidate: ServerRevalidate.DEFAULT,
      signal,
    });
  },

  /**
   * One team, with its roster and current standing — both of which move as
   * matches are played.
   *
   * @param teamId - the team's id
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the team — a 404 throws an `ApiError`
   */
  getById(teamId: number, signal?: AbortSignal): Promise<TeamDetail> {
    return request(`/teams/${teamId}`, {
      revalidate: ServerRevalidate.LIVE,
      signal,
    });
  },

  /**
   * The team's match history this season.
   *
   * @param teamId - the team whose history to fetch
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the history and its season totals
   */
  getMatches(
    teamId: number,
    signal?: AbortSignal,
  ): Promise<TeamMatchHistoryResponse> {
    return request(`/teams/${teamId}/matches`, {
      revalidate: ServerRevalidate.LIVE,
      signal,
    });
  },

  /**
   * The categories, genders and levels that occur among teams in a league or
   * committee, for the teams filters to offer.
   *
   * @param params - the league or committee to narrow to
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the values present
   */
  getFilterValues(
    params?: { committeeId?: number; leagueId?: number },
    signal?: AbortSignal,
  ): Promise<TeamFilterValues> {
    return request("/teams/filter-values", {
      params,
      revalidate: ServerRevalidate.DEFAULT,
      signal,
    });
  },
};
