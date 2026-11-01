// src/frontend/features/matches/components/detail/match-events/gameClock.spec.ts
import { describe, expect, it } from "vitest";

import type { MatchEvent } from "@/features/matches/types";
import { EventType, Role } from "@/shared/constants";

import {
  formatClock,
  hasOvertime,
  overtimeNumber,
  periodEnds,
} from "./gameClock";
import { event, EVENTS, HOME, TIP_OFF } from "./matchEventsFixtures";

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

describe("formatClock", () => {
  it("writes the seconds left as m:ss", () => {
    expect(formatClock(600)).toBe("10:00");
    expect(formatClock(595)).toBe("9:55");
    expect(formatClock(12)).toBe("0:12");
    expect(formatClock(0)).toBe("0:00");
  });
});

describe("periodEnds", () => {
  // An event the given number of seconds after tip-off, with its clock.
  const clocked = (
    id: number,
    period: number,
    seconds: number,
    secondsLeft: number,
  ): MatchEvent => ({
    ...event(id, EventType.MADE_LAYUP, Role.SHOOTER, 10, HOME, period),
    occurredAt: new Date(Date.parse(TIP_OFF) + seconds * 1000).toISOString(),
    secondsLeft,
  });

  it("puts each buzzer at an event's elapsed time plus its clock", () => {
    expect(
      periodEnds(
        [
          clocked(1, 1, 5, 595),
          clocked(2, 2, 601, 599),
          clocked(3, 5, 2405, 295),
        ],
        TIP_OFF,
      ),
    ).toEqual([
      { period: 1, seconds: 600 },
      { period: 2, seconds: 1200 },
      { period: 5, seconds: 2700 },
    ]);
  });

  it("lists the periods in order, whatever order the events come in", () => {
    expect(
      periodEnds([clocked(1, 2, 601, 599), clocked(2, 1, 5, 595)], TIP_OFF).map(
        (end) => end.period,
      ),
    ).toEqual([1, 2]);
  });
});

describe("overtimeNumber", () => {
  it("numbers the overtimes and leaves the quarters out", () => {
    expect([1, 4, 5, 6].map(overtimeNumber)).toEqual([null, null, 1, 2]);
  });
});
