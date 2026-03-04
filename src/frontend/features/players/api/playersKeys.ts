// src/frontend/features/players/api/playersKeys.ts
import type { PlayerFilters } from "../types/PlayerFilters";

export const playersKeys = {
  all: ["players"] as const,
  lists: () => [...playersKeys.all, "list"] as const,
  list: (filters?: PlayerFilters) => [...playersKeys.lists(), filters] as const,
  details: () => [...playersKeys.all, "detail"] as const,
  detail: (id: number) => [...playersKeys.details(), id] as const,
  matches: (id: number) => [...playersKeys.detail(id), "matches"] as const,
};
