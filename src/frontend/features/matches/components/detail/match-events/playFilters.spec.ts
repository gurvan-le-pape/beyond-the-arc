// src/frontend/features/matches/components/detail/match-events/playFilters.spec.ts
import { describe, expect, it } from "vitest";

import { Quarter } from "@/features/matches/constants";
import { EventCategory, EventType, Role } from "@/shared/constants";

import { AWAY, event, EVENTS, HOME, playsOf } from "./matchEventsFixtures";
import {
  countCategories,
  countRows,
  FILTERABLE_CATEGORIES,
  filterPlays,
  type MatchEventsFilter,
} from "./playFilters";

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

  it("leaves out the end of each period", () => {
    const withQuarterEnd = playsOf([
      EVENTS[0],
      event(90, EventType.QUARTER_END, Role.SHOOTER, 0, 0, 1),
      EVENTS[2],
    ]);
    expect(
      filterPlays(withQuarterEnd, NO_FILTER).map((p) => p.lead.id),
    ).toEqual([1, 3]);
  });

  it("does not reorder the list it was given", () => {
    filterPlays(plays, { ...NO_FILTER, latestFirst: true });
    expect(plays.map((p) => p.lead.id)).toEqual([1, 2, 3, 4, 5]);
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

describe("countRows", () => {
  it("counts every play but the ends of periods", () => {
    expect(
      countRows(
        playsOf([
          ...EVENTS,
          event(90, EventType.QUARTER_END, Role.SHOOTER, 0, 0, 3),
        ]),
      ),
    ).toBe(5);
  });
});
