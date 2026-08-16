// src/backend/common/utils/aggregate-career-stats.spec.ts
import { aggregateCareerStats } from "./aggregate-career-stats";
import type { MappedPlayerMatchStats } from "./player-match-stats.mapper";

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

describe("aggregateCareerStats", () => {
  it("sums totals and rounds per-game averages to one decimal", () => {
    const game1 = makeStats({
      points: 15,
      rebounds: { total: 8, offensive: 3, defensive: 5 },
      assists: 7,
      steals: 2,
      blocks: 1,
      turnovers: 3,
      fouls: 2,
    });
    const game2 = makeStats({
      points: 21,
      rebounds: { total: 8, offensive: 2, defensive: 6 },
      assists: 5,
      steals: 1,
      blocks: 0,
      turnovers: 4,
      fouls: 3,
    });

    expect(aggregateCareerStats([game1, game2])).toEqual({
      gamesPlayed: 2,
      points: 36,
      rebounds: 16,
      assists: 12,
      steals: 3,
      blocks: 1,
      turnovers: 7,
      fouls: 5,
      pointsPerGame: 18,
      reboundsPerGame: 8,
      assistsPerGame: 6,
      stealsPerGame: 1.5,
      blocksPerGame: 0.5,
      turnoversPerGame: 3.5,
      foulsPerGame: 2.5,
    });
  });

  it("rounds per-game averages to one decimal", () => {
    // Three games, and no total divides evenly by three — which is what makes
    // the rounding observable. The two-game fixture above divides exactly
    // every time, so it passes with the rounding removed entirely.
    const game1 = makeStats({
      points: 15,
      rebounds: { total: 8, offensive: 3, defensive: 5 },
      assists: 7,
      steals: 2,
      blocks: 1,
      turnovers: 3,
      fouls: 2,
    });
    const game2 = makeStats({
      points: 21,
      rebounds: { total: 8, offensive: 2, defensive: 6 },
      assists: 5,
      steals: 1,
      blocks: 0,
      turnovers: 4,
      fouls: 3,
    });
    const game3 = makeStats({
      points: 14,
      rebounds: { total: 6, offensive: 2, defensive: 4 },
      assists: 4,
      steals: 1,
      blocks: 1,
      turnovers: 3,
      fouls: 2,
    });

    const career = aggregateCareerStats([game1, game2, game3]);

    // 50/3, 22/3, 16/3, 4/3, 2/3, 10/3, 7/3 — all repeating.
    expect(career).toMatchObject({
      gamesPlayed: 3,
      pointsPerGame: 16.7,
      reboundsPerGame: 7.3,
      assistsPerGame: 5.3,
      stealsPerGame: 1.3,
      blocksPerGame: 0.7,
      turnoversPerGame: 3.3,
      foulsPerGame: 2.3,
    });
  });

  it("guards games played to at least 1 for an empty history", () => {
    expect(aggregateCareerStats([])).toEqual({
      gamesPlayed: 0,
      points: 0,
      rebounds: 0,
      assists: 0,
      steals: 0,
      blocks: 0,
      turnovers: 0,
      fouls: 0,
      pointsPerGame: 0,
      reboundsPerGame: 0,
      assistsPerGame: 0,
      stealsPerGame: 0,
      blocksPerGame: 0,
      turnoversPerGame: 0,
      foulsPerGame: 0,
    });
  });
});
