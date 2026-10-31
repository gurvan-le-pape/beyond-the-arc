// src/frontend/features/competitions/championships/api/championshipsKeys.ts
import type { ChampionshipFilters } from "@/features/competitions/championships/types";

export const championshipsKeys = {
  all: ["championships"] as const,
  lists: () => [...championshipsKeys.all, "list"] as const,
  list: (filters?: ChampionshipFilters) =>
    [...championshipsKeys.lists(), filters] as const,
};
