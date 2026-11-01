// src/frontend/features/matches/components/detail/match-events/event-timeline/periods.ts
import type { Play } from "../plays";

/** One period's run of the plays the timeline shows, in display order. */
export interface PeriodPlays {
  readonly period: number;
  readonly plays: Play[];
}

/**
 * Splits the plays the timeline shows into one run per period.
 *
 * Works on the filtered, possibly reversed list: a period's plays are
 * contiguous either way, so the runs come out in display order.
 *
 * @param plays - the plays to show, in display order
 * @returns one entry per period that has a play to show; empty when none does
 */
export function groupByPeriod(plays: readonly Play[]): PeriodPlays[] {
  const groups: PeriodPlays[] = [];
  for (const play of plays) {
    const last = groups[groups.length - 1];
    if (last?.period === play.period) last.plays.push(play);
    else groups.push({ period: play.period, plays: [play] });
  }
  return groups;
}

/** A period's own points per side, and the match score at its buzzer. */
export interface PeriodScore {
  readonly home: number;
  readonly away: number;
  readonly homeTotal: number;
  readonly awayTotal: number;
}

/**
 * Each period's score, from the whole match rather than a filtered subset.
 *
 * @param plays - every play of the match, in match order
 * @returns the score of each period that has a play, keyed by its 1-based number
 */
export function scorePeriods(plays: readonly Play[]): Map<number, PeriodScore> {
  // The last play of a period carries the score at its buzzer.
  const totals = new Map<number, Play>();
  for (const play of plays) totals.set(play.period, play);

  const scores = new Map<number, PeriodScore>();
  let previous = { homeScore: 0, awayScore: 0 };
  for (const [period, last] of [...totals].sort(([a], [b]) => a - b)) {
    scores.set(period, {
      home: last.homeScore - previous.homeScore,
      away: last.awayScore - previous.awayScore,
      homeTotal: last.homeScore,
      awayTotal: last.awayScore,
    });
    previous = last;
  }
  return scores;
}
