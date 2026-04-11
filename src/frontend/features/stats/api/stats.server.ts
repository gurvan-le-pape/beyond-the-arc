// src/frontend/features/stats/api/stats.server.ts
import { fetchApi } from "@/lib/services/server/server-api-client";

import type { Stats } from "../types/Stats";

export const serverStatsService = {
  async getStats(): Promise<Stats> {
    const [stats, championships] = await Promise.all([
      fetchApi<Omit<Stats, "championshipsByLevel">>("/stats"),
      fetchApi<{ level: string }[]>("/championships"),
    ]);

    const championshipsByLevel = championships.reduce(
      (acc, c) => {
        if (c.level === "national") acc.national++;
        else if (c.level === "regional") acc.regional++;
        else if (c.level === "departmental") acc.departmental++;
        return acc;
      },
      { national: 0, regional: 0, departmental: 0 },
    );

    return { ...stats, championshipsByLevel };
  },
};
