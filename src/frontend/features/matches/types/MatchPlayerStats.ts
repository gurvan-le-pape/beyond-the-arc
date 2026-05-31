// src/frontend/features/matches/types/MatchPlayerStats.ts
import type { Position } from "@/shared/constants";
import type { PlayerMatchStats } from "@/shared/types";

export interface MatchPlayerWithTeamRef {
  id: number;
  name: string;
  number: number;
  position: Position;
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
