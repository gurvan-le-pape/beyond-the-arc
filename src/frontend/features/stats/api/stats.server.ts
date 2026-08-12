// src/frontend/features/stats/api/stats.server.ts

// Kept out of the `api/` barrel by `barrelsby.json`, and poisoned for the client
// graph here: importing this from a client module is a build error, not a leak.
import "server-only";

import {
  fetchApi,
  ServerRevalidate,
} from "@/lib/services/server/server-api-client";

import type { Stats } from "../types/Stats";

export const serverStatsService = {
  async getStats(): Promise<Stats> {
    return fetchApi<Stats>("/stats", {
      revalidate: ServerRevalidate.LIVE,
    });
  },
};
