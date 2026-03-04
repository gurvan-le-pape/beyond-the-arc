// src/frontend/features/matches/types/EventWithScore.ts
import type { MatchEvent } from "./MatchEvent";

/**
 * A MatchEvent enriched with the cumulative score at that point in the match,
 * the resolved owning team-id, and the 1-based quarter number.
 */
export interface EventWithScore extends MatchEvent {
  homeScore: number;
  awayScore: number;
  teamId?: number;
  quarter: number;
}
