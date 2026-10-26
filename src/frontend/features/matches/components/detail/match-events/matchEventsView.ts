// src/frontend/features/matches/components/detail/match-events/matchEventsView.ts
import { Quarter } from "@/features/matches/constants";
import type { MatchEvent } from "@/features/matches/types";
import {
  getEventStyle,
  getTeamIdFromEvent,
  pointsForEvent,
} from "@/features/matches/utils";
import { EventCategory, EventType } from "@/shared/constants";

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
 * Which overtime a period is.
 *
 * @param period - 1-based period
 * @returns 1 for the first overtime, 2 for the second…; `null` for a regulation quarter
 */
export function overtimeNumber(period: number): number | null {
  return period > REGULATION_QUARTERS ? period - REGULATION_QUARTERS : null;
}

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

/**
 * The kinds of event the reader can show or hide, in the order the filter
 * offers them. A category left out of this list is always shown, never
 * unreachable: `filterPlays` only hides what is listed here.
 */
export const FILTERABLE_CATEGORIES = [
  EventCategory.MADE,
  EventCategory.MISS,
  EventCategory.FOUL,
  EventCategory.TURNOVER,
  EventCategory.DEFENSIVE,
  EventCategory.REBOUND,
  EventCategory.SUBSTITUTION,
  EventCategory.INBOUND,
] as const satisfies readonly EventCategory[];

/**
 * The categories the timeline opens with. Rebounds, substitutions and
 * inbounds make up about two events in five and are rarely what a reader
 * looks for, so they start hidden.
 */
export const DEFAULT_CATEGORIES: ReadonlySet<EventCategory> = new Set(
  FILTERABLE_CATEGORIES.filter(
    (category) =>
      category !== EventCategory.REBOUND &&
      category !== EventCategory.SUBSTITUTION &&
      category !== EventCategory.INBOUND,
  ),
);

/**
 * The category an event is filtered under.
 *
 * @param event - the event to classify
 * @returns its category; `OTHER` for a type the frontend does not know
 */
export function categoryOf(event: MatchEvent): EventCategory {
  return getEventStyle(event.eventType).eventCategory;
}

/** What the reader has narrowed the timeline to. */
export interface MatchEventsFilter {
  readonly quarter: Quarter;
  /** The filterable categories to show; any other category always shows. */
  readonly categories: ReadonlySet<EventCategory>;
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
}

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
    });
  }
  return plays;
}

/**
 * The plays the timeline shows: those of the chosen quarter with an event of a
 * chosen category by one of the chosen players, newest first if asked. Events
 * outside the filterable categories (the tip-off, an unknown type) pass the
 * category test whatever is chosen.
 * A play matches on any of its events, so a shooting foul whose free throws
 * went in shows under made shots as well as under fouls.
 *
 * @param plays - the match's plays, in match order
 * @param filter - the reader's choices; an empty player set keeps every player
 * @returns the plays to show
 */
export function filterPlays(
  plays: readonly Play[],
  filter: MatchEventsFilter,
): Play[] {
  const filterable: readonly EventCategory[] = FILTERABLE_CATEGORIES;
  const matches = (event: ScoredMatchEvent) => {
    const category = categoryOf(event);
    return (
      (!filterable.includes(category) || filter.categories.has(category)) &&
      (filter.playerIds.size === 0 ||
        (event.players ?? []).some((p) => filter.playerIds.has(p.player.id)))
    );
  };

  const result = plays.filter(
    (play) =>
      isInQuarter(filter.quarter, play.period) &&
      [play.lead, ...play.followers].some(matches),
  );

  return filter.latestFirst ? result.reverse() : result;
}

/** One period's run of the plays the timeline shows, in display order. */
export interface PeriodPlays {
  readonly period: number;
  readonly plays: Play[];
}

/**
 * Splits the plays the timeline shows into one run per period.
 *
 * Works on the filtered, possibly reversed list: a period's plays are
 * contiguous either way, so the runs come out in display order. End-of-period
 * events are dropped, since each period's header already says where it ends.
 *
 * @param plays - the plays to show, in display order
 * @returns one entry per period that has a play left to show; empty when none does
 */
export function groupByPeriod(plays: readonly Play[]): PeriodPlays[] {
  const groups: PeriodPlays[] = [];
  for (const play of plays) {
    if (play.lead.eventType === EventType.QUARTER_END) continue;
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
 * @param events - every scored event of the match, in match order
 * @returns the score of each period that has an event, keyed by its 1-based number
 */
export function scorePeriods(
  events: readonly ScoredMatchEvent[],
): Map<number, PeriodScore> {
  // The last event of a period carries the score at its buzzer.
  const totals = new Map<number, ScoredMatchEvent>();
  for (const event of events) totals.set(event.period, event);

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

/**
 * How many of the match's events fall in each filterable category, whatever
 * else is filtered: the counts the filter shows beside each choice.
 *
 * @param events - every event of the match
 * @returns the count per filterable category; 0 for one with no event
 */
export function countCategories(
  events: readonly MatchEvent[],
): Map<EventCategory, number> {
  const counts = new Map<EventCategory, number>(
    FILTERABLE_CATEGORIES.map((category) => [category, 0]),
  );
  for (const event of events) {
    const category = categoryOf(event);
    const count = counts.get(category);
    if (count !== undefined) counts.set(category, count + 1);
  }
  return counts;
}
