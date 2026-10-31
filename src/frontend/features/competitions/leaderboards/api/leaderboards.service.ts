// src/frontend/features/competitions/leaderboards/api/leaderboards.service.ts
import { request, ServerRevalidate } from "@/lib/services/api";

import type { Leaderboard } from "../types/Leaderboard";
import type { LeaderboardFilters } from "../types/LeaderboardFilters";

/**
 * The leaderboards endpoint: standings for one pool. Rendered on the server
 * only — the pool switch is a `?pool=` navigation, not a query. Failures throw
 * an `ApiError`; see `request`.
 */
export const leaderboardsService = {
  /**
   * Standings for a pool, already ranked by the backend.
   *
   * @example
   * const leaderboard = await leaderboardsService.getAll({ poolId: 1 });
   *
   * @param filters - narrows the standings to one pool or championship
   * @returns the standings rows, which move as the scheduler plays matches
   */
  getAll(filters: LeaderboardFilters): Promise<Leaderboard[]> {
    return request("/leaderboards", {
      params: filters,
      revalidate: ServerRevalidate.LIVE,
    });
  },
};
