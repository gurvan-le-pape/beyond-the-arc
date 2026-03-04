// src/frontend/features/competitions/leaderboards/types/Leaderboard.ts
export interface Leaderboard {
  id: number;
  teamId: number;
  teamNumber: number;
  clubName: string;
  points: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesForfeited: number;
  pointsFor: number;
  pointsAgainst: number;
  pointDifference: number;
}
