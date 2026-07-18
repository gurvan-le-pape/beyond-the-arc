// src/frontend/features/players/types/PlayerFilters.ts
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

export interface PlayerFilters {
  search?: string;
  clubId?: number;
  category?: Category;
  gender?: Gender;
  number?: number;
  teamNumber?: number;
  level?: CompetitionLevel;
  committeeId?: number;
  leagueId?: number;
  page?: number;
  limit?: number;
}
