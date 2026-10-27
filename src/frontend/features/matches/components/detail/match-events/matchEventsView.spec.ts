// src/frontend/features/matches/components/detail/match-events/matchEventsView.spec.ts
import { describe, expect, it } from "vitest";

import { Quarter } from "@/features/matches/constants";
import type { MatchEvent } from "@/features/matches/types";
import { EventCategory, EventType, Role } from "@/shared/constants";

import {
  countCategories,
  FILTERABLE_CATEGORIES,
  filterPlays,
  formatClock,
  groupByPeriod,
  groupPlays,
  hasOvertime,
  marginPoints,
  type MatchEventsFilter,
  overtimeNumber,
  periodEnds,
  RUN_MIN_POINTS,
  scoreEvents,
  scorePeriods,
  summarizeMatch,
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
  categories: new Set(FILTERABLE_CATEGORIES),
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

// The match's plays, from its events.
const playsOf = (events: readonly MatchEvent[]) =>
  groupPlays(scoreEvents(events, HOME, AWAY));

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

describe("overtimeNumber", () => {
  it("numbers the overtimes and leaves the quarters out", () => {
    expect([1, 4, 5, 6].map(overtimeNumber)).toEqual([null, null, 1, 2]);
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

// Baskets in a row, as [team, points] pairs, all in Q4.
function baskets(...scores: [number, 2 | 3][]) {
  return playsOf(
    scores.map(([teamId, points], index) =>
      event(
        index + 1,
        points === 3 ? EventType.MADE_STEP_BACK_THREE : EventType.MADE_LAYUP,
        Role.SHOOTER,
        teamId * 10,
        teamId,
        4,
      ),
    ),
  );
}

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
