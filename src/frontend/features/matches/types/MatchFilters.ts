// src/frontend/features/matches/types/MatchFilters.ts

import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

export interface MatchFilters {
  level?: CompetitionLevel;
  division?: number;
  committeeId?: number;
  leagueId?: number;
  category?: Category;
  gender?: Gender;
  poolId?: number;
  championshipId?: number;
  matchday?: number;
  date?: string;
  search?: string;
  page?: number;
  limit?: number;
}
