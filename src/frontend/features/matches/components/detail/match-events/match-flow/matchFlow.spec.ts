// src/frontend/features/matches/components/detail/match-events/match-flow/matchFlow.spec.ts
import { describe, expect, it } from "vitest";

import type { MatchEvent } from "@/features/matches/types";
import { EventType, Role } from "@/shared/constants";

import {
  AWAY,
  baskets,
  event,
  HOME,
  playsOf,
  TIP_OFF,
} from "../matchEventsFixtures";
import { marginPoints, periodEnds, summarizeMatch } from "./matchFlow";

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

describe("summarizeMatch", () => {
  it("counts the lead changes and ties the timeline marks", () => {
    const summary = summarizeMatch(
      baskets([HOME, 2], [AWAY, 2], [AWAY, 3], [HOME, 3], [HOME, 2]),
    );
    expect(summary.leadChanges).toBe(2); // 2–5, then 7–5
    expect(summary.ties).toBe(2); // 2–2, 5–5
  });

  it("keeps each side's biggest lead and the play that reached it", () => {
    const plays = baskets(
      [HOME, 3],
      [HOME, 2],
      [AWAY, 3],
      [AWAY, 3],
      [AWAY, 3],
    );
    const { biggestLead } = summarizeMatch(plays);
    expect(biggestLead.home).toEqual({ margin: 5, play: plays[1] });
    expect(biggestLead.away).toEqual({ margin: 4, play: plays[4] });
  });

  it("leaves the biggest lead empty for a side that never led", () => {
    expect(summarizeMatch(baskets([HOME, 2])).biggestLead.away).toBeNull();
  });

  it("keeps the earliest of the longest streaks, short of a run or not", () => {
    const { bestRun } = summarizeMatch(
      baskets([HOME, 2], [HOME, 3], [AWAY, 3], [AWAY, 2], [HOME, 2]),
    );
    expect(bestRun).toEqual({ teamId: HOME, points: 5 });
  });

  it("finds the play after which the winner led for good", () => {
    const plays = baskets(
      [HOME, 2],
      [AWAY, 3],
      [HOME, 2],
      [HOME, 2],
      [AWAY, 2],
    );
    // 2–0, 2–3, 4–3: home takes the lead it never gives back.
    expect(summarizeMatch(plays).decidingPlay).toBe(plays[2]);
  });

  it("takes the lead back after a tie, and from the first basket wire to wire", () => {
    const plays = baskets([AWAY, 2], [HOME, 2], [AWAY, 3]);
    // 0–2, 2–2, 2–5: the tie means the lead was taken again at 2–5.
    expect(summarizeMatch(plays).decidingPlay).toBe(plays[2]);
    const wire = baskets([AWAY, 2], [AWAY, 3], [HOME, 2]);
    expect(summarizeMatch(wire).decidingPlay).toBe(wire[0]);
  });

  it("has no deciding play when the match ends level", () => {
    expect(
      summarizeMatch(baskets([HOME, 2], [AWAY, 2])).decidingPlay,
    ).toBeNull();
  });
});

describe("marginPoints", () => {
  it("places each scoring play at its game second, with the margin after it", () => {
    const at = (seconds: number) =>
      new Date(Date.parse(TIP_OFF) + seconds * 1000).toISOString();
    const events = [
      {
        ...event(1, EventType.MADE_LAYUP, Role.SHOOTER, 10, HOME, 1),
        occurredAt: at(12),
      },
      {
        ...event(2, EventType.MISSED_LAYUP, Role.SHOOTER, 20, AWAY, 1),
        occurredAt: at(30),
      },
      {
        ...event(3, EventType.MADE_STEP_BACK_THREE, Role.SHOOTER, 20, AWAY, 1),
        occurredAt: at(45),
      },
    ];
    expect(
      marginPoints(playsOf(events), TIP_OFF).map(({ seconds, margin }) => [
        seconds,
        margin,
      ]),
    ).toEqual([
      [12, 2],
      [45, -1],
    ]);
  });
});
