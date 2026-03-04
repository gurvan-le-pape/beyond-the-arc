// src/frontend/features/matches/types/MatchPoolRef.ts
import type { Category } from "@/shared/constants/categories";
import type { CompetitionLevel } from "@/shared/constants/competition-levels";
import type { Gender } from "@/shared/constants/genders";

export interface MatchChampionshipRef {
  id: number;
  category: Category;
  gender: Gender;
  level: CompetitionLevel;
  division: number;
}

export interface MatchPoolRef {
  id: number;
  name: string;
  championship: MatchChampionshipRef;
}
