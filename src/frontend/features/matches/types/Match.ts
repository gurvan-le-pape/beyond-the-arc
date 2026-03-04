// src/frontend/features/matches/types/Match.ts
import type { MatchPoolRef } from "./MatchPoolRef";
import type { MatchTeamRef } from "./MatchTeamRef";

export interface Match {
  id: number;
  date: Date;
  matchday: number;
  pool: MatchPoolRef | null;
  homeTeam: MatchTeamRef;
  awayTeam: MatchTeamRef;
  homeTeamScore: number;
  awayTeamScore: number;
  forfeit: boolean;
}
