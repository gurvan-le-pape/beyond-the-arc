// src/backend/modules/matches/match-period.spec.ts
import { matchPeriod } from "./match-period";

const startsAt = new Date("2026-01-10T20:00:00.000Z");

function at(seconds: number, milliseconds = 0): Date {
  return new Date(startsAt.getTime() + seconds * 1000 + milliseconds);
}

describe("matchPeriod", () => {
  it.each([
    [0, 1],
    [1, 1],
    [600, 1],
    [601, 2],
    [1200, 2],
    [1201, 3],
    [1800, 3],
    [1801, 4],
    [2400, 4],
  ])("puts second %i of regulation in quarter %i", (seconds, period) => {
    expect(matchPeriod(at(seconds), startsAt)).toBe(period);
  });

  it.each([
    [2401, 5],
    [2700, 5],
    [2701, 6],
    [3000, 6],
    [3001, 7],
  ])("puts second %i in overtime period %i", (seconds, period) => {
    expect(matchPeriod(at(seconds), startsAt)).toBe(period);
  });

  it("keeps an event a few milliseconds into a buzzer's second in the period it closes", () => {
    expect(matchPeriod(at(600, 3), startsAt)).toBe(1);
    expect(matchPeriod(at(2400, 3), startsAt)).toBe(4);
  });

  it("puts an event before tip-off in the first quarter", () => {
    expect(matchPeriod(at(-5), startsAt)).toBe(1);
  });
});
