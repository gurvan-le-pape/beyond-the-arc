// src/frontend/features/organizations/clubs/api/clubsKeys.ts
import type { ClubFilters } from "../types/ClubFilters";

export const clubsKeys = {
  all: ["clubs"] as const,
  lists: () => [...clubsKeys.all, "list"] as const,
  list: (filters?: ClubFilters) => [...clubsKeys.lists(), filters] as const,
  details: () => [...clubsKeys.all, "detail"] as const,
  detail: (id: number) => [...clubsKeys.details(), id] as const,
};
