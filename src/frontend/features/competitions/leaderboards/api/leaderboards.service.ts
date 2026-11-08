// src/frontend/features/competitions/leaderboards/api/leaderboards.service.ts
import { request, ServerRevalidate } from "@/lib/services/api";

import type { Leaderboard } from "../types/Leaderboard";

/**
 * A pool's standings, `/pools/:id/leaderboard`. Rendered on the server
 * only — the pool switch is a `?pool=` navigation, not a query. Failures throw
 * an `ApiError`; see `request`.
 */
export const leaderboardsService = {
  /**
   * Standings for a pool, already ranked by the backend.
   *
   * @example
   * const leaderboard = await leaderboardsService.getByPoolId(1);
   *
   * @param poolId - the pool whose standings to fetch
   * @returns the standings rows, which move as the scheduler plays matches
   */
  getByPoolId(poolId: number): Promise<Leaderboard[]> {
    return request(`/pools/${poolId}/leaderboard`, {
      revalidate: ServerRevalidate.LIVE,
    });
  },
};
