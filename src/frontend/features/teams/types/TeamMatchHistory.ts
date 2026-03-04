// src/frontend/features/teams/types/TeamMatchHistory.ts
import type { PlayerMatchStats } from "@/shared/types/PlayerMatchStats";

export interface TeamMatchPlayerRef {
  id: number;
  name: string;
  number: number;
  teamId: number;
}

export interface TeamMatchParticipant {
  player: TeamMatchPlayerRef;
  stats: PlayerMatchStats;
}

export interface TeamMatchHistoryTeamRef {
  id: number;
  number: number;
  club: { id: number; name: string };
}

export interface TeamMatchHistory {
  id: number;
  date: Date;
  homeTeam: TeamMatchHistoryTeamRef;
  awayTeam: TeamMatchHistoryTeamRef;
  homeTeamScore: number;
  awayTeamScore: number;
  players: TeamMatchParticipant[];
}
