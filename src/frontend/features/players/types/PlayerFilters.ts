// src/frontend/features/players/types/PlayerFilters.ts
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

export interface PlayerFilters {
  level?: CompetitionLevel;
  clubId?: number;
  teamId?: number;
  teamNumber?: number;
  number?: number;
  committeeId?: number;
  leagueId?: number;
  category?: Category;
  gender?: Gender;
  name?: string;
  page?: number;
  limit?: number;
}
