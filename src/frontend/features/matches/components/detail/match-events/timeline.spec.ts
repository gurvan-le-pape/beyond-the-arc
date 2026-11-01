// src/frontend/features/matches/components/detail/match-events/timeline.spec.ts
import { describe, expect, it } from "vitest";

import { Quarter } from "@/features/matches/constants";
import { EventCategory, EventType, Role } from "@/shared/constants";

import { AWAY, event, EVENTS, HOME, playsOf } from "./matchEventsFixtures";
import { scoreEvents } from "./plays";
import {
  countCategories,
  FILTERABLE_CATEGORIES,
  filterPlays,
  groupByPeriod,
  type MatchEventsFilter,
  scorePeriods,
} from "./timeline";

const NO_FILTER: MatchEventsFilter = {
  quarter: Quarter.ALL,
  categories: new Set(FILTERABLE_CATEGORIES),
  playerIds: new Set(),
  latestFirst: false,
};

describe("filterPlays", () => {
  const plays = playsOf(EVENTS);
  const ids = (filter: Partial<MatchEventsFilter>) =>
    filterPlays(plays, { ...NO_FILTER, ...filter }).map((p) => p.lead.id);

  it("keeps everything without a filter", () => {
    expect(ids({})).toEqual([1, 2, 3, 4, 5]);
  });

  it("narrows to a quarter, a category and players", () => {
    expect(ids({ quarter: Quarter.Q2 })).toEqual([3, 4]);
    expect(ids({ categories: new Set([EventCategory.MADE]) })).toEqual([
      1, 2, 5,
    ]);
    expect(ids({ playerIds: new Set([10, 11]) })).toEqual([1, 3, 5]);
    expect(
      ids({
        quarter: Quarter.Q1,
        categories: new Set([EventCategory.MADE]),
        playerIds: new Set([20]),
      }),
    ).toEqual([2]);
  });

  it("shows several categories at once, and none when none is chosen", () => {
    expect(
      ids({
        categories: new Set([EventCategory.MISS, EventCategory.DEFENSIVE]),
      }),
    ).toEqual([3, 4]);
    expect(ids({ categories: new Set() })).toEqual([]);
  });

  it("always shows an event outside the filterable categories", () => {
    const withTipOff = playsOf([
      event(0, EventType.TIP_OFF, Role.WINNER, 20, AWAY, 1),
      ...EVENTS,
    ]);
    const shown = filterPlays(withTipOff, {
      ...NO_FILTER,
      categories: new Set([EventCategory.MISS]),
    });
    expect(shown.map((p) => p.lead.id)).toEqual([0, 3]);
  });

  it("puts the latest first when asked, keeping the match's score", () => {
    const latest = filterPlays(plays, { ...NO_FILTER, latestFirst: true });
    expect(latest.map((p) => p.lead.id)).toEqual([5, 4, 3, 2, 1]);
    expect(latest[0].homeScore).toBe(4);
  });

  it("narrows to every overtime period at once", () => {
    const withOvertime = playsOf([
      ...EVENTS,
      event(6, EventType.MADE_LAYUP, Role.SHOOTER, 10, HOME, 5),
      event(7, EventType.MADE_LAYUP, Role.SHOOTER, 20, AWAY, 6),
    ]);
    const shown = filterPlays(withOvertime, {
      ...NO_FILTER,
      quarter: Quarter.OT,
    });
    expect(shown.map((p) => p.lead.id)).toEqual([6, 7]);
  });

  it("does not reorder the list it was given", () => {
    filterPlays(plays, { ...NO_FILTER, latestFirst: true });
    expect(plays.map((p) => p.lead.id)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("groupByPeriod", () => {
  const withQuarterEnds = playsOf([
    EVENTS[0],
    EVENTS[1],
    event(90, EventType.QUARTER_END, Role.SHOOTER, 0, 0, 1),
    EVENTS[2],
    EVENTS[3],
    event(91, EventType.QUARTER_END, Role.SHOOTER, 0, 0, 2),
    EVENTS[4],
  ]);
  const shape = (plays: typeof withQuarterEnds) =>
    groupByPeriod(plays).map((g) => [g.period, g.plays.map((p) => p.lead.id)]);

  it("runs the periods in order and drops their end markers", () => {
    expect(shape(withQuarterEnds)).toEqual([
      [1, [1, 2]],
      [2, [3, 4]],
      [3, [5]],
    ]);
  });

  it("keeps the display order of a reversed list", () => {
    expect(shape([...withQuarterEnds].reverse())).toEqual([
      [3, [5]],
      [2, [4, 3]],
      [1, [2, 1]],
    ]);
  });

  it("leaves out a period with nothing to show", () => {
    expect(shape(withQuarterEnds.filter((e) => e.period !== 2))).toEqual([
      [1, [1, 2]],
      [3, [5]],
    ]);
  });
});

describe("scorePeriods", () => {
  it("gives each period its own points and the score at its end", () => {
    const scores = scorePeriods(scoreEvents(EVENTS, HOME, AWAY));
    expect(Object.fromEntries(scores)).toEqual({
      1: { home: 2, away: 3, homeTotal: 2, awayTotal: 3 },
      2: { home: 0, away: 0, homeTotal: 2, awayTotal: 3 },
      3: { home: 2, away: 0, homeTotal: 4, awayTotal: 3 },
    });
  });
});

describe("countCategories", () => {
  it("counts the match's events per filterable category", () => {
    const counts = countCategories([
      ...EVENTS,
      event(6, EventType.INBOUND, Role.SHOOTER, 20, AWAY, 3),
      event(7, EventType.TIP_OFF, Role.WINNER, 20, AWAY, 1),
    ]);
    expect(Object.fromEntries(counts)).toEqual({
      [EventCategory.MADE]: 3,
      [EventCategory.MISS]: 1,
      [EventCategory.FOUL]: 0,
      [EventCategory.TURNOVER]: 0,
      [EventCategory.DEFENSIVE]: 1,
      [EventCategory.REBOUND]: 0,
      [EventCategory.SUBSTITUTION]: 0,
      [EventCategory.INBOUND]: 1,
    });
  });
});
