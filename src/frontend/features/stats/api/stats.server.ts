// src/frontend/features/stats/api/stats.server.ts
import { fetchApi, ServerRevalidate } from "@/lib/services/server/server-api-client";

import type { Stats } from "../types/Stats";

export const serverStatsService = {
  async getStats(): Promise<Stats> {
    return fetchApi<Stats>("/stats", {
      revalidate: ServerRevalidate.LIVE,
    });
  },
};
