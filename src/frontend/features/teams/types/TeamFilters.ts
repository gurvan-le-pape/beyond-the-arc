// src/frontend/features/teams/types/TeamFilters.ts

import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

export interface TeamFilters {
  clubId?: number;
  number?: number;
  category?: Category;
  gender?: Gender;
  level?: CompetitionLevel;
  committeeId?: number;
  leagueId?: number;
  division?: number;
  poolId?: number;
  page?: number;
  limit?: number;
}
