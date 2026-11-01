// src/frontend/features/matches/components/detail/match-events/gameClock.ts
import type { MatchEvent } from "@/features/matches/types";

/** How many periods a match has before overtime. */
export const REGULATION_QUARTERS = 4;

/**
 * Which overtime a period is.
 *
 * @param period - 1-based period
 * @returns 1 for the first overtime, 2 for the second…; `null` for a regulation quarter
 */
export function overtimeNumber(period: number): number | null {
  return period > REGULATION_QUARTERS ? period - REGULATION_QUARTERS : null;
}

/**
 * Whole seconds of game time from tip-off to an event.
 *
 * @param occurredAt - when the event happened
 * @param tipOff - when the match started; the API's event times are game time counted from it
 * @returns the seconds elapsed, rounded down
 */
export function gameSeconds(
  occurredAt: Date | string,
  tipOff: Date | string,
): number {
  return Math.floor(
    (new Date(occurredAt).getTime() - new Date(tipOff).getTime()) / 1000,
  );
}

/**
 * The game clock as a scoreboard shows it.
 *
 * @param secondsLeft - whole seconds left in the period, from the event's `secondsLeft`
 * @returns `m:ss`
 */
export function formatClock(secondsLeft: number): string {
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");
  return `${Math.floor(secondsLeft / 60)}:${seconds}`;
}

/** Where a period ends on the match's time axis. */
export interface PeriodEnd {
  readonly period: number;
  /** Game seconds from tip-off to the period's buzzer. */
  readonly seconds: number;
}

/**
 * When each period's buzzer sounds, read off the events rather than off
 * period lengths the frontend would have to know: an event's elapsed time
 * plus the time left on its clock lands on its period's buzzer.
 *
 * @param events - the match's events
 * @param tipOff - when the match started
 * @returns one entry per period with an event, in period order
 */
export function periodEnds(
  events: readonly MatchEvent[],
  tipOff: Date | string,
): PeriodEnd[] {
  const ends = new Map<number, number>();
  for (const event of events) {
    if (ends.has(event.period)) continue;
    ends.set(
      event.period,
      gameSeconds(event.occurredAt, tipOff) + event.secondsLeft,
    );
  }
  return [...ends]
    .sort(([a], [b]) => a - b)
    .map(([period, seconds]) => ({ period, seconds }));
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
