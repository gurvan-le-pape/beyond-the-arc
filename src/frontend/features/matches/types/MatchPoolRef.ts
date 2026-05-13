// src/frontend/features/matches/types/MatchPoolRef.ts
import type { Category } from "@/shared/constants";
import type { CompetitionLevel } from "@/shared/constants";
import type { Gender } from "@/shared/constants";

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
