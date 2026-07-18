// src/backend/common/utils/player-match-stats.mapper.ts
export interface PlayerMatchStatFields {
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
  reboundsOffensive: number;
  reboundsDefensive: number;
  steals: number;
  blocks: number;
  playtimeIntervals: unknown;
}

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

/**
 * Prisma select for the scalar stat columns consumed by mapPlayerMatchStats.
 * Spread into each service's playerMatchStats select alongside its own
 * relation fields; `satisfies` keeps it in sync with PlayerMatchStatFields.
 */
export const PLAYER_MATCH_STAT_FIELDS_SELECT = {
  points: true,
  fouls: true,
  threePointsMade: true,
  threePointsAttempted: true,
  twoPointsIntMade: true,
  twoPointsIntAttempted: true,
  twoPointsExtMade: true,
  twoPointsExtAttempted: true,
  freeThrowsMade: true,
  freeThrowsAttempted: true,
  assists: true,
  turnovers: true,
  reboundsOffensive: true,
  reboundsDefensive: true,
  steals: true,
  blocks: true,
  playtimeIntervals: true,
} as const satisfies Record<keyof PlayerMatchStatFields, true>;

/**
 * Maps the Prisma player-match-stats fields shared by teams/matches/players
 * services into the common API stats shape. playtimeIntervals is stored as
 * Json in Prisma — expected shape: number[][].
 */
export function mapPlayerMatchStats(
  stat: PlayerMatchStatFields,
): MappedPlayerMatchStats {
  return {
    points: stat.points,
    fouls: stat.fouls,
    threePointsMade: stat.threePointsMade,
    threePointsAttempted: stat.threePointsAttempted,
    twoPointsIntMade: stat.twoPointsIntMade,
    twoPointsIntAttempted: stat.twoPointsIntAttempted,
    twoPointsExtMade: stat.twoPointsExtMade,
    twoPointsExtAttempted: stat.twoPointsExtAttempted,
    freeThrowsMade: stat.freeThrowsMade,
    freeThrowsAttempted: stat.freeThrowsAttempted,
    assists: stat.assists,
    turnovers: stat.turnovers,
    rebounds: {
      total: stat.reboundsOffensive + stat.reboundsDefensive,
      offensive: stat.reboundsOffensive,
      defensive: stat.reboundsDefensive,
    },
    steals: stat.steals,
    blocks: stat.blocks,
    playtimeIntervals: stat.playtimeIntervals as number[][],
  };
}
