// src/frontend/features/matches/types/MatchParticipant.ts
import type { Position } from "@/shared/constants";
import type { PlayerMatchStats } from "@/shared/types";

// A player reference as it appears inside a match (no circular team/stats references)
export interface MatchParticipantPlayer {
  id: number;
  name: string;
  number: number;
  position: Position;
  teamId: number;
}

// Mirrors the { player, stats } shape used in both MatchHistoryDto and TeamMatchHistoryDto
export interface MatchParticipant {
  player: MatchParticipantPlayer;
  stats: PlayerMatchStats;
}
