// src/frontend/features/competitions/championships/types/ChampionshipFilters.ts
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

export type ChampionshipFilters = {
  level?: CompetitionLevel;
  id?: number;
  category?: Category;
  gender?: Gender;
  page?: number;
  limit?: number;
};
