// src/frontend/features/competitions/leaderboards/api/leaderboards.server.ts
import {
  buildQueryString,
  fetchApi,
  ServerRevalidate,
} from "@/lib/services/server/server-api-client";

import type { Leaderboard } from "../types/Leaderboard";
import type { LeaderboardFilters } from "../types/LeaderboardFilters";

/**
 * Server-side leaderboards service: standings for one pool.
 *
 * Server components only — this half of the dual service layer uses native
 * fetch against the backend's internal address, so it must never be imported
 * from client code. There is no client counterpart: the leaderboard is rendered
 * on the server and the pool switch is a `?pool=` navigation, not a query.
 */
export const serverLeaderboardsService = {
  /**
   * Standings for a pool, already ranked by the backend.
   *
   * Cached for {@link ServerRevalidate.LIVE}, since the scheduler rewrites
   * standings as matches are played.
   *
   * @example
   * const leaderboard = await serverLeaderboardsService.getAll({ poolId: 1 });
   */
  async getAll(filters: LeaderboardFilters): Promise<Leaderboard[]> {
    const queryString = buildQueryString(filters);
    return fetchApi<Leaderboard[]>(`/leaderboards${queryString}`, {
      revalidate: ServerRevalidate.LIVE,
    });
  },
};
