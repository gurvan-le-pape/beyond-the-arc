// src/backend/modules/matches/matches.service.ts
import { MatchEventRole, Position } from "@common/constants";
import { PaginatedResponseDto } from "@common/dto";
import { Category, CompetitionLevel, Gender } from "@common/index";
import { mapPlayerMatchStats, normalizeLimit, normalizePage } from "@common/utils";
import { Injectable, NotFoundException } from "@nestjs/common";
import { fromZonedTime } from "date-fns-tz";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../prisma/generated/prisma/client";
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
          committeeId: true,
          committee: {
            select: { leagueId: true },
          },
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
          committeeId: true,
          committee: {
            select: { leagueId: true },
          },
        },
      },
    },
  },
  homeTeamScore: true,
  awayTeamScore: true,
  forfeit: true,
  overtime: true,
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
      position: true,
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
  constructor(private readonly prisma: PrismaService) {}

  async findAllMatches(
    filters?: MatchFilters,
  ): Promise<PaginatedResponseDto<MatchDetailResponseDto>> {
    const page = normalizePage(filters?.page ?? 1);
    const limit = normalizeLimit(filters?.limit ?? 50);
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(filters);

    const [matches, total] = await Promise.all([
      this.prisma.client.matches.findMany({
        where,
        select: MATCH_LIST_SELECT,
        orderBy: { date: "desc" },
        skip,
        take: limit,
      }),
      this.prisma.client.matches.count({ where }),
    ]);

    return {
      items: matches.map((m) => this.mapMatchToDto(m)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findMatchById(matchId: number): Promise<MatchDetailResponseDto> {
    const match = await this.prisma.client.matches.findUnique({
      where: { id: matchId },
      select: MATCH_DETAIL_SELECT,
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    return this.mapMatchDetailToDto(match);
  }

  async findMatchesByPoolId(poolId: number): Promise<MatchDetailResponseDto[]> {
    const matches = await this.prisma.client.matches.findMany({
      where: { poolId },
      select: MATCH_LIST_SELECT,
      orderBy: { date: "asc" },
    });

    return matches.map((m) => this.mapMatchToDto(m));
  }

  async findPlayerMatchStatsByMatchId(
    matchId: number,
  ): Promise<MatchPlayerStatsResponseDto> {
    const match = await this.prisma.client.matches.findUnique({
      where: { id: matchId },
      select: { homeTeamId: true, awayTeamId: true },
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${matchId} not found`);
    }

    const stats = await this.prisma.client.playerMatchStats.findMany({
      where: { matchId },
      select: PLAYER_MATCH_STATS_SELECT,
    });

    return {
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      stats: this.mapToPlayerStats(stats),
    };
  }

  async findMatchEventsByMatchId(matchId: number): Promise<MatchEventDto[]> {
    const events = await this.prisma.client.matchEvents.findMany({
      where: { matchId },
      select: MATCH_EVENT_SELECT,
      orderBy: { timestamp: "asc" },
    });

    return events.map((e) => this.mapEventToDto(e));
  }

  async findMatchEventsByTeamId(teamId: number): Promise<MatchEventDto[]> {
    const matches = await this.prisma.client.matches.findMany({
      where: { OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }] },
      select: { id: true },
    });

    const matchIds = matches.map((m) => m.id);

    if (matchIds.length === 0) {
      return [];
    }

    const events = await this.prisma.client.matchEvents.findMany({
      where: {
        matchId: { in: matchIds },
        shotLocation: { isNot: null },
        players: { some: { player: { teamId } } },
      },
      select: { ...MATCH_EVENT_SELECT, matchId: true },
      orderBy: { timestamp: "asc" },
    });

    return events.map((e) => this.mapEventToDto(e));
  }

  async findMatchEventsByPlayerId(playerId: number): Promise<MatchEventDto[]> {
    const events = await this.prisma.client.matchEvents.findMany({
      where: {
        shotLocation: { isNot: null },
        players: { some: { playerId } },
      },
      select: { ...MATCH_EVENT_SELECT, matchId: true },
      orderBy: { timestamp: "asc" },
    });

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
      overtime: match.overtime,
      pool: {
        id: match.pool.id,
        name: match.pool.name,
        championship: {
          id: match.pool.championship.id,
          category: match.pool.championship.category as Category,
          gender: match.pool.championship.gender as Gender,
          level: match.pool.championship.level as CompetitionLevel,
          division: match.pool.championship.division,
        },
      },
      homeTeam: {
        id: match.homeTeam.id,
        number: match.homeTeam.number,
        club: {
          id: match.homeTeam.club.id,
          name: match.homeTeam.club.name,
          committeeId: match.homeTeam.club.committeeId,
          leagueId: match.homeTeam.club.committee.leagueId,
        },
      },
      awayTeam: {
        id: match.awayTeam.id,
        number: match.awayTeam.number,
        club: {
          id: match.awayTeam.club.id,
          name: match.awayTeam.club.name,
          committeeId: match.awayTeam.club.committeeId,
          leagueId: match.awayTeam.club.committee.leagueId,
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
        role: p.role as MatchEventRole,
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
        position: stat.player.position as Position,
        teamId: stat.player.teamId,
        team: stat.player.team,
      },
      stats: {
        ...mapPlayerMatchStats(stat),
        playtime: this.calculatePlaytime(
          stat.playtimeIntervals as number[][] | null,
        ),
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

  private buildPoolFilter(
    filters?: MatchFilters,
  ): Prisma.PoolsWhereInput | undefined {
    if (filters?.poolId) return undefined;
    if (
      !filters?.level &&
      !filters?.division &&
      !filters?.category &&
      !filters?.gender
    )
      return undefined;

    const championship: Prisma.ChampionshipsWhereInput = {};
    if (filters?.level) championship.level = filters.level;
    if (filters?.division) championship.division = filters.division;
    if (filters?.category) championship.category = filters.category;
    if (filters?.gender) championship.gender = filters.gender;

    return { championship };
  }

  private buildOrganizationFilter(
    filters?: MatchFilters,
  ): Prisma.MatchesWhereInput[] | undefined {
    if (!filters?.committeeId && !filters?.leagueId) return undefined;

    const buildClubFilter = (): Prisma.ClubsWhereInput => {
      const club: Prisma.ClubsWhereInput = {};
      if (filters?.committeeId) club.committeeId = filters.committeeId;
      if (filters?.leagueId) club.committee = { leagueId: filters.leagueId };
      return club;
    };

    const club = buildClubFilter();
    return [{ homeTeam: { club } }, { awayTeam: { club } }];
  }

  private buildSearchFilter(search: string): Prisma.MatchesWhereInput[] {
    return [
      {
        homeTeam: { club: { name: { contains: search, mode: "insensitive" } } },
      },
      {
        awayTeam: { club: { name: { contains: search, mode: "insensitive" } } },
      },
    ];
  }

  /**
   * Builds the Prisma where clause from filters.
   *
   * @param filters - Match filters
   * @returns Prisma where clause
   */
  private buildWhereClause(filters?: MatchFilters): Prisma.MatchesWhereInput {
    const where: Prisma.MatchesWhereInput = {};

    if (filters?.poolId) where.poolId = filters.poolId;

    const poolFilter = this.buildPoolFilter(filters);
    if (filters?.championshipId && poolFilter) {
      where.pool = { championshipId: filters.championshipId, ...poolFilter };
    } else if (filters?.championshipId) {
      where.pool = { championshipId: filters.championshipId };
    } else if (poolFilter) {
      where.pool = poolFilter;
    }

    const orgFilter = this.buildOrganizationFilter(filters);
    const searchFilter = filters?.search
      ? this.buildSearchFilter(filters.search)
      : undefined;

    // Both are OR-groups over home/away team, so when both apply they must be
    // AND-ed — assigning each to `where.OR` would let one overwrite the other.
    if (orgFilter && searchFilter) {
      where.AND = [{ OR: orgFilter }, { OR: searchFilter }];
    } else if (orgFilter) {
      where.OR = orgFilter;
    } else if (searchFilter) {
      where.OR = searchFilter;
    }

    if (filters?.matchday) where.matchday = filters.matchday;

    if (filters?.date) {
      where.date = {
        gte: fromZonedTime(
          new Date(filters.date + "T00:00:00"),
          "Europe/Paris",
        ),
        lt: fromZonedTime(
          new Date(filters.date + "T23:59:59.999"),
          "Europe/Paris",
        ),
      };
    }

    return where;
  }
}
