// src/frontend/features/teams/types/TeamInfo.ts
import type { MatchPlayerWithStats } from "@/features/matches/types/MatchPlayerStats";

export interface TeamInfo {
  id: number;
  name: string;
  clubId: number | null;
  clubName: string | null;
  score: number;
}

export interface TeamInfoExtended extends TeamInfo {
  players: MatchPlayerWithStats[];
  stats: TeamStats;
}

export interface TeamStats {
  [key: string]: string | number;
  fieldGoals: string;
  fieldGoalPercentage: string;
  threePointers: string;
  threePointPercentage: string;
  freeThrows: string;
  freeThrowPercentage: string;
  reboundsTotal: number;
  reboundsOffensive: number;
  reboundsDefensive: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  pointsInPaint: number;
}
