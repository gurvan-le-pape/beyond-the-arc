// src/frontend/features/organizations/committees/api/committees.server.ts
import {
  buildQueryString,
  fetchApi,
} from "../../../../lib/services/server/server-api-client";
import type { Committee } from "../types/Committees";
import type { CommitteeFilters } from "../types/CommitteesFilters";

/**
 * Service for interacting with the committees API.
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
 * import { serverCommitteesService } from '@/lib/services/client';
 * const committees = await serverCommitteesService.getAll({ leagueId: 1 });
 */
export const serverCommitteesService = {
  /**
   * Get all committees with optional filters.
   *
   * @param filters - Optional filter criteria
   * @returns Array of committees
   * @throws {AxiosError} 400 if validation fails, 404 if none found
   *
   * @example
   * const committees = await serverCommitteesService.getAll({ leagueId: 1 });
   */
  async getAll(filters?: CommitteeFilters): Promise<Committee[]> {
    const queryString = buildQueryString(filters);
    return fetchApi<Committee[]>(`/committees${queryString}`);
  },

  /**
   * Get a single committee by ID.
   *
   * @param id - The committee ID
   * @returns The committee details
   * @throws {AxiosError} 404 if not found, 400 if invalid ID
   *
   * @example
   * const committee = await serverCommitteesService.getById(123);
   */
  async getById(id: number): Promise<Committee> {
    return fetchApi<Committee>(`/committees/${id}`);
  },

  /**
   * Get multiple committees by their IDs.
   * Efficient bulk fetch for multiple committees.
   *
   * @param ids - Array of committee IDs
   * @returns Array of committees
   * @throws {AxiosError} 400 if validation fails, 404 if none found
   *
   * @example
   * const committees = await serverCommitteesService.getByIds([1, 2, 3]);
   */
  async getByIds(ids: number[]): Promise<Committee[]> {
    return fetchApi<Committee[]>(`/committees/${ids.join(",")}`);
  },
};
