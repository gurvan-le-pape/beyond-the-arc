// src/frontend/features/matches/components/detail/match-events/matchEventsView.ts
import { eventCategories, Quarter } from "@/features/matches/constants";
import type { MatchEvent } from "@/features/matches/types";
import {
  getEventStyle,
  getTeamIdFromEvent,
  pointsForEvent,
} from "@/features/matches/utils";
import { EventCategory } from "@/shared/constants";

/** An event with the running score after it and its team. */
export type ScoredMatchEvent = MatchEvent & {
  readonly homeScore: number;
  readonly awayScore: number;
  readonly teamId: number | undefined;
};

const REGULATION_QUARTERS = 4;

// The simulator's period lengths (QUARTER_LENGTH and OVERTIME_LENGTH in
// db/python/simulation/match_simulator.py). The API carries no clock, only
// when each event happened, so a change there must be mirrored here.
const QUARTER_SECONDS = 600;
const OVERTIME_SECONDS = 300;

/**
 * Seconds of game time elapsed when the given period's buzzer sounds.
 *
 * @param period - 1-based period; 5 and above are overtimes
 * @returns the buzzer's offset from tip-off, in seconds
 */
function periodEndSeconds(period: number): number {
  if (period <= REGULATION_QUARTERS) return period * QUARTER_SECONDS;
  return (
    REGULATION_QUARTERS * QUARTER_SECONDS +
    (period - REGULATION_QUARTERS) * OVERTIME_SECONDS
  );
}

/**
 * A period's short name: `Q1`–`Q4`, then the overtime label, numbered from the
 * second overtime on (`OT`, `OT 2`).
 *
 * @param period - 1-based period
 * @param overtime - the translated overtime abbreviation
 * @returns the label to show beside the clock
 */
export function periodLabel(period: number, overtime: string): string {
  if (period <= REGULATION_QUARTERS) return `Q${period}`;
  const nth = period - REGULATION_QUARTERS;
  return nth === 1 ? overtime : `${overtime} ${nth}`;
}

/**
 * The game clock at an event, as a scoreboard shows it: the time left in the
 * event's period, counting down.
 *
 * @param occurredAt - when the event happened
 * @param tipOff - when the match started; the API's event times are game time counted from it
 * @param period - the event's 1-based period
 * @returns `m:ss`, never negative: an event stamped past its buzzer reads `0:00`
 */
export function periodClock(
  occurredAt: Date | string,
  tipOff: Date | string,
  period: number,
): string {
  const elapsed = Math.floor(
    (new Date(occurredAt).getTime() - new Date(tipOff).getTime()) / 1000,
  );
  const left = Math.max(0, periodEndSeconds(period) - elapsed);
  const seconds = (left % 60).toString().padStart(2, "0");
  return `${Math.floor(left / 60)}:${seconds}`;
}

/**
 * Whether the match went past regulation.
 *
 * @param events - the match's events
 * @returns true when any event lies in an overtime period
 */
export function hasOvertime(events: readonly MatchEvent[]): boolean {
  return events.some((event) => event.period > REGULATION_QUARTERS);
}

/**
 * Whether an event's period belongs to the chosen quarter.
 *
 * @param quarter - the reader's choice; `OT` covers every overtime period
 * @param period - the event's 1-based period from the API
 * @returns true when the event should be shown for that quarter
 */
function isInQuarter(quarter: Quarter, period: number): boolean {
  switch (quarter) {
    case Quarter.ALL:
      return true;
    case Quarter.OT:
      return period > REGULATION_QUARTERS;
    default:
      return period === Number.parseInt(quarter.replace("Q", ""));
  }
}

/** What the reader has narrowed the timeline to. */
export interface MatchEventsFilter {
  readonly quarter: Quarter;
  readonly category: EventCategory | undefined;
  readonly playerIds: ReadonlySet<number>;
  readonly latestFirst: boolean;
}

/**
 * Each event with the score after it, in one pass: a made shot adds its
 * points to the side whose team made it.
 *
 * @param events - the match's events, in order
 * @param homeTeamId - the home side's team id
 * @param awayTeamId - the away side's team id
 * @returns the events, in the same order, with score and team
 */
export function scoreEvents(
  events: readonly MatchEvent[],
  homeTeamId: number,
  awayTeamId: number,
): ScoredMatchEvent[] {
  let homeScore = 0;
  let awayScore = 0;

  return events.map((event) => {
    const style = getEventStyle(event.eventType);
    const teamId = getTeamIdFromEvent(event);

    if (style.eventCategory === EventCategory.MADE) {
      const points = pointsForEvent(event.eventType, style);
      if (teamId === homeTeamId) homeScore += points;
      else if (teamId === awayTeamId) awayScore += points;
    }

    return { ...event, homeScore, awayScore, teamId };
  });
}

/**
 * The events the timeline shows: those of the chosen quarter, category and
 * players, newest first if asked.
 *
 * @param events - the scored events, in match order
 * @param filter - the reader's choices; an empty player set keeps every player
 * @returns the events to show
 */
export function filterEvents(
  events: readonly ScoredMatchEvent[],
  filter: MatchEventsFilter,
): ScoredMatchEvent[] {
  const allowedTypes =
    filter.category === undefined
      ? undefined
      : (eventCategories[filter.category] ?? []);

  const result = events.filter(
    (event) =>
      isInQuarter(filter.quarter, event.period) &&
      (allowedTypes === undefined || allowedTypes.includes(event.eventType)) &&
      (filter.playerIds.size === 0 ||
        (event.players ?? []).some((p) => filter.playerIds.has(p.player.id))),
  );

  return filter.latestFirst ? result.reverse() : result;
}
