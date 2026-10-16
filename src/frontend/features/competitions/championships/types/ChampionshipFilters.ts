// src/frontend/features/competitions/championships/types/ChampionshipFilters.ts
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

export interface ChampionshipFilters {
  level?: CompetitionLevel;
  /**
   * Championships in this league's area: its regional ones and its
   * committees' departmental ones. Pair with `level` for one or the other.
   */
  leagueId?: number;
  /** Championships organised by this committee (departmental). */
  committeeId?: number;
  category?: Category;
  gender?: Gender;
  page?: number;
  limit?: number;
}
