// src/frontend/features/matches/types/MatchDetail.ts
import type { Match } from "./Match";
import type { MatchEvent } from "./MatchEvent";

export interface MatchDetail extends Match {
  matchEvents: MatchEvent[];
}
