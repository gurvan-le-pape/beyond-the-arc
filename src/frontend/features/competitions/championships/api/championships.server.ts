// src/frontend/features/competitions/championships/api/championships.server.ts
import { CompetitionLevel } from "@/shared/constants";

import {
  buildQueryString,
  fetchApi,
} from "../../../../lib/services/server/server-api-client";
import type { Championship } from "../types/Championship";
import type { ChampionshipFilters } from "../types/ChampionshipFilters";
import type { Division } from "../types/Division";

/**
 * Server-side championships service.
 *
 * IMPORTANT:
 * - Only for use in getStaticProps/getStaticPaths/getServerSideProps
 * - DO NOT import in client-side code
 * - Uses fetchApi with absolute URLs
 *
 * Usage:
 * - Import in Next.js page server-side functions
 * - Never use in React components or hooks
 *
 * @example
 * // In pages/championships/[id].tsx
 * import { serverChampionshipsService } from '@/lib/services/server';
 *
 * export async function getStaticProps({ params }) {
 *   const championship = await serverChampionshipsService.getById(params.id);
 *   return { props: { championship } };
 * }
 */
export const serverChampionshipsService = {
  /**
   * Get championships filtered by competition level and associated ID.
   * Server-side only.
   *
   * @param filters - Filter criteria (level and id required)
   * @returns Array of championships matching the criteria
   *
   * @example
   * const championships = await serverChampionshipsService.getAll({
   *   level: CompetitionLevel.REGIONAL,
   *   id: 1,
   * });
   */
  async getAll(filters: ChampionshipFilters): Promise<Championship[]> {
    const queryString = buildQueryString({
      level: filters.level,
      id: filters.id,
    });
    return fetchApi<Championship[]>(`/championships${queryString}`);
  },

  /**
   * Get a single championship by ID.
   * Server-side only.
   *
   * @param id - The championship ID
   * @returns The championship details
   *
   * @example
   * const championship = await serverChampionshipsService.getById('123');
   */
  async getById(id: number): Promise<Championship> {
    return fetchApi<Championship>(`/championships/${id}`);
  },

  /**
   * Get all available championship divisions.
   * Server-side only.
   *
   * @returns Array of all distinct divisions
   *
   * @example
   * const divisions = await serverChampionshipsService.getDivisions();
   */
  async getDivisions(): Promise<Division[]> {
    return fetchApi<Division[]>("/championships/divisions");
  },

  /**
   * Get all championship IDs for static path generation.
   * Server-side only.
   *
   * @param filters - Optional filters to narrow down IDs
   * @returns Array of championship IDs
   *
   * @example
   * // In pages/championships/[id].tsx
   * export async function getStaticPaths() {
   *   const ids = await serverChampionshipsService.getAllIds({
   *     level: CompetitionLevel.REGIONAL,
   *     id: 1,
   *   });
   *   return {
   *     paths: ids.map(id => ({ params: { id: String(id) } })),
   *     fallback: 'blocking',
   *   };
   * }
   */
  async getAllIds(filters?: ChampionshipFilters): Promise<number[]> {
    const championships = await this.getAll(
      filters ?? { level: CompetitionLevel.REGIONAL, id: 0 },
    );
    return championships.map((championship) => championship.id);
  },
};
