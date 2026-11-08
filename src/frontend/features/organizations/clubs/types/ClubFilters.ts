// src/frontend/features/organizations/clubs/types/ClubFilters.ts
import type { CompetitionLevel } from "@/shared/constants";

export interface ClubFilters {
  level?: CompetitionLevel;
  committeeId?: number;
  leagueId?: number;
  search?: string;
  page?: number;
  limit?: number;
}
