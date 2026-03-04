// src/backend/modules/matches/matches.service.ts
import { Role } from "@common/constants/roles";
import { PaginatedResponseDto } from "@common/dto/paginated-response.dto";
import { Category, CompetitionLevel, Gender } from "@common/index";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

import type {
  MatchDetailResponseDto,
  MatchEventDto,
  MatchPlayerStatsResponseDto,
  PlayerWithStatsDto,
} from "./dto/matches.response.dto";

export interface MatchFilters {
  level?: CompetitionLevel;
  division?: number;
  committeeId?: number;
  leagueId?: number;
  category?: Category;
  gender?: Gender;
  poolId?: number;
  championshipId?: number;
  matchday?: number;
  date?: string;
  search?: string;
  page?: number;
  limit?: number;
}

const MATCH_LIST_SELECT = {
  id: true,
  date: true,
  matchday: true,
  pool: {
    select: {
      id: true,
      name: true,
      championship: {
        select: {
          id: true,
          category: true,
          gender: true,
          level: true,
          division: true,
        },
      },
    },
  },
  homeTeam: {
    select: {
      id: true,
      number: true,
      club: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  awayTeam: {
    select: {
      id: true,
      number: true,
      club: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  homeTeamScore: true,
  awayTeamScore: true,
  forfeit: true,
} as const;

/**
 * Extended select for match detail — includes events.
 */
const MATCH_DETAIL_SELECT = {
  ...MATCH_LIST_SELECT,
  matchEvents: {
    select: {
      id: true,
      eventType: true,
      timestamp: true,
      description: true,
      players: {
        select: {
          role: true,
          player: {
            select: {
              id: true,
              name: true,
              number: true,
              team: {
                select: {
                  id: true,
                  club: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      shotLocation: {
        select: {
          id: true,
          x: true,
          y: true,
        },
      },
    },
    orderBy: { timestamp: "asc" as const },
  },
} as const;

const MATCH_EVENT_SELECT = {
  id: true,
  eventType: true,
  timestamp: true,
  description: true,
  players: {
    select: {
      role: true,
      player: {
        select: {
          id: true,
          name: true,
          number: true,
          team: {
            select: {
              id: true,
              club: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  },
  shotLocation: {
    select: {
      id: true,
      x: true,
      y: true,
    },
  },
} as const;

const PLAYER_MATCH_STATS_SELECT = {
  player: {
    select: {
      id: true,
      name: true,
      number: true,
      teamId: true,
      team: {
        select: {
          id: true,
          number: true,
          club: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
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
} as const;

type MatchListResult = Prisma.MatchesGetPayload<{
  select: typeof MATCH_LIST_SELECT;
}>;

type MatchDetailResult = Prisma.MatchesGetPayload<{
  select: typeof MATCH_DETAIL_SELECT;
}>;

type MatchEventResult = Prisma.MatchEventsGetPayload<{
  select: typeof MATCH_EVENT_SELECT;
}>;

type PlayerMatchStatsResult = Prisma.PlayerMatchStatsGetPayload<{
  select: typeof PLAYER_MATCH_STATS_SELECT;
}>;

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAllMatches(
    filters?: MatchFilters,
  ): Promise<PaginatedResponseDto<MatchDetailResponseDto>> {
    this.logger.log(
      `Fetching matches with filters: ${JSON.stringify(filters)}`,
    );

    const page = this.validatePage(filters?.page ?? 1);
    const limit = this.validateLimit(filters?.limit ?? 50);
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(filters);

    this.logger.log(`Where clause: ${JSON.stringify(where)}`);

    try {
      const [matches, total] = await Promise.all([
        this.prisma.matches.findMany({
          where,
          select: MATCH_LIST_SELECT,
          orderBy: { date: "desc" },
          skip,
          take: limit,
        }),
        this.prisma.matches.count({ where }),
      ]);

      this.logger.log(`Found ${matches.length} matches (total: ${total})`);

      return {
        items: matches.map((m) => this.mapMatchToDto(m)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error("Failed to fetch matches", error);
      throw error;
    }
  }

  async findMatchById(matchId: number): Promise<MatchDetailResponseDto> {
    this.logger.log(`Fetching match with ID: ${matchId}`);

    const match = await this.prisma.matches.findUnique({
      where: { id: matchId },
      select: MATCH_DETAIL_SELECT,
    });

    if (!match) {
      this.logger.warn(`Match with ID ${matchId} not found`);
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    return this.mapMatchDetailToDto(match);
  }

  async findMatchesByPoolId(poolId: number): Promise<MatchDetailResponseDto[]> {
    this.logger.log(`Fetching matches for pool ID: ${poolId}`);

    const matches = await this.prisma.matches.findMany({
      where: { poolId },
      select: MATCH_LIST_SELECT,
      orderBy: { date: "asc" },
    });

    this.logger.log(`Found ${matches.length} matches for pool ID: ${poolId}`);
    return matches.map((m) => this.mapMatchToDto(m));
  }

  async findMatchesByChampionshipId(
    championshipId: number,
  ): Promise<MatchDetailResponseDto[]> {
    this.logger.log(`Fetching matches for championship ID: ${championshipId}`);

    const matches = await this.prisma.matches.findMany({
      where: { pool: { championshipId } },
      select: MATCH_LIST_SELECT,
      orderBy: { date: "asc" },
    });

    this.logger.log(
      `Found ${matches.length} matches for championship ID: ${championshipId}`,
    );
    return matches.map((m) => this.mapMatchToDto(m));
  }

  async findPlayerMatchStatsByMatchId(
    matchId: number,
  ): Promise<MatchPlayerStatsResponseDto> {
    this.logger.log(`Fetching player stats for match ID: ${matchId}`);

    const match = await this.prisma.matches.findUnique({
      where: { id: matchId },
      select: { homeTeamId: true, awayTeamId: true },
    });

    if (!match) {
      this.logger.warn(`Match with ID ${matchId} not found`);
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    const stats = await this.prisma.playerMatchStats.findMany({
      where: { matchId },
      select: PLAYER_MATCH_STATS_SELECT,
    });

    this.logger.log(
      `Found stats for ${stats.length} players in match ID: ${matchId}`,
    );

    return {
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      stats: this.mapToPlayerStats(stats),
    };
  }

  async findMatchEventsByMatchId(matchId: number): Promise<MatchEventDto[]> {
    this.logger.log(`Fetching match events for match ID: ${matchId}`);

    const events = await this.prisma.matchEvents.findMany({
      where: { matchId },
      select: MATCH_EVENT_SELECT,
      orderBy: { timestamp: "asc" },
    });

    this.logger.log(`Found ${events.length} events for match ID: ${matchId}`);
    return events.map((e) => this.mapEventToDto(e));
  }

  async findMatchEventsByTeamId(teamId: number): Promise<MatchEventDto[]> {
    this.logger.log(`Fetching shot events for team ID: ${teamId}`);

    const matches = await this.prisma.matches.findMany({
      where: { OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }] },
      select: { id: true },
    });

    const matchIds = matches.map((m) => m.id);

    if (matchIds.length === 0) {
      this.logger.log(`No matches found for team ID: ${teamId}`);
      return [];
    }

    const events = await this.prisma.matchEvents.findMany({
      where: {
        matchId: { in: matchIds },
        shotLocation: { isNot: null },
        players: { some: { player: { teamId } } },
      },
      select: { ...MATCH_EVENT_SELECT, matchId: true },
      orderBy: { timestamp: "asc" },
    });

    this.logger.log(
      `Found ${events.length} shot events for team ID: ${teamId}`,
    );
    return events.map((e) => this.mapEventToDto(e));
  }

  async findMatchEventsByPlayerId(playerId: number): Promise<MatchEventDto[]> {
    this.logger.log(`Fetching shot events for player ID: ${playerId}`);

    const events = await this.prisma.matchEvents.findMany({
      where: {
        shotLocation: { isNot: null },
        players: { some: { playerId } },
      },
      select: { ...MATCH_EVENT_SELECT, matchId: true },
      orderBy: { timestamp: "asc" },
    });

    this.logger.log(
      `Found ${events.length} shot events for player ID: ${playerId}`,
    );
    return events.map((e) => this.mapEventToDto(e));
  }

  /**
   * Maps a list query result to MatchDetailResponseDto (no events).
   */
  private mapMatchToDto(match: MatchListResult): MatchDetailResponseDto {
    return {
      id: match.id,
      date: match.date,
      matchday: match.matchday,
      homeTeamScore: match.homeTeamScore,
      awayTeamScore: match.awayTeamScore,
      forfeit: match.forfeit,
      pool: match.pool
        ? {
            id: match.pool.id,
            name: match.pool.name,
            championship: {
              id: match.pool.championship.id,
              category: match.pool.championship.category as Category,
              gender: match.pool.championship.gender as Gender,
              level: match.pool.championship.level as CompetitionLevel,
              division: match.pool.championship.division,
            },
          }
        : null,
      homeTeam: {
        id: match.homeTeam.id,
        number: match.homeTeam.number,
        club: {
          id: match.homeTeam.club.id,
          name: match.homeTeam.club.name,
        },
      },
      awayTeam: {
        id: match.awayTeam.id,
        number: match.awayTeam.number,
        club: {
          id: match.awayTeam.club.id,
          name: match.awayTeam.club.name,
        },
      },
      matchEvents: [],
    };
  }

  /**
   * Maps a detail query result to MatchDetailResponseDto (with events).
   */
  private mapMatchDetailToDto(
    match: MatchDetailResult,
  ): MatchDetailResponseDto {
    return {
      ...this.mapMatchToDto(match),
      matchEvents: match.matchEvents.map((e) => this.mapEventToDto(e)),
    };
  }

  private mapEventToDto(
    event: MatchEventResult & { matchId?: number },
  ): MatchEventDto {
    return {
      id: event.id,
      matchId: event.matchId,
      eventType: event.eventType,
      timestamp: event.timestamp,
      description: event.description,
      players: event.players.map((p) => ({
        role: p.role as Role,
        player: {
          id: p.player.id,
          name: p.player.name,
          number: p.player.number,
          team: {
            id: p.player.team.id,
            club: { name: p.player.team.club.name },
          },
        },
      })),
      shotLocation: event.shotLocation
        ? {
            id: event.shotLocation.id,
            x: event.shotLocation.x.toNumber(),
            y: event.shotLocation.y.toNumber(),
          }
        : null,
    };
  }

  private mapToPlayerStats(
    stats: PlayerMatchStatsResult[],
  ): PlayerWithStatsDto[] {
    return stats.map((stat) => ({
      player: {
        id: stat.player.id,
        name: stat.player.name,
        number: stat.player.number,
        teamId: stat.player.teamId,
        team: stat.player.team,
      },
      stats: {
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
        playtime: this.calculatePlaytime(
          stat.playtimeIntervals as number[][] | null,
        ),
        // playtimeIntervals is stored as Json in Prisma — expected shape: number[][]
        playtimeIntervals: (stat.playtimeIntervals as number[][]) ?? null,
      },
    }));
  }

  private calculatePlaytime(intervals: number[][] | null): number {
    if (!intervals || intervals.length === 0) return 0;
    return intervals.reduce(
      (total, interval) => total + (interval[1] - interval[0]),
      0,
    );
  }

  private validatePage(page: number): number {
    return page > 0 ? page : 1;
  }

  private validateLimit(limit: number): number {
    return limit > 0 ? Math.min(limit, 100) : 50;
  }

  private buildWhereClause(filters?: MatchFilters): Prisma.MatchesWhereInput {
    const where: Prisma.MatchesWhereInput = {};

    if (filters?.poolId) {
      where.poolId = filters.poolId;
    }

    if (filters?.championshipId) {
      where.pool = { championshipId: filters.championshipId };
    }

    if (
      filters?.level ||
      filters?.division ||
      filters?.category ||
      filters?.gender
    ) {
      if (!where.pool) where.pool = {};
      const championship: Prisma.ChampionshipsWhereInput = {};
      if (filters?.level) championship.level = filters.level;
      if (filters?.division) championship.division = filters.division;
      if (filters?.category) championship.category = filters.category;
      if (filters?.gender) championship.gender = filters.gender;
      (where.pool as Prisma.PoolsWhereInput).championship = championship;
    }

    if (filters?.committeeId || filters?.leagueId) {
      const orClauses: Prisma.MatchesWhereInput[] = [];

      const homeTeamClub: Prisma.ClubsWhereInput = {};
      if (filters?.committeeId) homeTeamClub.committeeId = filters.committeeId;
      if (filters?.leagueId)
        homeTeamClub.committee = { leagueId: filters.leagueId };
      orClauses.push({ homeTeam: { club: homeTeamClub } });

      const awayTeamClub: Prisma.ClubsWhereInput = {};
      if (filters?.committeeId) awayTeamClub.committeeId = filters.committeeId;
      if (filters?.leagueId)
        awayTeamClub.committee = { leagueId: filters.leagueId };
      orClauses.push({ awayTeam: { club: awayTeamClub } });

      where.OR = orClauses;
    }

    if (filters?.matchday) {
      where.matchday = filters.matchday;
    }

    if (filters?.date) {
      where.date = {
        gte: new Date(filters.date + "T00:00:00.000Z"),
        lt: new Date(filters.date + "T23:59:59.999Z"),
      };
    }

    if (filters?.search) {
      where.OR = [
        {
          homeTeam: {
            club: { name: { contains: filters.search, mode: "insensitive" } },
          },
        },
        {
          awayTeam: {
            club: { name: { contains: filters.search, mode: "insensitive" } },
          },
        },
      ];
    }

    return where;
  }
}
