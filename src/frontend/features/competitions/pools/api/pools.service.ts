// src/frontend/features/competitions/pools/api/pools.service.ts
import { request, ServerRevalidate } from "@/lib/services/api";

import type { RecentPool } from "../types/RecentPool";

/**
 * The pools endpoint for the home page. A championship's own pools come with
 * it, from `championshipsService`.
 * Failures throw an `ApiError`; see `request`.
 */
export const poolsService = {
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
