// src/frontend/features/matches/components/detail/match-events/event-timeline/periods.spec.ts
import { describe, expect, it } from "vitest";

import { EVENTS, playsOf } from "../matchEventsFixtures";
import { groupByPeriod, scorePeriods } from "./periods";

describe("groupByPeriod", () => {
  const plays = playsOf(EVENTS);
  const shape = (shown: typeof plays) =>
    groupByPeriod(shown).map((g) => [g.period, g.plays.map((p) => p.lead.id)]);

  it("runs the periods in order", () => {
    expect(shape(plays)).toEqual([
      [1, [1, 2]],
      [2, [3, 4]],
      [3, [5]],
    ]);
  });

  it("keeps the display order of a reversed list", () => {
    expect(shape([...plays].reverse())).toEqual([
      [3, [5]],
      [2, [4, 3]],
      [1, [2, 1]],
    ]);
  });

  it("leaves out a period with nothing to show", () => {
    expect(shape(plays.filter((p) => p.period !== 2))).toEqual([
      [1, [1, 2]],
      [3, [5]],
    ]);
  });
});

describe("scorePeriods", () => {
  it("gives each period its own points and the score at its end", () => {
    const scores = scorePeriods(playsOf(EVENTS));
    expect(Object.fromEntries(scores)).toEqual({
      1: { home: 2, away: 3, homeTotal: 2, awayTotal: 3 },
      2: { home: 0, away: 0, homeTotal: 2, awayTotal: 3 },
      3: { home: 2, away: 0, homeTotal: 4, awayTotal: 3 },
    });
  });
});
