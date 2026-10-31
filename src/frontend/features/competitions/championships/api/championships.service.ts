// src/frontend/features/competitions/championships/api/championships.service.ts
import { request, ServerRevalidate } from "@/lib/services/api";
import type { PaginatedResponse } from "@/shared/types";

import type { Championship } from "../types/Championship";
import type { ChampionshipFilters } from "../types/ChampionshipFilters";

/** A championship only changes with a data refresh, not with play. */
const revalidate = ServerRevalidate.DEFAULT;

/**
 * The championships endpoints, callable from a server component or from a
 * query function alike — server components call a method bare, query
 * functions pass TanStack's `signal`. Failures throw an `ApiError`; see
 * `request`.
 *
 * @example
 * const { items } = await championshipsService.getAll({ leagueId: 3 });
 */
export const championshipsService = {
  /**
   * One page of championships matching the filters.
   *
   * @param filters - filter and pagination criteria
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the page, with its pagination
   */
  getAll(
    filters?: ChampionshipFilters,
    signal?: AbortSignal,
  ): Promise<PaginatedResponse<Championship>> {
    return request("/championships", { params: filters, revalidate, signal });
  },

  /**
   * One championship, with its organiser and level.
   *
   * @param id - the championship's id
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the championship — a 404 throws an `ApiError`
   */
  getById(id: number, signal?: AbortSignal): Promise<Championship> {
    return request(`/championships/${id}`, { revalidate, signal });
  },
};
