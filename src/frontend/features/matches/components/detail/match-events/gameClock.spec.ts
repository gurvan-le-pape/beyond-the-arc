// src/frontend/features/matches/components/detail/match-events/gameClock.spec.ts
import { describe, expect, it } from "vitest";

import { EventType, Role } from "@/shared/constants";

import { formatClock, hasOvertime, overtimeNumber } from "./gameClock";
import { event, EVENTS, HOME } from "./matchEventsFixtures";

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

describe("overtimeNumber", () => {
  it("numbers the overtimes and leaves the quarters out", () => {
    expect([1, 4, 5, 6].map(overtimeNumber)).toEqual([null, null, 1, 2]);
  });
});
