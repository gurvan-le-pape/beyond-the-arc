// src/frontend/features/competitions/championships/api/championships.server.ts

// Kept out of the `api/` barrel by `barrelsby.json`, and poisoned for the client
// graph here: importing this from a client module is a build error, not a leak.
import "server-only";

import {
  buildQueryString,
  fetchApi,
  ServerRevalidate,
} from "@/lib/services/server/server-api-client";
import type { PaginatedResponse } from "@/shared/types";

import type { Championship } from "../types/Championship";
import type { ChampionshipFilters } from "../types/ChampionshipFilters";

/**
 * Server-side championships service.
 *
 * Server components only — this half of the dual service layer uses native
 * fetch against the backend's internal address, so it must never be imported
 * from client code. `championships.service.ts` is the Axios counterpart the
 * TanStack Query hooks use, with the same method signatures.
 *
 * @example
 * // In an async server component
 * const championship = await serverChampionshipsService
 *   .getById(parseRouteId(championshipIdStr))
 *   .catch(handleServerError);
 */
export const serverChampionshipsService = {
  /**
   * Championships of one organization at one level, paginated.
   *
   * @param filters - `level` and `id` identify the organization; `category`,
   * `gender`, `page` and `limit` narrow it further.
   * @returns A page of championships, with `items: []` when none match — the
   * endpoint is a list and never 404s.
   *
   * @example
   * const { items } = await serverChampionshipsService.getAll({
   *   level: CompetitionLevel.REGIONAL,
   *   id: 1,
   * });
   */
  async getAll(
    filters: ChampionshipFilters,
  ): Promise<PaginatedResponse<Championship>> {
    const queryString = buildQueryString({
      level: filters.level,
      id: filters.id,
      category: filters.category,
      gender: filters.gender,
      page: filters.page,
      limit: filters.limit,
    });
    return fetchApi<PaginatedResponse<Championship>>(
      `/championships${queryString}`,
      { revalidate: ServerRevalidate.DEFAULT },
    );
  },

  /**
   * A single championship, with its pools.
   *
   * @returns The championship. Unlike the list endpoints, this one 404s for an
   * unknown id — pass the result through `handleServerError` to turn that into
   * `notFound()`.
   *
   * @example
   * const championship = await serverChampionshipsService
   *   .getById(123)
   *   .catch(handleServerError);
   */
  async getById(id: number): Promise<Championship> {
    return fetchApi<Championship>(`/championships/${id}`, {
      revalidate: ServerRevalidate.DEFAULT,
    });
  },
};
