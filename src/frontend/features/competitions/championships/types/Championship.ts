// src/frontend/features/competitions/championships/types/Championship.ts
import type { Category, CompetitionLevel, Gender } from "@/shared/constants";

export interface ChampionshipPool {
  id: number;
  letter: string;
  name: string;
  nbMatchdays: number;
}

export interface Championship {
  id: number;
  name: string;
  category: Category;
  gender: Gender;
  seasonYear: string;
  level: CompetitionLevel;
  division: number;
  leagueId: number | null;
  committeeId: number | null;
  committeeName: string | null;
  leagueName: string | null;
  pools: ChampionshipPool[];
}
