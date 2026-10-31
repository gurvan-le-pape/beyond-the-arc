// src/frontend/features/organizations/leagues/api/leagues.service.ts
import { request, ServerRevalidate } from "@/lib/services/api";

import type { League } from "../types/League";

/** Leagues are static reference data. */
const revalidate = ServerRevalidate.REFERENCE;

/**
 * The leagues endpoints, callable from a server component or from a query
 * function alike — server components call a method bare, query functions pass
 * TanStack's `signal`. Failures throw an `ApiError`; see `request`.
 *
 * @example
 * const leagues = await leaguesService.getAll();
 */
export const leaguesService = {
  /**
   * Every league, unpaginated.
   *
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the leagues
   */
  getAll(signal?: AbortSignal): Promise<League[]> {
    return request("/leagues", { revalidate, signal });
  },

  /**
   * One league.
   *
   * @param id - the league's id
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the league — a 404 throws an `ApiError`
   */
  getById(id: number, signal?: AbortSignal): Promise<League> {
    return request(`/leagues/${id}`, { revalidate, signal });
  },
};
