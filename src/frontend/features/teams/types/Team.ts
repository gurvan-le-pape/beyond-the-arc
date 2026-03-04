// src/frontend/features/teams/types/Team.ts
import type { Category, Gender } from "@/shared/constants";

import type { TeamClubRef } from "./TeamClubRef";
import type { TeamPoolRef } from "./TeamPoolRef";

export interface Team {
  id: number;
  number: number;
  clubId: number;
  category: Category;
  gender: Gender;
  color: string | null;
  poolId: number | null;
  club: TeamClubRef;
  pool: TeamPoolRef | null;
  _count: {
    players: number;
  };
}
