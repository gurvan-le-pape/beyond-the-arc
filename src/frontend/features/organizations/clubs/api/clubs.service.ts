// src/frontend/features/organizations/clubs/api/clubs.service.ts
import { request, ServerRevalidate } from "@/lib/services/api";

import type { ClubBasic } from "../types/ClubBasic";
import type { ClubDetailed } from "../types/ClubDetailed";
import type { ClubFilters } from "../types/ClubFilters";
import type { ClubsPaginatedResponse } from "../types/ClubsPaginatedResponse";

/** Clubs and their geography are static reference data. */
const revalidate = ServerRevalidate.REFERENCE;

/**
 * The clubs endpoints, callable from a server component or from a query
 * function alike — server components call a method bare, query functions pass
 * TanStack's `signal`. Failures throw an `ApiError`; see `request`.
 *
 * @example
 * const club = await clubsService.getById(42);
 */
export const clubsService = {
  /**
   * One page of clubs matching the filters.
   *
   * @param filters - filter and pagination criteria
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the page, with its pagination
   */
  getAll(
    filters?: ClubFilters,
    signal?: AbortSignal,
  ): Promise<ClubsPaginatedResponse> {
    return request("/clubs", { params: filters, revalidate, signal });
  },

  /**
   * One club, with its teams and their championships.
   *
   * @param id - the club's id
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the club — a 404 throws an `ApiError`
   */
  getById(id: number, signal?: AbortSignal): Promise<ClubDetailed> {
    return request(`/clubs/${id}`, { revalidate, signal });
  },

  /**
   * Every club, unpaginated and with coordinates, for the map's markers.
   *
   * @param signal - TanStack Query's `queryFn` signal
   * @returns every club
   */
  getAllClubs(signal?: AbortSignal): Promise<ClubBasic[]> {
    return request("/clubs/all", { revalidate, signal });
  },
};
