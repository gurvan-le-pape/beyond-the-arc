// src/frontend/features/organizations/committees/api/committees.service.ts
import { request, ServerRevalidate } from "@/lib/services/api";

import type { Committee } from "../types/Committees";
import type { CommitteeFilters } from "../types/CommitteesFilters";

/** Committees are static reference data. */
const revalidate = ServerRevalidate.REFERENCE;

/**
 * The committees endpoints, callable from a server component or from a query
 * function alike — server components call a method bare, query functions pass
 * TanStack's `signal`. Failures throw an `ApiError`; see `request`.
 *
 * @example
 * const committees = await committeesService.getAll({ leagueId: 3 });
 */
export const committeesService = {
  /**
   * Every committee matching the filters, unpaginated.
   *
   * @param filters - the league to narrow to
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the committees, or `[]`
   */
  getAll(
    filters?: CommitteeFilters,
    signal?: AbortSignal,
  ): Promise<Committee[]> {
    return request("/committees", { params: filters, revalidate, signal });
  },

  /**
   * One committee.
   *
   * @param id - the committee's id
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the committee — a 404 throws an `ApiError`
   */
  getById(id: number, signal?: AbortSignal): Promise<Committee> {
    return request(`/committees/${id}`, { revalidate, signal });
  },

  /**
   * Several committees in one request.
   *
   * @param ids - the committees' ids
   * @param signal - TanStack Query's `queryFn` signal
   * @returns the committees found
   */
  getByIds(ids: number[], signal?: AbortSignal): Promise<Committee[]> {
    return request(`/committees/${ids.join(",")}`, { revalidate, signal });
  },
};
