// src/frontend/features/competitions/leaderboards/api/leaderboardsKeys.ts
import type { LeaderboardFilters } from "../types/LeaderboardFilters";

export const leaderboardsKeys = {
  all: ["leaderboards"] as const,
  lists: () => [...leaderboardsKeys.all, "list"] as const,
  list: (filters?: LeaderboardFilters) =>
    [...leaderboardsKeys.lists(), filters] as const,
  byPool: (poolId: number) =>
    [...leaderboardsKeys.all, "pool", poolId] as const,
};
