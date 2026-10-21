// src/frontend/features/competitions/pools/api/pools.server.ts

// Kept out of the `api/` barrel by `barrelsby.json`, and poisoned for the client
// graph here: importing this from a client module is a build error, not a leak.
import "server-only";

import {
  buildQueryString,
  fetchApi,
  ServerRevalidate,
} from "@/lib/services/server/server-api-client";

import type { Pool } from "../types/Pool";
import type { RecentPool } from "../types/RecentPool";

/**
 * Server-side pools service: the groups a championship's teams are split into.
 *
 * Server components only — this half of the dual service layer uses native
 * fetch against the backend's internal address, so it must never be imported
 * from client code.
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
   *
   * @param championshipId - the championship whose pools to fetch
   */
  async getByChampionshipId(championshipId: number): Promise<Pool[]> {
    const queryString = buildQueryString({ championshipId });
    // A pool only changes when the static data is refreshed.
    return fetchApi<Pool[]>(`/pools${queryString}`, {
      revalidate: ServerRevalidate.DEFAULT,
    });
  },

  /**
   * The pools that played the most recent completed round, most prominent
   * first — the backend's order is deterministic, so the first is the one to
   * feature.
   *
   * Cached for {@link ServerRevalidate.LIVE}, since the answer moves each time
   * the scheduler completes a round.
   *
   * @example
   * const [featured] = await serverPoolsService.getRecent();
   *
   * @returns up to 10 pools with the matchday each played, or `[]` before any
   * match of the season is completed
   */
  async getRecent(): Promise<RecentPool[]> {
    return fetchApi<RecentPool[]>("/pools/recent", {
      revalidate: ServerRevalidate.LIVE,
    });
  },
};
