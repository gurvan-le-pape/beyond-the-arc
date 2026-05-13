// src/frontend/features/organizations/clubs/types/ClubDetailed.ts
import type { Category, Gender } from "@/shared/constants";
import type { President } from "@/shared/types";

export interface ClubTeamLeaderboard {
  rank: number | null;
  poolSize: number | null;
  points: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  pointDifference: number;
  poolId: number;
}

export interface ClubChampionshipInfo {
  id: number;
  name: string;
  level: string;
  division: number;
  committeeId: number | null;
  leagueId: number | null;
}

export interface ClubPoolInfo {
  id: number;
  name: string;
  championship: ClubChampionshipInfo;
}

export interface ClubTeamInfo {
  id: number;
  number: number;
  category: Category;
  gender: Gender;
  pool: ClubPoolInfo | null;
  leaderboard: ClubTeamLeaderboard | null;
}

export interface ClubDetailed {
  id: number;
  name: string;
  city: string | null;
  zipCode: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  teams: ClubTeamInfo[];
  president: President;
}
