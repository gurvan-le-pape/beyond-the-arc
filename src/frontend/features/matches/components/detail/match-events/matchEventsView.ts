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
  const quarter =
    filter.quarter === Quarter.ALL
      ? undefined
      : Number.parseInt(filter.quarter.replace("Q", ""));
  const allowedTypes =
    filter.category === undefined
      ? undefined
      : (eventCategories[filter.category] ?? []);

  const result = events.filter(
    (event) =>
      (quarter === undefined || event.period === quarter) &&
      (allowedTypes === undefined || allowedTypes.includes(event.eventType)) &&
      (filter.playerIds.size === 0 ||
        (event.players ?? []).some((p) => filter.playerIds.has(p.player.id))),
  );

  return filter.latestFirst ? result.reverse() : result;
}
