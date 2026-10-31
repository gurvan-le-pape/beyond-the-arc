// src/frontend/features/stats/api/stats.service.ts
import { request, ServerRevalidate } from "@/lib/services/api";

import type { Stats } from "../types/Stats";

/** The site-wide counts endpoint. Failures throw an `ApiError`; see `request`. */
export const statsService = {
  /**
   * Site-wide totals — clubs, teams, players, matches, leagues and
   * committees — and championships counted by level.
   *
   * @returns the totals; the match count moves as the scheduler plays
   */
  getStats(): Promise<Stats> {
    return request("/stats", { revalidate: ServerRevalidate.LIVE });
  },
};
