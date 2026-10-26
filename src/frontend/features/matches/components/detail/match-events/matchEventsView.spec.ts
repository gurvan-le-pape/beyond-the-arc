// src/frontend/features/matches/components/detail/match-events/matchEventsView.spec.ts
import { describe, expect, it } from "vitest";

import { Quarter } from "@/features/matches/constants";
import type { MatchEvent } from "@/features/matches/types";
import { EventCategory, EventType, Role } from "@/shared/constants";

import {
  filterEvents,
  groupByPeriod,
  hasOvertime,
  type MatchEventsFilter,
  overtimeNumber,
  periodClock,
  scoreEvents,
  scorePeriods,
} from "./matchEventsView";

const TIP_OFF = "2026-10-01T18:00:00.000Z";
const HOME = 1;
const AWAY = 2;

// An event by one player, in the given period.
function event(
  id: number,
  eventType: string,
  role: string,
  playerId: number,
  teamId: number,
  period: number,
): MatchEvent {
  return {
    id,
    eventType,
    occurredAt: TIP_OFF,
    period,
    players: [{ role, player: { id: playerId, team: { id: teamId } } }],
  } as unknown as MatchEvent;
}

const EVENTS = [
  event(1, EventType.MADE_LAYUP, Role.SHOOTER, 10, HOME, 1),
  event(2, EventType.MADE_STEP_BACK_THREE, Role.SHOOTER, 20, AWAY, 1),
  event(3, EventType.MISSED_LAYUP, Role.SHOOTER, 10, HOME, 2),
  event(4, EventType.STEAL, Role.STEALER, 20, AWAY, 2),
  event(5, EventType.MADE_LAYUP, Role.SHOOTER, 11, HOME, 3),
];

const NO_FILTER: MatchEventsFilter = {
  quarter: Quarter.ALL,
  category: undefined,
  playerIds: new Set(),
  latestFirst: false,
};

describe("scoreEvents", () => {
  it("carries the score after each event, counting made shots only", () => {
    const scored = scoreEvents(EVENTS, HOME, AWAY);
    expect(scored.map((e) => [e.homeScore, e.awayScore])).toEqual([
      [2, 0],
      [2, 3],
      [2, 3],
      [2, 3],
      [4, 3],
    ]);
  });

  it("attributes each event to its team", () => {
    const scored = scoreEvents(EVENTS, HOME, AWAY);
    expect(scored.map((e) => e.teamId)).toEqual([HOME, AWAY, HOME, AWAY, HOME]);
  });
});

describe("filterEvents", () => {
  const scored = scoreEvents(EVENTS, HOME, AWAY);
  const ids = (filter: Partial<MatchEventsFilter>) =>
    filterEvents(scored, { ...NO_FILTER, ...filter }).map((e) => e.id);

  it("keeps everything without a filter", () => {
    expect(ids({})).toEqual([1, 2, 3, 4, 5]);
  });

  it("narrows to a quarter, a category and players", () => {
    expect(ids({ quarter: Quarter.Q2 })).toEqual([3, 4]);
    expect(ids({ category: EventCategory.MADE })).toEqual([1, 2, 5]);
    expect(ids({ playerIds: new Set([10, 11]) })).toEqual([1, 3, 5]);
    expect(
      ids({
        quarter: Quarter.Q1,
        category: EventCategory.MADE,
        playerIds: new Set([20]),
      }),
    ).toEqual([2]);
  });

  it("puts the latest first when asked, keeping the match's score", () => {
    const latest = filterEvents(scored, { ...NO_FILTER, latestFirst: true });
    expect(latest.map((e) => e.id)).toEqual([5, 4, 3, 2, 1]);
    expect(latest[0].homeScore).toBe(4);
  });

  it("narrows to every overtime period at once", () => {
    const withOvertime = scoreEvents(
      [
        ...EVENTS,
        event(6, EventType.MADE_LAYUP, Role.SHOOTER, 10, HOME, 5),
        event(7, EventType.MADE_LAYUP, Role.SHOOTER, 20, AWAY, 6),
      ],
      HOME,
      AWAY,
    );
    const shown = filterEvents(withOvertime, {
      ...NO_FILTER,
      quarter: Quarter.OT,
    });
    expect(shown.map((e) => e.id)).toEqual([6, 7]);
  });

  it("does not reorder the list it was given", () => {
    filterEvents(scored, { ...NO_FILTER, latestFirst: true });
    expect(scored.map((e) => e.id)).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("hasOvertime", () => {
  it("is false for a match decided in regulation", () => {
    expect(hasOvertime(EVENTS)).toBe(false);
  });

  it("is true once any event lies past the fourth period", () => {
    expect(
      hasOvertime([
        ...EVENTS,
        event(6, EventType.MADE_LAYUP, Role.SHOOTER, 10, HOME, 5),
      ]),
    ).toBe(true);
  });
});

describe("periodClock", () => {
  // An instant the given number of seconds of game time after tip-off.
  const at = (seconds: number) =>
    new Date(Date.parse(TIP_OFF) + seconds * 1000).toISOString();

  it("counts each quarter down from 10:00", () => {
    expect(periodClock(at(5), TIP_OFF, 1)).toBe("9:55");
    expect(periodClock(at(601), TIP_OFF, 2)).toBe("9:59");
    expect(periodClock(at(2388), TIP_OFF, 4)).toBe("0:12");
  });

  it("reads 0:00 on the buzzer", () => {
    expect(periodClock(at(600), TIP_OFF, 1)).toBe("0:00");
    expect(periodClock(at(2400), TIP_OFF, 4)).toBe("0:00");
  });

  it("counts each overtime down from 5:00", () => {
    expect(periodClock(at(2405), TIP_OFF, 5)).toBe("4:55");
    expect(periodClock(at(2760), TIP_OFF, 6)).toBe("4:00");
  });

  it("never goes negative for an event stamped past its buzzer", () => {
    expect(periodClock(at(610), TIP_OFF, 1)).toBe("0:00");
  });
});

describe("groupByPeriod", () => {
  const withQuarterEnds = scoreEvents(
    [
      EVENTS[0],
      EVENTS[1],
      event(90, EventType.QUARTER_END, Role.SHOOTER, 0, 0, 1),
      EVENTS[2],
      EVENTS[3],
      event(91, EventType.QUARTER_END, Role.SHOOTER, 0, 0, 2),
      EVENTS[4],
    ],
    HOME,
    AWAY,
  );
  const shape = (events: typeof withQuarterEnds) =>
    groupByPeriod(events).map((g) => [g.period, g.events.map((e) => e.id)]);

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

describe("overtimeNumber", () => {
  it("numbers the overtimes and leaves the quarters out", () => {
    expect([1, 4, 5, 6].map(overtimeNumber)).toEqual([null, null, 1, 2]);
  });
});
