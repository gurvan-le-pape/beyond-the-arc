// src/frontend/features/players/types/PlayerMatchHistory.ts
import type { PlayerMatchStats } from "@/shared/types/PlayerMatchStats";

export interface PlayerMatchHistoryTeamRef {
  id: number;
  number: number;
  club: {
    id: number;
    name: string;
  };
}

export interface PlayerMatchHistoryEntry {
  player: {
    id: number;
    name: string;
    number: number;
    teamId: number;
  };
  stats: PlayerMatchStats;
}

export interface PlayerMatchHistory {
  id: number;
  date: Date;
  homeTeam: PlayerMatchHistoryTeamRef;
  awayTeam: PlayerMatchHistoryTeamRef;
  homeTeamScore: number;
  awayTeamScore: number;
  player: PlayerMatchHistoryEntry;
}
