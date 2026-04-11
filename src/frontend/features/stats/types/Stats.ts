// src/frontend/features/stats/types/Stats.ts
export interface Stats {
  clubs: number;
  teams: number;
  players: number;
  matches: number;
  leagues: number;
  committees: number;
  championshipsByLevel: {
    national: number;
    regional: number;
    departmental: number;
  };
}
