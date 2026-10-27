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
interface ScoringStreak extends Run {
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
function scoringStreaks(plays: readonly Play[]): ScoringStreak[] {
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

/** The widest a side's lead got, and the play that took it there. */
export interface BiggestLead {
  readonly margin: number;
  readonly play: Play;
}

/** The shape of the match, in the figures above the timeline. */
export interface MatchSummary {
  /** The plays that took the lead from the side that had it. */
  readonly leadChanges: number;
  /** The plays that levelled the score, the 0–0 start not included. */
  readonly ties: number;
  /** Each side's biggest lead; `null` for a side that never led. */
  readonly biggestLead: {
    readonly home: BiggestLead | null;
    readonly away: BiggestLead | null;
  };
  /**
   * The most points either side scored in a row, the earliest when two
   * streaks tie, whether or not it reaches `RUN_MIN_POINTS`; `null` in a
   * match without a point.
   */
  readonly bestRun: Run | null;
  /**
   * The play after which the winner led for good: its first basket for a
   * wire-to-wire win. `null` when the match ended level.
   */
  readonly decidingPlay: Play | null;
}

/**
 * Each side's biggest lead over the match.
 *
 * @param plays - the match's plays, in match order
 * @returns the widest lead per side and the first play to reach it
 */
function biggestLeads(plays: readonly Play[]): MatchSummary["biggestLead"] {
  let home: BiggestLead | null = null;
  let away: BiggestLead | null = null;
  for (const play of plays) {
    const margin = play.homeScore - play.awayScore;
    if (margin > (home?.margin ?? 0)) home = { margin, play };
    if (-margin > (away?.margin ?? 0)) away = { margin: -margin, play };
  }
  return { home, away };
}

/**
 * The play after which the winner led for good.
 *
 * @param plays - the match's plays, in match order
 * @returns the last play that put the winner ahead; `null` when the match ended level
 */
function findDecidingPlay(plays: readonly Play[]): Play | null {
  const last = plays[plays.length - 1];
  const winner = last ? Math.sign(last.homeScore - last.awayScore) : 0;
  if (winner === 0) return null;

  let deciding: Play | null = null;
  let before = 0;
  for (const play of plays) {
    if (play.scoringTeamId === undefined) continue;
    const now = Math.sign(play.homeScore - play.awayScore);
    if (now === winner && before !== winner) deciding = play;
    before = now;
  }
  return deciding;
}

/**
 * Sums up the match from its plays.
 *
 * @param plays - the match's plays, in match order, as `groupPlays` returns them
 * @returns the match's figures
 */
export function summarizeMatch(plays: readonly Play[]): MatchSummary {
  const bestRun = scoringStreaks(plays).reduce<Run | null>(
    (best, { teamId, points }) =>
      points > (best?.points ?? 0) ? { teamId, points } : best,
    null,
  );

  return {
    leadChanges: plays.filter((play) => play.swing === "leadChange").length,
    ties: plays.filter((play) => play.swing === "tie").length,
    biggestLead: biggestLeads(plays),
    bestRun,
    decidingPlay: findDecidingPlay(plays),
  };
}

/** One step of the score-margin chart: a scoring play and where it falls. */
export interface MarginPoint {
  readonly play: Play;
  /** Game seconds from tip-off to the play. */
  readonly seconds: number;
  /** Home score minus away score once the play is over. */
  readonly margin: number;
}

/**
 * The score margin after each scoring play, against game time.
 *
 * @param plays - the match's plays, in match order
 * @param tipOff - when the match started
 * @returns one point per scoring play, in match order
 */
export function marginPoints(
  plays: readonly Play[],
  tipOff: Date | string,
): MarginPoint[] {
  return plays
    .filter((play) => play.scoringTeamId !== undefined)
    .map((play) => ({
      play,
      seconds: gameSeconds(play.lead.occurredAt, tipOff),
      margin: play.homeScore - play.awayScore,
    }));
}

/**
 * The plays the timeline shows: those of the chosen quarter with an event of a
 * chosen category by one of the chosen players, newest first if asked. Events
 * outside the filterable categories (the tip-off, an unknown type) pass the
 * category test whatever is chosen.
 *
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

/**
 * The DOM id of a play's row, by which `revealPlay` finds it.
 *
 * @param leadEventId - the id of the play's lead event
 * @returns the row's id
 */
export function playRowId(leadEventId: number): string {
  return `play-${leadEventId}`;
}
