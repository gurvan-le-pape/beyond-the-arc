// src/backend/modules/matches/match-period.ts

/** A quarter's length in seconds. */
export const QUARTER_SECONDS = 600;
/** Regulation quarters; periods after these are overtimes. */
export const REGULATION_QUARTERS = 4;
/** An overtime period's length in seconds. */
export const OVERTIME_SECONDS = 300;

const REGULATION_SECONDS = QUARTER_SECONDS * REGULATION_QUARTERS;

/** Where an event falls on the game clock. */
export interface MatchClock {
  /** 1–4 for the quarters, 5 for the first overtime, 6 for the second… */
  readonly period: number;
  /** Whole seconds left in the period, as a scoreboard counts them down. */
  readonly secondsLeft: number;
}

/**
 * Seconds of game time from tip-off to the buzzer that ends a period.
 *
 * @param period - 1-based period
 * @returns the buzzer's offset from tip-off
 */
function periodEndSeconds(period: number): number {
  if (period <= REGULATION_QUARTERS) return period * QUARTER_SECONDS;
  return REGULATION_SECONDS + (period - REGULATION_QUARTERS) * OVERTIME_SECONDS;
}

/**
 * The period an event belongs to, and the time left in it.
 *
 * The simulator encodes the game clock in the timestamp — `occurredAt` is
 * `startsAt` plus game seconds, with no stoppages — so both are functions of
 * elapsed time. Each period is `(start, buzzer]`: the `quarter_end` emitted
 * on a buzzer belongs to the period it closes, with 0 s left, and the tip-off
 * at 0 s to the first quarter, with all of it left. These lengths must match
 * `QUARTER_LENGTH` and `OVERTIME_LENGTH` in the simulator
 * (`db/python/simulation/match_simulator.py`).
 *
 * @param occurredAt - when the event happened
 * @param startsAt - the match's tip-off
 * @returns the 1-based period and the whole seconds left in it; an event
 *   before tip-off is put at the start of the first quarter
 */
export function matchClock(occurredAt: Date, startsAt: Date): MatchClock {
  const elapsed = Math.max(
    0,
    Math.floor((occurredAt.getTime() - startsAt.getTime()) / 1000),
  );
  const period =
    elapsed <= REGULATION_SECONDS
      ? Math.max(1, Math.ceil(elapsed / QUARTER_SECONDS))
      : REGULATION_QUARTERS +
        Math.ceil((elapsed - REGULATION_SECONDS) / OVERTIME_SECONDS);
  return { period, secondsLeft: periodEndSeconds(period) - elapsed };
}
