// src/frontend/features/competitions/championships/api/championshipsKeys.ts
import type { ChampionshipFilters } from "@/features/competitions/championships/types/ChampionshipFilters";

export const championshipsKeys = {
  all: ["championships"] as const,
  lists: () => [...championshipsKeys.all, "list"] as const,
  list: (filters?: ChampionshipFilters) =>
    [...championshipsKeys.lists(), filters] as const,
  details: () => [...championshipsKeys.all, "detail"] as const,
  detail: (id: number) => [...championshipsKeys.details(), id] as const,
  divisions: () => [...championshipsKeys.all, "divisions"] as const,
};
