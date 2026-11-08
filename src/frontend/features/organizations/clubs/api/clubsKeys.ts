// src/frontend/features/organizations/clubs/api/clubsKeys.ts
import type { ClubFilters } from "../types/ClubFilters";

export const clubsKeys = {
  all: ["clubs"] as const,
  lists: () => [...clubsKeys.all, "list"] as const,
  list: (filters?: ClubFilters) => [...clubsKeys.lists(), filters] as const,
  allClubs: () => [...clubsKeys.all, "all"] as const,
  search: (
    search: string,
    filters?: Pick<ClubFilters, "committeeId" | "leagueId">,
  ) => [...clubsKeys.all, "search", search, filters] as const,
};
