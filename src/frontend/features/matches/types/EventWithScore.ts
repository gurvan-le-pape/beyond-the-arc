// src/frontend/features/matches/types/EventWithScore.ts
import type { MatchEvent } from "./MatchEvent";

/**
 * A MatchEvent enriched with the cumulative score at that point in the match,
 * and the resolved owning team-id.
 */
export interface EventWithScore extends MatchEvent {
  homeScore: number;
  awayScore: number;
  teamId?: number;
}
