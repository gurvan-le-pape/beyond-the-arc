// src/frontend/features/matches/types/MatchEvent.ts
import type { EventType, Role } from "@/shared/constants";

export interface MatchEventPlayerRef {
  id: number;
  name: string;
  number: number | null;
  team: {
    id: number;
    club: {
      name: string | null;
    };
  };
}

export interface MatchEventPlayer {
  role: Role;
  player: MatchEventPlayerRef;
}

export interface ShotLocation {
  id: number;
  x: number;
  y: number;
}

export interface MatchEvent {
  id: number;
  matchId?: number;
  eventType: EventType;
  timestamp: Date;
  description: string | null;
  players: MatchEventPlayer[];
  shotLocation: ShotLocation | null;
}
