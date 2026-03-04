// src/frontend/features/teams/types/TeamPoolRef.ts
export interface TeamChampionshipRef {
  id: number;
  name: string;
  level: string;
  division: number;
}

export interface TeamPoolRef {
  id: number;
  name: string;
  letter: string;
  championship: TeamChampionshipRef;
}
