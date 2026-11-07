// src/frontend/features/matches/components/detail/match-events/plays.ts
import type { MatchEvent } from "@/features/matches/types";
import {
  getEventStyle,
  getTeamIdFromEvent,
  pointsForEvent,
} from "@/features/matches/utils";
import { EventCategory, EventType } from "@/shared/constants";

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

/**
 * Whether the match went past regulation.
 *
 * @param events - the match's events
 * @returns true when any event lies in an overtime period
 */
export function hasOvertime(events: readonly MatchEvent[]): boolean {
  return events.some((event) => event.period > REGULATION_QUARTERS);
}

/** An event with the running score after it and its team. */
export type ScoredMatchEvent = MatchEvent & {
  readonly homeScore: number;
  readonly awayScore: number;
  readonly teamId: number | undefined;
};

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

// The fouls whose free throws are shot at the same instant, and so belong in
// the same row.
const FOULS_WITH_FREE_THROWS: readonly string[] = [
  EventType.THREE_POINT_SHOOTING_FOUL,
  EventType.TWO_POINT_EXT_SHOOTING_FOUL,
  EventType.TWO_POINT_INT_SHOOTING_FOUL,
  EventType.THREE_POINT_AND_1,
  EventType.TWO_POINT_EXT_AND_1,
  EventType.TWO_POINT_INT_AND_1,
];
const FREE_THROWS: readonly string[] = [
  EventType.FREE_THROW_MADE,
  EventType.FREE_THROW_MISSED,
];

/**
 * One row of the timeline: an event, and the events at the same instant that
 * only complete it.
 */
/**
 * One jump to a play. Each jump is a new object, so jumping to the same play
 * again still scrolls to it and restarts its highlight.
 */
export interface PlayReveal {
  /** The lead event id of the play jumped to. */
  readonly playId: number;
}

export interface Play {
  /** The event the row is about: its type gives the row's label and icon. */
  readonly lead: ScoredMatchEvent;
  /**
   * The free throws after a shooting foul or an and-one, or the other
   * substitutions one team made at once. Empty for an event on its own.
   */
  readonly followers: readonly ScoredMatchEvent[];
  readonly period: number;
  /** The score once the whole play is over. */
  readonly homeScore: number;
  readonly awayScore: number;
  /**
   * The side the play belongs to: the free-throw shooter's after a foul, so a
   * shooting foul sits with the team it scored for.
   */
  readonly teamId: number | undefined;
  /** The side that scored in the play; `undefined` when nobody did. */
  readonly scoringTeamId: number | undefined;
  /**
   * What the play did to the lead: took it from the side that had it, or
   * levelled the score. `null` for a play that did neither, including the
   * first basket of the match, which takes a lead nobody had.
   */
  readonly swing: "leadChange" | "tie" | null;
  /**
   * The run this play's basket closed, when it is the last basket of one:
   * `RUN_MIN_POINTS` or more points in a row by one side. `null` otherwise.
   */
  readonly runEnded: Run | null;
}

/** Points scored in a row by one side, with nothing scored by the other. */
export interface Run {
  readonly teamId: number;
  readonly points: number;
}

/**
 * The shortest scoring streak the timeline calls a run. Commentary starts
 * naming one around 7–0; below that, a few baskets in a row are just the
 * game going back and forth.
 */
export const RUN_MIN_POINTS = 7;

/**
 * The game second an event happened in.
 *
 * @param event - the event to place
 * @returns whole seconds since the epoch
 */
function secondOf(event: MatchEvent): number {
  return Math.floor(new Date(event.occurredAt).getTime() / 1000);
}

/**
 * Whether `next` completes the play `lead` opens: a free throw after a foul
 * that awards them, or another substitution by the same team, in the same
 * second. The simulator stamps a whole trip to the line with one game second,
 * each event a millisecond after the last to keep their order, so the
 * comparison is by second, never by exact time.
 *
 * @param lead - the event opening the play
 * @param next - the event right after the play so far
 * @returns true when `next` belongs in the same row
 */
function completes(lead: ScoredMatchEvent, next: ScoredMatchEvent): boolean {
  if (secondOf(next) !== secondOf(lead)) return false;
  if (FOULS_WITH_FREE_THROWS.includes(lead.eventType)) {
    return FREE_THROWS.includes(next.eventType);
  }
  return (
    lead.eventType === EventType.SUBSTITUTION &&
    next.eventType === EventType.SUBSTITUTION &&
    next.teamId === lead.teamId
  );
}

/**
 * Folds the scored events into the timeline's rows: a shooting foul or an
 * and-one with its free throws, simultaneous substitutions by one team, and
 * every other event on its own.
 *
 * @param events - every scored event of the match, in match order
 * @returns the plays, in match order; every event is in exactly one
 */
export function groupPlays(events: readonly ScoredMatchEvent[]): Play[] {
  const plays: Play[] = [];
  let index = 0;
  while (index < events.length) {
    const lead = events[index];
    const followers: ScoredMatchEvent[] = [];
    index += 1;
    while (index < events.length && completes(lead, events[index])) {
      followers.push(events[index]);
      index += 1;
    }

    const last = followers.length > 0 ? followers[followers.length - 1] : lead;
    const scorer = [lead, ...followers].find(
      (event) =>
        getEventStyle(event.eventType).eventCategory === EventCategory.MADE,
    );
    plays.push({
      lead,
      followers,
      period: lead.period,
      homeScore: last.homeScore,
      awayScore: last.awayScore,
      teamId: followers[0]?.teamId ?? lead.teamId,
      scoringTeamId: scorer?.teamId,
      swing: null,
      runEnded: null,
    });
  }
  return markSwingsAndRuns(plays);
}

/** A streak of points by one side, and the play of its last basket. */
export interface ScoringStreak extends Run {
  readonly last: Play;
}

/**
 * Every streak of the match, however short: the points one side scored
 * before the other scored again. A basket and its free throws in one play
 * add up, and the last streak is closed by the end of the match.
 *
 * @param plays - the match's plays, in match order
 * @returns the streaks, in match order
 */
export function scoringStreaks(plays: readonly Play[]): ScoringStreak[] {
  const streaks: { teamId: number; points: number; last: Play }[] = [];
  let total = 0;
  for (const play of plays) {
    const after = play.homeScore + play.awayScore;
    const points = after - total;
    total = after;
    if (play.scoringTeamId === undefined) continue;

    const open = streaks[streaks.length - 1];
    if (open?.teamId === play.scoringTeamId) {
      open.points += points;
      open.last = play;
    } else {
      streaks.push({ teamId: play.scoringTeamId, points, last: play });
    }
  }
  return streaks;
}

/**
 * Fills in each play's `swing` and `runEnded`, walking the match in order.
 *
 * @param plays - the match's plays, in match order, with neither field set
 * @returns the same plays, in the same order, with both fields set
 */
function markSwingsAndRuns(plays: readonly Play[]): Play[] {
  const swings = new Map<Play, Play["swing"]>();
  let leader = 0;
  for (const play of plays) {
    if (play.scoringTeamId === undefined) continue;
    const now = Math.sign(play.homeScore - play.awayScore);
    if (now === 0) swings.set(play, "tie");
    else if (leader !== 0 && now !== leader) swings.set(play, "leadChange");
    if (now !== 0) leader = now;
  }

  const runs = new Map<Play, Run>();
  for (const { teamId, points, last } of scoringStreaks(plays)) {
    if (points >= RUN_MIN_POINTS) runs.set(last, { teamId, points });
  }

  return plays.map((play) => ({
    ...play,
    swing: swings.get(play) ?? null,
    runEnded: runs.get(play) ?? null,
  }));
}
