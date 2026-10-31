// src/frontend/features/matches/api/matchesKeys.ts
import type { MatchFilters } from "../types/MatchFilters";

export const matchesKeys = {
  all: ["matches"] as const,
  lists: () => [...matchesKeys.all, "list"] as const,
  list: (filters?: MatchFilters) => [...matchesKeys.lists(), filters] as const,
  details: () => [...matchesKeys.all, "detail"] as const,
  detail: (id: number) => [...matchesKeys.details(), id] as const,
  events: (id: number) => [...matchesKeys.detail(id), "events"] as const,
};
