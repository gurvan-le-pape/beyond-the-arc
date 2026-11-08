// src/frontend/features/teams/api/teamsKeys.ts
import type { TeamFilters } from "../types/TeamFilters";

export const teamsKeys = {
  all: ["teams"] as const,
  lists: () => [...teamsKeys.all, "list"] as const,
  list: (filters?: TeamFilters) => [...teamsKeys.lists(), filters] as const,
};
