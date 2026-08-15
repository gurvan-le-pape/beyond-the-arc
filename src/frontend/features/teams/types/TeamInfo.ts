// src/frontend/features/teams/types/TeamInfo.ts
import type { MatchPlayerWithStats } from "@/features/matches/types";

export interface TeamInfo {
  id: number;
  name: string;
  clubId: number | null;
  clubName: string | null;
  committeeId: number | null;
  leagueId: number | null;
  score: number;
}

export interface TeamInfoExtended extends TeamInfo {
  players: MatchPlayerWithStats[];
  stats: TeamStats;
}

export interface TeamStats {
  [key: string]: string | number | null;
  fieldGoals: string;
  /** Out of 100, or null when there were no attempts. The API sends a number
   *  and no unit — the "%" is added where the value is rendered. */
  fieldGoalPercentage: number | null;
  threePointers: string;
  threePointPercentage: number | null;
  freeThrows: string;
  freeThrowPercentage: number | null;
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
