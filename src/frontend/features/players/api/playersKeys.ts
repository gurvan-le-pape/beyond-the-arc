// src/frontend/features/players/api/playersKeys.ts
import type { PlayerFilters } from "../types/PlayerFilters";
import type { PlayerSearchFilters } from "../types/PlayerSearchFilters";

export const playersKeys = {
  all: ["players"] as const,
  lists: () => [...playersKeys.all, "list"] as const,
  list: (filters?: PlayerFilters) => [...playersKeys.lists(), filters] as const,
  details: () => [...playersKeys.all, "detail"] as const,
  detail: (id: number) => [...playersKeys.details(), id] as const,
  matches: (id: number) => [...playersKeys.detail(id), "matches"] as const,
  // `excludeId` is deliberately not part of the key: it never reaches the API,
  // it only drops one row from the response. Keying on it would give every
  // comparison slot its own copy of the same search results.
  search: (search: string, filters?: PlayerSearchFilters) =>
    [...playersKeys.all, "search", search, filters] as const,
};
