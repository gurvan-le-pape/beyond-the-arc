// src/backend/modules/matches/match-period.spec.ts
import { matchClock } from "./match-period";

const startsAt = new Date("2026-01-10T20:00:00.000Z");

function at(seconds: number, milliseconds = 0): Date {
  return new Date(startsAt.getTime() + seconds * 1000 + milliseconds);
}

describe("matchClock", () => {
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
    expect(matchClock(at(seconds), startsAt).period).toBe(period);
  });

  it.each([
    [2401, 5],
    [2700, 5],
    [2701, 6],
    [3000, 6],
    [3001, 7],
  ])("puts second %i in overtime period %i", (seconds, period) => {
    expect(matchClock(at(seconds), startsAt).period).toBe(period);
  });

  it("keeps an event a few milliseconds into a buzzer's second in the period it closes", () => {
    expect(matchClock(at(600, 3), startsAt).period).toBe(1);
    expect(matchClock(at(2400, 3), startsAt).period).toBe(4);
  });

  it("puts an event before tip-off at the start of the first quarter", () => {
    expect(matchClock(at(-5), startsAt)).toEqual({
      period: 1,
      secondsLeft: 600,
    });
  });

  it.each([
    [0, 600],
    [5, 595],
    [600, 0],
    [601, 599],
    [2388, 12],
    [2400, 0],
    [2405, 295],
    [2700, 0],
    [2760, 240],
  ])("leaves %i s into the match with %i s on the clock", (seconds, left) => {
    expect(matchClock(at(seconds), startsAt).secondsLeft).toBe(left);
  });

  it("counts whole seconds, so a buzzer's own second reads 0, not -1", () => {
    expect(matchClock(at(600, 3), startsAt).secondsLeft).toBe(0);
  });
});
