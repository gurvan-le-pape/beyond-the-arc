// src/frontend/features/teams/types/TeamClubRef.ts
export interface TeamLeagueRef {
  id: number;
  name: string;
}

export interface TeamCommitteRef {
  id: number;
  name: string;
  league: TeamLeagueRef;
}

export interface TeamClubRef {
  id: number;
  name: string;
  committee: TeamCommitteRef;
}
