// src/frontend/features/organizations/clubs/types/ClubFilters.ts
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

export interface ClubFilters {
  level?: CompetitionLevel;
  committeeId?: number;
  leagueId?: number;
  category?: Category;
  gender?: Gender;
}
