// src/frontend/features/matches/components/detail/match-events/playFilters.ts
import { Quarter } from "@/features/matches/constants";
import type { MatchEvent } from "@/features/matches/types";
import { getEventStyle } from "@/features/matches/utils";
import { EventCategory, EventType } from "@/shared/constants";

import type { Play, ScoredMatchEvent } from "./plays";
import { REGULATION_QUARTERS } from "./plays";

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
 * Whether a play gets a row in the timeline: every play but a period's end.
 *
 * @param play - the play to test
 * @returns false for an end-of-period event
 */
function isRow(play: Play): boolean {
  return play.lead.eventType !== EventType.QUARTER_END;
}

/**
 * How many rows the timeline has for the whole match, whatever is filtered:
 * the total the filter's "shown" count is out of.
 *
 * @param plays - the match's plays
 * @returns the number of plays that get a row
 */
export function countRows(plays: readonly Play[]): number {
  return plays.filter(isRow).length;
}

/**
 * The plays the timeline shows: those of the chosen quarter with an event of a
 * chosen category by one of the chosen players, newest first if asked. Events
 * outside the filterable categories (the tip-off, an unknown type) pass the
 * category test whatever is chosen.
 *
 * A play matches on any of its events, so a shooting foul whose free throws
 * went in shows under made shots as well as under fouls. End-of-period events
 * never show, since each period's header already says where it ends.
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
      isRow(play) &&
      isInQuarter(filter.quarter, play.period) &&
      [play.lead, ...play.followers].some(matches),
  );

  return filter.latestFirst ? result.reverse() : result;
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
