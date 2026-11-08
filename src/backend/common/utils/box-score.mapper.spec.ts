// src/backend/common/utils/box-score.mapper.spec.ts
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { parseBoxScore, parseBoxScoreLine } from "./box-score.mapper";

const line = (overrides: Record<string, unknown> = {}) => ({
  points: 17,
  fouls: 3,
  three_points_made: 1,
  three_points_attempted: 4,
  two_points_int_made: 4,
  two_points_int_attempted: 6,
  two_points_ext_made: 1,
  two_points_ext_attempted: 2,
  free_throws_made: 4,
  free_throws_attempted: 5,
  assists: 2,
  turnovers: 1,
  rebounds_offensive: 1,
  rebounds_defensive: 6,
  steals: 2,
  blocks: 1,
  playtime_intervals: [
    [0, 300],
    [600, 1200],
  ],
  ...overrides,
});

describe("parseBoxScoreLine", () => {
  it("maps every stored field to the API's shape", () => {
    expect(parseBoxScoreLine(line(), "here")).toEqual({
      points: 17,
      fouls: 3,
      threePointsMade: 1,
      threePointsAttempted: 4,
      twoPointsIntMade: 4,
      twoPointsIntAttempted: 6,
      twoPointsExtMade: 1,
      twoPointsExtAttempted: 2,
      freeThrowsMade: 4,
      freeThrowsAttempted: 5,
      assists: 2,
      turnovers: 1,
      rebounds: { total: 7, offensive: 1, defensive: 6 },
      steals: 2,
      blocks: 1,
      playtimeIntervals: [
        [0, 300],
        [600, 1200],
      ],
    });
  });

  it.each([
    ["not an object", null, "box-score line is not an object"],
    ["a list", [], "box-score line is not an object"],
    ["missing a counter", line({ steals: undefined }), "steals is not"],
    ["a counter as text", line({ points: "17" }), "points is not"],
    ["a negative counter", line({ fouls: -1 }), "fouls is not"],
    ["a fractional counter", line({ assists: 1.5 }), "assists is not"],
    [
      "an extra field",
      line({ minutes: 20 }),
      "unexpected box-score fields minutes",
    ],
    ["no playtime", line({ playtime_intervals: null }), "playtime_intervals"],
    [
      "a reversed interval",
      line({ playtime_intervals: [[300, 0]] }),
      "playtime_intervals",
    ],
    [
      "a three-number interval",
      line({ playtime_intervals: [[0, 1, 2]] }),
      "playtime_intervals",
    ],
  ])("rejects %s, naming where it is", (_name, value, message) => {
    expect(() => parseBoxScoreLine(value, "match 3, player 9")).toThrow(
      `match 3, player 9: ${message}`,
    );
  });
});

describe("parseBoxScore", () => {
  it("returns one line per player, in player id order", () => {
    const lines = parseBoxScore({ "12": line(), "3": line({ points: 4 }) }, 1);

    expect(lines.map((l) => [l.playerId, l.stats.points])).toEqual([
      [3, 4],
      [12, 17],
    ]);
  });

  it("reads an empty box score as no lines", () => {
    expect(parseBoxScore({}, 1)).toEqual([]);
  });

  it.each([
    ["no box score", null, "match 8: box score is not an object"],
    ["a list", [line()], "match 8: box score is not an object"],
    [
      "a key that is no player id",
      { abc: line() },
      "match 8: box-score key abc is no player id",
    ],
    [
      "a zero-padded key",
      { "07": line() },
      "match 8: box-score key 07 is no player id",
    ],
    [
      "a malformed line",
      { "5": line({ blocks: null }) },
      "match 8, player 5: blocks is not",
    ],
  ])("rejects %s", (_name, value, message) => {
    expect(() => parseBoxScore(value, 8)).toThrow(message);
  });
});

describe("the stored field names", () => {
  // The scheduler writes the lines (STAT_COLUMNS in match_generator.py). A
  // counter renamed on one side only would fail every read, so the two lists
  // are compared here rather than at the first request. `line()` holds exactly
  // the fields the mapper accepts, by the tests above.
  it("are the counters the scheduler writes", () => {
    const source = readFileSync(
      join(__dirname, "../../db/python/generation/match_generator.py"),
      "utf8",
    );
    const block = /STAT_COLUMNS = \(([\s\S]*?)\)/.exec(source);
    const written = [...(block?.[1] ?? "").matchAll(/"(\w+)"/g)].map(
      (m) => m[1],
    );
    const stored = Object.keys(line()).filter(
      (key) => key !== "playtime_intervals",
    );

    expect(written).toEqual(stored);
  });
});
