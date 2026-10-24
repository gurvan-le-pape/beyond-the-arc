// src/frontend/features/matches/types/MatchTeam.ts
import type { MatchPlayerWithStats } from "./MatchPlayerStats";

export interface MatchTeam {
  id: number;
  name: string;
  clubId: number | null;
  clubName: string | null;
  committeeId: number | null;
  leagueId: number | null;
  /** The final score, `null` while the match has not been played. */
  score: number | null;
}

export interface MatchTeamWithStats extends MatchTeam {
  players: MatchPlayerWithStats[];
  stats: MatchTeamStats;
}

export interface MatchTeamStats {
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
