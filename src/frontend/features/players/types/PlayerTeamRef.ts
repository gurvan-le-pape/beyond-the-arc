// src/frontend/features/players/types/PlayerTeamRef.ts
import type { Category, Gender } from "@/shared/constants";

export interface PlayerLeagueRef {
  id: number;
  name: string;
}

export interface PlayerCommitteeRef {
  id: number;
  name: string;
  league: PlayerLeagueRef;
}

export interface PlayerClubRef {
  id: number;
  name: string;
  committee: PlayerCommitteeRef;
}

export interface PlayerChampionshipRef {
  id: number;
  name: string;
  level: string;
  division: number;
}

export interface PlayerPoolRef {
  id: number;
  name: string;
  championship: PlayerChampionshipRef;
}

export interface PlayerTeamRef {
  id: number;
  number: number;
  clubId: number;
  category: Category;
  gender: Gender;
  club: PlayerClubRef;
  pool: PlayerPoolRef | null;
}
