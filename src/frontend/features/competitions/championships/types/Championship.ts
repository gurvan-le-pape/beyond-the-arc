// src/frontend/features/competitions/championships/types/Championship.ts
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

export interface Championship {
  id: number;
  name: string;
  category: Category;
  gender: Gender;
  seasonYear: string;
  level: CompetitionLevel;
  division: number;
}
