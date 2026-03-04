// src/frontend/features/teams/types/TeamDetail.ts
import type { Team } from "./Team";

export interface TeamPlayerRef {
  id: number;
  name: string;
  number: number;
  teamId: number;
}

export interface TeamMatchClubRef {
  id: number;
  name: string;
}

export interface TeamMatchTeamRef {
  id: number;
  number: number;
  club: TeamMatchClubRef;
}

export interface TeamMatchPoolRef {
  id: number;
  name: string;
  championship: { id: number; name: string };
}

export interface TeamHomeMatch {
  id: number;
  date: Date;
  homeTeamScore: number;
  awayTeamScore: number;
  awayTeam: TeamMatchTeamRef;
  pool: TeamMatchPoolRef | null;
}

export interface TeamAwayMatch {
  id: number;
  date: Date;
  homeTeamScore: number;
  awayTeamScore: number;
  homeTeam: TeamMatchTeamRef;
  pool: TeamMatchPoolRef | null;
}

export interface TeamDetail extends Team {
  players: TeamPlayerRef[];
  homeMatches: TeamHomeMatch[];
  awayMatches: TeamAwayMatch[];
}
