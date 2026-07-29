// src/frontend/features/competitions/pools/api/pools.server.ts
import {
  buildQueryString,
  fetchApi,
  ServerRevalidate,
} from "@/lib/services/server/server-api-client";

import type { Pool } from "../types/Pool";

/**
 * Server-side pools service: the groups a championship's teams are split into.
 *
 * Server components only — this half of the dual service layer uses native
 * fetch against the backend's internal address, so it must never be imported
 * from client code. Cached for {@link ServerRevalidate.DEFAULT}, since a pool
 * only changes when the static data is refreshed.
 */
export const serverPoolsService = {
  /**
   * Every pool of a championship, in the backend's order.
   *
   * @returns The championship's pools, or `[]` if it has none — the endpoint is
   * a list and never 404s.
   *
   * @example
   * const pools = await serverPoolsService.getByChampionshipId(5);
   */
  async getByChampionshipId(championshipId: number): Promise<Pool[]> {
    const queryString = buildQueryString({ championshipId });
    return fetchApi<Pool[]>(`/pools${queryString}`, {
      revalidate: ServerRevalidate.DEFAULT,
    });
  },
};
