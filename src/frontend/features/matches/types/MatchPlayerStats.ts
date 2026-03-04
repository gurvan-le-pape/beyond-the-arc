// src/frontend/features/matches/types/MatchPlayerStats.ts
import type { PlayerMatchStats } from "@/shared/types/PlayerMatchStats";

export interface MatchPlayerWithTeamRef {
  id: number;
  name: string;
  number: number;
  teamId: number;
  team: {
    id: number;
    number: number;
    club: {
      id: number;
      name: string | null;
    };
  };
}

export interface MatchPlayerWithStats {
  player: MatchPlayerWithTeamRef;
  stats: PlayerMatchStats;
}

export interface MatchPlayerStatsResponse {
  homeTeamId: number;
  awayTeamId: number;
  stats: MatchPlayerWithStats[];
}
