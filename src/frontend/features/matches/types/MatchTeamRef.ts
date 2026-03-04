// src/frontend/features/matches/types/MatchTeamRef.ts
export interface MatchClubRef {
  id: number;
  name: string | null;
}

export interface MatchTeamRef {
  id: number;
  number: number;
  club: MatchClubRef;
}
