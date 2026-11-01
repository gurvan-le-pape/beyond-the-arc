// src/frontend/features/matches/components/detail/match-events/plays.spec.ts
import { describe, expect, it } from "vitest";

import type { MatchEvent } from "@/features/matches/types";
import { EventType, Role } from "@/shared/constants";

import {
  AWAY,
  baskets,
  event,
  EVENTS,
  HOME,
  playsOf,
  TIP_OFF,
} from "./matchEventsFixtures";
import { RUN_MIN_POINTS, scoreEvents } from "./plays";

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

describe("groupPlays", () => {
  // An event with several players, `seconds` of game time after tip-off.
  function play(
    id: number,
    eventType: string,
    seconds: number,
    players: [string, number, number][],
  ): MatchEvent {
    return {
      id,
      eventType,
      occurredAt: new Date(Date.parse(TIP_OFF) + seconds * 1000).toISOString(),
      period: 4,
      players: players.map(([role, playerId, teamId]) => ({
        role,
        player: { id: playerId, team: { id: teamId } },
      })),
    } as unknown as MatchEvent;
  }
  const shape = (events: MatchEvent[]) =>
    playsOf(events).map((p) => [p.lead.id, p.followers.map((f) => f.id)]);

  // Taken from match 604265: a shooting foul by the away side, two free
  // throws by the home shooter, then the inbound, in one second and a
  // millisecond apart, as the simulator stamps them.
  const tripToTheLine = [
    play(1, EventType.TWO_POINT_EXT_SHOOTING_FOUL, 2196, [
      [Role.SHOOTER, 6, HOME],
      [Role.FOULER, 5, AWAY],
    ]),
    play(2, EventType.FREE_THROW_MADE, 2196.001, [[Role.SHOOTER, 6, HOME]]),
    play(3, EventType.FREE_THROW_MISSED, 2196.002, [[Role.SHOOTER, 6, HOME]]),
    play(4, EventType.INBOUND, 2196.003, [[Role.SHOOTER, 2, AWAY]]),
  ];

  it("folds a shooting foul's free throws into it, but not the inbound", () => {
    expect(shape(tripToTheLine)).toEqual([
      [1, [2, 3]],
      [4, []],
    ]);
  });

  it("gives the play the score after its last free throw, and to the shooter", () => {
    const [foul] = playsOf(tripToTheLine);
    expect([foul.homeScore, foul.awayScore]).toEqual([1, 0]);
    expect(foul.teamId).toBe(HOME);
    expect(foul.scoringTeamId).toBe(HOME);
  });

  it("folds an and-one's free throw into it", () => {
    expect(
      shape([
        play(1, EventType.TWO_POINT_EXT_AND_1, 2372, [
          [Role.SHOOTER, 2, HOME],
          [Role.FOULER, 3, AWAY],
        ]),
        play(2, EventType.FREE_THROW_MADE, 2372.001, [[Role.SHOOTER, 2, HOME]]),
      ]),
    ).toEqual([[1, [2]]]);
  });

  it("folds one team's simultaneous substitutions, not the other team's", () => {
    const sub = (id: number, teamId: number, seconds = 2190) =>
      play(id, EventType.SUBSTITUTION, seconds, [
        [Role.EXITING_PLAYER, id * 10, teamId],
        [Role.ENTERING_PLAYER, id * 10 + 1, teamId],
      ]);
    expect(
      shape([sub(1, AWAY), sub(2, AWAY), sub(3, HOME), sub(4, HOME, 2200)]),
    ).toEqual([
      [1, [2]],
      [3, []],
      [4, []],
    ]);
  });

  it("leaves a free throw at another instant on its own", () => {
    expect(
      shape([
        play(1, EventType.THREE_POINT_SHOOTING_FOUL, 2600, [
          [Role.SHOOTER, 5, AWAY],
          [Role.FOULER, 9, HOME],
        ]),
        play(2, EventType.FREE_THROW_MADE, 2601, [[Role.SHOOTER, 5, AWAY]]),
      ]),
    ).toEqual([
      [1, []],
      [2, []],
    ]);
  });

  it("has no scoring side when every free throw missed", () => {
    const [foul] = playsOf([
      tripToTheLine[0],
      play(2, EventType.FREE_THROW_MISSED, 2196.001, [[Role.SHOOTER, 6, HOME]]),
    ]);
    expect(foul.scoringTeamId).toBe(undefined);
    expect(foul.teamId).toBe(HOME);
  });
});

describe("lead changes, ties and runs", () => {
  it("marks the basket that takes the lead from the other side, and a tie", () => {
    const plays = baskets([HOME, 2], [AWAY, 2], [AWAY, 3], [HOME, 3]);
    expect(plays.map((p) => p.swing)).toEqual([
      null, // 2–0 takes a lead nobody had
      "tie", // 2–2
      "leadChange", // 2–5
      "tie", // 5–5
    ]);
  });

  it("does not mark a basket that only stretches a lead", () => {
    expect(baskets([HOME, 2], [HOME, 2]).map((p) => p.swing)).toEqual([
      null,
      null,
    ]);
  });

  // Taken from match 604265, late in Q4: the away side scores four baskets
  // in a row, 64–59 to 64–67, before the home side answers.
  it("marks the last basket of a run, once the other side scores", () => {
    const plays = baskets(
      [AWAY, 2],
      [AWAY, 2],
      [AWAY, 2],
      [AWAY, 2],
      [HOME, 2],
    );
    expect(plays.map((p) => p.runEnded)).toEqual([
      null,
      null,
      null,
      { teamId: AWAY, points: 8 },
      null,
    ]);
  });

  it("closes a run at the end of the match", () => {
    const plays = baskets([HOME, 2], [AWAY, 3], [AWAY, 2], [AWAY, 2]);
    expect(plays[plays.length - 1].runEnded).toEqual({
      teamId: AWAY,
      points: 7,
    });
  });

  it(`does not call fewer than ${RUN_MIN_POINTS} points in a row a run`, () => {
    const plays = baskets([AWAY, 3], [AWAY, 3], [HOME, 2]);
    expect(plays.every((p) => p.runEnded === null)).toBe(true);
  });

  it("is not broken by a play that scores nothing", () => {
    const plays = playsOf([
      event(1, EventType.MADE_STEP_BACK_THREE, Role.SHOOTER, 20, AWAY, 4),
      event(2, EventType.MISSED_LAYUP, Role.SHOOTER, 10, HOME, 4),
      event(3, EventType.MADE_STEP_BACK_THREE, Role.SHOOTER, 20, AWAY, 4),
      event(4, EventType.MADE_LAYUP, Role.SHOOTER, 20, AWAY, 4),
    ]);
    expect(plays[plays.length - 1].runEnded).toEqual({
      teamId: AWAY,
      points: 8,
    });
  });
});
