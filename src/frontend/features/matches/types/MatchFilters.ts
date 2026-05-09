// src/frontend/features/matches/types/MatchFilters.ts

import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

export interface MatchFilters {
  search?: string;
  date?: string;
  category?: Category;
  gender?: Gender;
  level?: CompetitionLevel;
  division?: number;
  committeeId?: number;
  leagueId?: number;
  poolId?: number;
  championshipId?: number;
  matchday?: number;
  page?: number;
  limit?: number;
}
