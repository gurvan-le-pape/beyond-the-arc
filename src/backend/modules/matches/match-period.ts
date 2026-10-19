// src/backend/modules/matches/match-period.ts

/** A quarter's length in seconds. */
export const QUARTER_SECONDS = 600;
/** Regulation quarters; periods after these are overtimes. */
export const REGULATION_QUARTERS = 4;
/** An overtime period's length in seconds. */
export const OVERTIME_SECONDS = 300;

const REGULATION_SECONDS = QUARTER_SECONDS * REGULATION_QUARTERS;

/**
 * The period an event belongs to: 1–4 for the quarters, 5 for the first
 * overtime, 6 for the second, and so on.
 *
 * The simulator encodes the game clock in the timestamp — `occurredAt` is
 * `startsAt` plus game seconds, with no stoppages — so the period is a
 * function of elapsed time. Each period is `(start, buzzer]`: the
 * `quarter_end` emitted on a buzzer belongs to the period it closes, and the
 * tip-off at 0 s to the first quarter. These lengths must match
 * `QUARTER_LENGTH` and `OVERTIME_LENGTH` in the simulator
 * (`db/python/simulation/match_simulator.py`).
 *
 * @param occurredAt - when the event happened
 * @param startsAt - the match's tip-off
 * @returns the 1-based period; an event before tip-off is put in the first
 */
export function matchPeriod(occurredAt: Date, startsAt: Date): number {
  const elapsed = Math.floor(
    (occurredAt.getTime() - startsAt.getTime()) / 1000,
  );
  if (elapsed <= REGULATION_SECONDS) {
    return Math.max(1, Math.ceil(elapsed / QUARTER_SECONDS));
  }
  return (
    REGULATION_QUARTERS +
    Math.ceil((elapsed - REGULATION_SECONDS) / OVERTIME_SECONDS)
  );
}
