// src/frontend/features/matches/types/MatchParticipant.ts
import type { PlayerMatchStats } from "@/shared/types/PlayerMatchStats";

// A player reference as it appears inside a match (no circular team/stats references)
export interface MatchParticipantPlayer {
  id: number;
  name: string;
  number: number;
  teamId: number;
}

// Mirrors the { player, stats } shape used in both MatchHistoryDto and TeamMatchHistoryDto
export interface MatchParticipant {
  player: MatchParticipantPlayer;
  stats: PlayerMatchStats;
}
