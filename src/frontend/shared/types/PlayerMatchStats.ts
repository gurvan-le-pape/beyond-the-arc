// src/frontend/shared/types/PlayerMatchStats.ts
export interface PlayerMatchStats {
  points: number;
  fouls: number;
  threePointsMade: number;
  threePointsAttempted: number;
  twoPointsIntMade: number;
  twoPointsIntAttempted: number;
  twoPointsExtMade: number;
  twoPointsExtAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  assists: number;
  turnovers: number;
  rebounds: {
    total: number;
    offensive: number;
    defensive: number;
  };
  steals: number;
  blocks: number;
  playtime?: number; // present in match context, absent in player history context
  playtimeIntervals: number[][] | null;
}
