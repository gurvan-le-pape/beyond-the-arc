// src/frontend/features/teams/types/TeamMatchHistory.ts
import type { Position } from "@/shared/constants";
import type { PlayerMatchStats } from "@/shared/types";

export interface TeamMatchPlayerRef {
  id: number;
  name: string;
  number: number;
  position: Position;
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
