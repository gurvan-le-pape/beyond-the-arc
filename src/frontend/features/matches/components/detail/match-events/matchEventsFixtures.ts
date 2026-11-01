// src/frontend/features/matches/components/detail/match-events/matchEventsFixtures.ts
import type { MatchEvent } from "@/features/matches/types";
import { EventType, Role } from "@/shared/constants";

import { groupPlays, type Play, scoreEvents } from "./plays";

/** The tip-off of the specs' match: event times count from it. */
export const TIP_OFF = "2026-10-01T18:00:00.000Z";
/** The home side's team id. */
export const HOME = 1;
/** The away side's team id. */
export const AWAY = 2;

/**
 * An event by one player, at tip-off.
 *
 * @param id - the event's id
 * @param eventType - its type, from `EventType`
 * @param role - the player's role in it, from `Role`
 * @param playerId - the player's id
 * @param teamId - the player's team, `HOME` or `AWAY`
 * @param period - its 1-based period
 * @returns the event, with only the fields the view code reads
 */
export function event(
  id: number,
  eventType: string,
  role: string,
  playerId: number,
  teamId: number,
  period: number,
): MatchEvent {
  return {
    id,
    eventType,
    occurredAt: TIP_OFF,
    period,
    players: [{ role, player: { id: playerId, team: { id: teamId } } }],
  } as unknown as MatchEvent;
}

/** Five events over three quarters, ending 4–3 to the home side. */
export const EVENTS = [
  event(1, EventType.MADE_LAYUP, Role.SHOOTER, 10, HOME, 1),
  event(2, EventType.MADE_STEP_BACK_THREE, Role.SHOOTER, 20, AWAY, 1),
  event(3, EventType.MISSED_LAYUP, Role.SHOOTER, 10, HOME, 2),
  event(4, EventType.STEAL, Role.STEALER, 20, AWAY, 2),
  event(5, EventType.MADE_LAYUP, Role.SHOOTER, 11, HOME, 3),
];

/**
 * The match's plays, from its events.
 *
 * @param events - the events, in match order
 * @returns the plays `groupPlays` folds them into
 */
export function playsOf(events: readonly MatchEvent[]): Play[] {
  return groupPlays(scoreEvents(events, HOME, AWAY));
}

/**
 * Baskets in a row, all in Q4.
 *
 * @param scores - each basket as its team and its points
 * @returns one play per basket
 */
export function baskets(...scores: [number, 2 | 3][]): Play[] {
  return playsOf(
    scores.map(([teamId, points], index) =>
      event(
        index + 1,
        points === 3 ? EventType.MADE_STEP_BACK_THREE : EventType.MADE_LAYUP,
        Role.SHOOTER,
        teamId * 10,
        teamId,
        4,
      ),
    ),
  );
}
