// src/frontend/features/competitions/pools/api/pools.service.ts
import { request, ServerRevalidate } from "@/lib/services/api";

import type { Pool } from "../types/Pool";
import type { RecentPool } from "../types/RecentPool";

/**
 * The pools endpoints: the groups a championship's teams are split into.
 * Failures throw an `ApiError`; see `request`.
 */
export const poolsService = {
  /**
   * Every pool of a championship, in the backend's order.
   *
   * @example
   * const pools = await poolsService.getByChampionshipId(5);
   *
   * @param championshipId - the championship whose pools to fetch
   * @returns the championship's pools, or `[]` if it has none — the endpoint
   * is a list and never 404s
   */
  getByChampionshipId(championshipId: number): Promise<Pool[]> {
    // A pool only changes when the static data is refreshed.
    return request("/pools", {
      params: { championshipId },
      revalidate: ServerRevalidate.DEFAULT,
    });
  },

  /**
   * The pools that played the most recent completed round, most prominent
   * first — the backend's order is deterministic, so the first is the one to
   * feature.
   *
   * @example
   * const [featured] = await poolsService.getRecent();
   *
   * @returns up to 10 pools with the matchday each played, or `[]` before any
   * match of the season is completed; it moves each time the scheduler
   * completes a round
   */
  getRecent(): Promise<RecentPool[]> {
    return request("/pools/recent", { revalidate: ServerRevalidate.LIVE });
  },
};
