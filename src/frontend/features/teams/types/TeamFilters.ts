// src/frontend/features/teams/types/TeamFilters.ts

import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

export interface TeamFilters {
  clubId?: number;
  level?: CompetitionLevel;
  division?: number;
  committeeId?: number;
  leagueId?: number;
  number?: number;
  category?: Category;
  gender?: Gender;
  clubName?: string;
  poolLetter?: string;
  page?: number;
  limit?: number;
}
