// src/backend/modules/matches/aggregate-team-match-stats.spec.ts
import type { MappedPlayerMatchStats } from "@common/utils";

import { aggregateTeamMatchStats } from "./aggregate-team-match-stats";

function makeStats(
  overrides: Partial<MappedPlayerMatchStats> = {},
): MappedPlayerMatchStats {
  return {
    points: 0,
    fouls: 0,
    threePointsMade: 0,
    threePointsAttempted: 0,
    twoPointsIntMade: 0,
    twoPointsIntAttempted: 0,
    twoPointsExtMade: 0,
    twoPointsExtAttempted: 0,
    freeThrowsMade: 0,
    freeThrowsAttempted: 0,
    assists: 0,
    turnovers: 0,
    rebounds: { total: 0, offensive: 0, defensive: 0 },
    steals: 0,
    blocks: 0,
    playtimeIntervals: [],
    ...overrides,
  };
}

describe("aggregateTeamMatchStats", () => {
  it("sums two players and formats made/attempted, percentages and counting stats", () => {
    const playerA = makeStats({
      threePointsMade: 2,
      threePointsAttempted: 5,
      twoPointsIntMade: 3,
      twoPointsIntAttempted: 6,
      twoPointsExtMade: 1,
      twoPointsExtAttempted: 3,
      freeThrowsMade: 4,
      freeThrowsAttempted: 5,
      rebounds: { total: 7, offensive: 2, defensive: 5 },
      assists: 7,
      steals: 2,
      blocks: 1,
      turnovers: 3,
      fouls: 2,
    });
    const playerB = makeStats({
      threePointsMade: 1,
      threePointsAttempted: 4,
      twoPointsIntMade: 2,
      twoPointsIntAttempted: 4,
      twoPointsExtMade: 0,
      twoPointsExtAttempted: 1,
      freeThrowsMade: 2,
      freeThrowsAttempted: 2,
      rebounds: { total: 4, offensive: 1, defensive: 3 },
      assists: 3,
      steals: 1,
      blocks: 0,
      turnovers: 1,
      fouls: 4,
    });

    expect(aggregateTeamMatchStats([playerA, playerB])).toEqual({
      fieldGoals: "9/23",
      fieldGoalPercentage: 39,
      threePointers: "3/9",
      threePointPercentage: 33,
      freeThrows: "6/7",
      freeThrowPercentage: 86,
      reboundsTotal: 11,
      reboundsOffensive: 3,
      reboundsDefensive: 8,
      assists: 10,
      steals: 3,
      blocks: 1,
      turnovers: 4,
      fouls: 6,
      pointsInPaint: 10,
    });
  });

  it("returns null for a percentage when there were no attempts", () => {
    const result = aggregateTeamMatchStats([
      makeStats({
        assists: 5,
        rebounds: { total: 2, offensive: 1, defensive: 1 },
      }),
    ]);

    expect(result.fieldGoals).toBe("0/0");
    expect(result.fieldGoalPercentage).toBeNull();
    expect(result.threePointPercentage).toBeNull();
    expect(result.freeThrowPercentage).toBeNull();
    expect(result.assists).toBe(5);
    expect(result.reboundsTotal).toBe(2);
  });

  it("handles an empty roster as all zeros", () => {
    expect(aggregateTeamMatchStats([])).toEqual({
      fieldGoals: "0/0",
      fieldGoalPercentage: null,
      threePointers: "0/0",
      threePointPercentage: null,
      freeThrows: "0/0",
      freeThrowPercentage: null,
      reboundsTotal: 0,
      reboundsOffensive: 0,
      reboundsDefensive: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fouls: 0,
      pointsInPaint: 0,
    });
  });
});
