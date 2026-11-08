// src/backend/common/utils/ranking.util.spec.ts
import { assignRankByCount, isBetterRanked } from "./ranking.util";

describe("isBetterRanked", () => {
  it("should rank higher points better regardless of point difference", () => {
    expect(
      isBetterRanked(
        { points: 10, pointDifference: -50 },
        { points: 9, pointDifference: 100 },
      ),
    ).toBe(true);
  });

  it("should break equal points by point difference", () => {
    expect(
      isBetterRanked(
        { points: 10, pointDifference: 5 },
        { points: 10, pointDifference: 4 },
      ),
    ).toBe(true);
    expect(
      isBetterRanked(
        { points: 10, pointDifference: 4 },
        { points: 10, pointDifference: 5 },
      ),
    ).toBe(false);
  });

  it("should treat fully equal entries as not better", () => {
    expect(
      isBetterRanked(
        { points: 10, pointDifference: 5 },
        { points: 10, pointDifference: 5 },
      ),
    ).toBe(false);
  });
});

describe("assignRankByCount", () => {
  it("should assign sequential ranks when there are no ties", () => {
    const ranked = assignRankByCount([
      { points: 12, pointDifference: 30 },
      { points: 10, pointDifference: 12 },
      { points: 8, pointDifference: -42 },
    ]);
    expect(ranked.map((e) => e.rank)).toEqual([1, 2, 3]);
  });

  it("should give tied entries the same rank and skip the next rank", () => {
    const ranked = assignRankByCount([
      { points: 12, pointDifference: 30 },
      { points: 10, pointDifference: 12 },
      { points: 10, pointDifference: 12 },
      { points: 8, pointDifference: -42 },
    ]);
    expect(ranked.map((e) => e.rank)).toEqual([1, 2, 2, 4]);
  });

  it("should rank ties at the top as shared first place", () => {
    const ranked = assignRankByCount([
      { points: 12, pointDifference: 30 },
      { points: 12, pointDifference: 30 },
      { points: 10, pointDifference: 0 },
    ]);
    expect(ranked.map((e) => e.rank)).toEqual([1, 1, 3]);
  });

  it("should not depend on input order", () => {
    const ranked = assignRankByCount([
      { points: 8, pointDifference: -42 },
      { points: 12, pointDifference: 30 },
      { points: 10, pointDifference: 12 },
    ]);
    expect(ranked.map((e) => e.rank)).toEqual([3, 1, 2]);
  });

  it("should preserve extra entry fields", () => {
    const ranked = assignRankByCount([
      { points: 10, pointDifference: 5, teamId: 7 },
    ]);
    expect(ranked[0]).toEqual({
      points: 10,
      pointDifference: 5,
      teamId: 7,
      rank: 1,
    });
  });

  it("should return an empty array for no entries", () => {
    expect(assignRankByCount([])).toEqual([]);
  });
});
