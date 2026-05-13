// src/frontend/features/matches/types/MatchPoolRef.ts
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

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
