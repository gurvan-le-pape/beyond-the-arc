// src/backend/common/utils/box-score.mapper.ts

/** One player's stat line in a match, in the API's shape. */
export interface MappedPlayerMatchStats {
  points: number;
  fouls: number;
  threePointsMade: number;
  threePointsAttempted: number;
  twoPointsIntMade: number;
  twoPointsIntAttempted: number;
  twoPointsExtMade: number;
  twoPointsExtAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
  assists: number;
  turnovers: number;
  rebounds: {
    total: number;
    offensive: number;
    defensive: number;
  };
  steals: number;
  blocks: number;
  playtimeIntervals: number[][];
}

/** A box-score line with the player it belongs to. */
export interface BoxScoreLine {
  playerId: number;
  stats: MappedPlayerMatchStats;
}

/**
 * The counters of a stored line, by the name the scheduler writes
 * (STAT_COLUMNS in db/python/generation/match_generator.py).
 */
const COUNTERS = [
  "points",
  "fouls",
  "three_points_made",
  "three_points_attempted",
  "two_points_int_made",
  "two_points_int_attempted",
  "two_points_ext_made",
  "two_points_ext_attempted",
  "free_throws_made",
  "free_throws_attempted",
  "assists",
  "turnovers",
  "rebounds_offensive",
  "rebounds_defensive",
  "steals",
  "blocks",
] as const;

type Counter = (typeof COUNTERS)[number];

const LINE_KEYS = new Set<string>([...COUNTERS, "playtime_intervals"]);

const PLAYER_KEY = /^[1-9]\d*$/;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
  return Number.isSafeInteger(value) && (value as number) >= 0;
}

function isInterval(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    isCount(value[0]) &&
    isCount(value[1]) &&
    value[0] <= value[1]
  );
}

function parseIntervals(value: unknown, where: string): number[][] {
  if (!Array.isArray(value) || !value.every(isInterval)) {
    throw new Error(
      `${where}: playtime_intervals is not a list of [start, end] seconds`,
    );
  }
  return value;
}

function readCounters(
  line: Record<string, unknown>,
  where: string,
): Record<Counter, number> {
  const counters = {} as Record<Counter, number>;
  for (const counter of COUNTERS) {
    const value = line[counter];
    if (!isCount(value)) {
      throw new Error(`${where}: ${counter} is not a non-negative integer`);
    }
    counters[counter] = value;
  }
  return counters;
}

/**
 * Validates one stored line and maps it to the API's shape. Throws on a
 * missing, extra or ill-typed field: a line the code no longer agrees with is
 * an error to surface, not a zero to show.
 *
 * @param line - The line as stored, e.g. `box_score -> '42'`
 * @param where - Names the line in the error, e.g. `match 7, player 42`
 */
export function parseBoxScoreLine(
  line: unknown,
  where: string,
): MappedPlayerMatchStats {
  if (!isObject(line)) {
    throw new Error(`${where}: box-score line is not an object`);
  }
  const extra = Object.keys(line).filter((key) => !LINE_KEYS.has(key));
  if (extra.length > 0) {
    throw new Error(
      `${where}: unexpected box-score fields ${extra.join(", ")}`,
    );
  }
  const c = readCounters(line, where);

  return {
    points: c.points,
    fouls: c.fouls,
    threePointsMade: c.three_points_made,
    threePointsAttempted: c.three_points_attempted,
    twoPointsIntMade: c.two_points_int_made,
    twoPointsIntAttempted: c.two_points_int_attempted,
    twoPointsExtMade: c.two_points_ext_made,
    twoPointsExtAttempted: c.two_points_ext_attempted,
    freeThrowsMade: c.free_throws_made,
    freeThrowsAttempted: c.free_throws_attempted,
    assists: c.assists,
    turnovers: c.turnovers,
    rebounds: {
      total: c.rebounds_offensive + c.rebounds_defensive,
      offensive: c.rebounds_offensive,
      defensive: c.rebounds_defensive,
    },
    steals: c.steals,
    blocks: c.blocks,
    playtimeIntervals: parseIntervals(line.playtime_intervals, where),
  };
}

/**
 * Validates a match's stored box score (`matches.box_score`) and maps it to
 * one line per player, by player id. Throws on anything malformed, naming the
 * match and the player.
 *
 * @param boxScore - The column's value
 * @param matchId - The match it belongs to, for the error
 */
export function parseBoxScore(
  boxScore: unknown,
  matchId: number,
): BoxScoreLine[] {
  if (!isObject(boxScore)) {
    throw new Error(`match ${matchId}: box score is not an object`);
  }
  return Object.entries(boxScore)
    .map(([key, line]) => {
      if (!PLAYER_KEY.test(key)) {
        throw new Error(
          `match ${matchId}: box-score key ${key} is no player id`,
        );
      }
      return {
        playerId: Number(key),
        stats: parseBoxScoreLine(line, `match ${matchId}, player ${key}`),
      };
    })
    .sort((a, b) => a.playerId - b.playerId);
}
