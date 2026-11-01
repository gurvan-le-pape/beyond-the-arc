// src/frontend/features/matches/components/detail/match-events/timeline.ts
import { Quarter } from "@/features/matches/constants";
import type { MatchEvent } from "@/features/matches/types";
import { getEventStyle } from "@/features/matches/utils";
import { EventCategory, EventType } from "@/shared/constants";

import { REGULATION_QUARTERS } from "./gameClock";
import type { Play, ScoredMatchEvent } from "./plays";

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
