// src/backend/modules/teams/teams.service.ts
import { CompetitionLevel } from "@common/constants/competition-levels";
import { PaginatedResponseDto } from "@common/dto/paginated-response.dto";
import { Category, Gender } from "@common/index";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

import type {
  FilterValuesTeamsResponseDto,
  TeamDetailResponseDto,
  TeamMatchHistoryDto,
  TeamResponseDto,
} from "./dto/teams.response.dto";

/**
 * Fields to select from the teams table with full relations.
 * Single source of truth for consistent queries.
 */
const TEAM_SELECT = {
  id: true,
  number: true,
  clubId: true,
  category: true,
  gender: true,
  color: true,
  poolId: true,
  club: {
    select: {
      id: true,
      name: true,
      committee: {
        select: {
          id: true,
          name: true,
          league: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
  pool: {
    select: {
      id: true,
      name: true,
      letter: true,
      championship: {
        select: {
          id: true,
          name: true,
          level: true,
          division: true,
        },
      },
    },
  },
  _count: {
    select: {
      players: true,
    },
  },
} as const;

/**
 * Fields to select for team details with players and matches.
 */
const TEAM_DETAIL_SELECT = {
  id: true,
  number: true,
  clubId: true,
  category: true,
  gender: true,
  color: true,
  poolId: true,
  club: {
    select: {
      id: true,
      name: true,
      committee: {
        select: {
          id: true,
          name: true,
          league: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  },
  pool: {
    select: {
      id: true,
      name: true,
      letter: true,
      championship: {
        select: {
          id: true,
          name: true,
          level: true,
          division: true,
        },
      },
    },
  },
  _count: {
    select: {
      players: true,
    },
  },
  players: {
    select: {
      id: true,
      name: true,
      number: true,
      teamId: true,
    },
    orderBy: {
      number: "asc" as const,
    },
  },
  homeMatches: {
    select: {
      id: true,
      date: true,
      homeTeamScore: true,
      awayTeamScore: true,
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
      pool: {
        select: {
          id: true,
          name: true,
          championship: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "desc" as const,
    },
    take: 5,
  },
  awayMatches: {
    select: {
      id: true,
      date: true,
      homeTeamScore: true,
      awayTeamScore: true,
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
      pool: {
        select: {
          id: true,
          name: true,
          championship: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "desc" as const,
    },
    take: 5,
  },
} as const;

/**
 * Fields to select for match history queries.
 */
const TEAM_MATCH_HISTORY_SELECT = {
  id: true,
  date: true,
  homeTeamScore: true,
  awayTeamScore: true,
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
  playerMatchStats: {
    select: {
      player: {
        select: {
          id: true,
          name: true,
          number: true,
          teamId: true,
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
    },
  },
} as const;

/**
 * Types derived from Prisma select objects.
 * Always in sync with the actual queries.
 */
type TeamSelectResult = Prisma.TeamsGetPayload<{
  select: typeof TEAM_SELECT;
}>;

type TeamDetailSelectResult = Prisma.TeamsGetPayload<{
  select: typeof TEAM_DETAIL_SELECT;
}>;

type MatchSelectResult = Prisma.MatchesGetPayload<{
  select: typeof TEAM_MATCH_HISTORY_SELECT;
}>;

/**
 * Filters for querying teams.
 */
type TeamFilters = {
  clubId?: number;
  level?: CompetitionLevel;
  division?: number;
  committeeId?: number;
  leagueId?: number;
  number?: number;
  category?: Category;
  gender?: Gender;
  clubName?: string;
  poolLetter?: string;
  page?: number;
  limit?: number;
};

/**
 * Service handling business logic for teams.
 * Encapsulates database access and domain logic.
 */
@Injectable()
export class TeamsService {
  private readonly logger = new Logger(TeamsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all teams with optional filters and pagination.
   *
   * @param filters - Optional filters and pagination params
   * @returns Paginated list of teams
   */
  async findAllTeams(
    filters?: TeamFilters,
  ): Promise<PaginatedResponseDto<TeamResponseDto>> {
    this.logger.log(
      `[findAllTeams] Fetching teams with filters: ${JSON.stringify(filters)}`,
    );

    const page = this.validatePage(filters?.page ?? 1);
    const limit = this.validateLimit(filters?.limit ?? 50);
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(filters);

    try {
      const [teams, total] = await Promise.all([
        this.prisma.teams.findMany({
          where,
          select: TEAM_SELECT,
          orderBy: { club: { name: "asc" } },
          skip,
          take: limit,
        }),
        this.prisma.teams.count({ where }),
      ]);

      this.logger.log(
        `[findAllTeams] Found ${teams.length} teams (total: ${total})`,
      );

      return {
        items: teams.map((t) => this.mapToDto(t)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error("[findAllTeams] Failed to fetch teams", error);
      throw error;
    }
  }

  /**
   * Retrieves available filter values for team queries.
   * Intended for populating filter dropdowns on the frontend.
   *
   * @returns Available numbers, pool letters, and divisions
   */
  async findTeamFilterValues(filters?: {
    committeeId?: number;
    leagueId?: number;
  }): Promise<FilterValuesTeamsResponseDto> {
    this.logger.log("[findTeamFilterValues] Fetching team filter values");

    const clubWhere: Prisma.ClubsWhereInput = {};
    if (filters?.committeeId) {
      clubWhere.committeeId = filters.committeeId;
    } else if (filters?.leagueId) {
      clubWhere.committee = { leagueId: filters.leagueId };
    }

    const hasClubFilter = Object.keys(clubWhere).length > 0;
    const teamWhere: Prisma.TeamsWhereInput = hasClubFilter
      ? { club: clubWhere }
      : {};

    const [numbers, pools, championships] = await Promise.all([
      this.prisma.teams.findMany({
        where: teamWhere,
        select: { number: true },
        distinct: ["number"],
        orderBy: { number: "asc" },
      }),
      this.prisma.pools.findMany({
        where: hasClubFilter ? { teams: { some: teamWhere } } : {},
        select: { letter: true },
        distinct: ["letter"],
        orderBy: { letter: "asc" },
      }),
      this.prisma.championships.findMany({
        where: hasClubFilter
          ? { pools: { some: { teams: { some: teamWhere } } } }
          : {},
        select: { division: true },
        distinct: ["division"],
        orderBy: { division: "asc" },
      }),
    ]);

    return {
      numbers: numbers.map((t) => t.number),
      poolLetters: pools.map((p) => p.letter),
      divisions: championships
        .map((c) => c.division)
        .filter((d): d is number => d !== null),
    };
  }

  /**
   * Finds a team by ID with full details including players and recent matches.
   *
   * @param id - The team ID
   * @returns Team with full details
   * @throws NotFoundException if team doesn't exist
   */
  async findTeamById(id: number): Promise<TeamDetailResponseDto> {
    this.logger.log(`[findTeamById] Fetching team with ID: ${id}`);

    const team = await this.prisma.teams.findUnique({
      where: { id },
      select: TEAM_DETAIL_SELECT,
    });

    if (!team) {
      this.logger.warn(`[findTeamById] Team with ID ${id} not found`);
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    return this.mapToDetailDto(team);
  }

  /**
   * Retrieves match history for a specific team.
   *
   * @param teamId - The team ID
   * @returns Array of match history entries
   * @throws NotFoundException if team doesn't exist
   */
  async findTeamMatchHistory(teamId: number): Promise<TeamMatchHistoryDto[]> {
    this.logger.log(
      `[findTeamMatchHistory] Fetching match history for team ID: ${teamId}`,
    );

    const teamExists = await this.prisma.teams.findUnique({
      where: { id: teamId },
      select: { id: true },
    });

    if (!teamExists) {
      this.logger.warn(
        `[findTeamMatchHistory] Team with ID ${teamId} not found`,
      );
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const matches = await this.prisma.matches.findMany({
      where: {
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
      select: TEAM_MATCH_HISTORY_SELECT,
      orderBy: { date: "desc" },
    });

    this.logger.log(
      `[findTeamMatchHistory] Found ${matches.length} matches for team ID: ${teamId}`,
    );

    return matches.map((match) => this.mapToMatchHistoryDto(match));
  }

  /**
   * Maps a Prisma team entity to a response DTO.
   */
  private mapToDto(entity: TeamSelectResult): TeamResponseDto {
    return {
      id: entity.id,
      number: entity.number,
      clubId: entity.clubId,
      category: entity.category as Category,
      gender: entity.gender as Gender,
      color: entity.color,
      poolId: entity.poolId,
      club: {
        id: entity.club.id,
        name: entity.club.name,
        committee: entity.club.committee,
      },
      pool: entity.pool
        ? {
            id: entity.pool.id,
            name: entity.pool.name,
            letter: entity.pool.letter,
            championship: {
              id: entity.pool.championship.id,
              name: entity.pool.championship.name,
              level: entity.pool.championship.level as CompetitionLevel,
              division: entity.pool.championship.division,
            },
          }
        : null,
      _count: {
        players: entity._count.players,
      },
    } satisfies TeamResponseDto;
  }

  /**
   * Maps a Prisma team detail entity to a detail response DTO.
   */
  private mapToDetailDto(
    entity: TeamDetailSelectResult,
  ): TeamDetailResponseDto {
    const baseDto = this.mapToDto(entity);

    return {
      ...baseDto,
      players: entity.players.map((p) => ({
        id: p.id,
        name: p.name,
        number: p.number,
        teamId: p.teamId,
      })),
      homeMatches: entity.homeMatches,
      awayMatches: entity.awayMatches,
    } satisfies TeamDetailResponseDto;
  }

  /**
   * Maps a Prisma match entity to a match history DTO.
   */
  private mapToMatchHistoryDto(match: MatchSelectResult): TeamMatchHistoryDto {
    return {
      id: match.id,
      date: match.date,
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
      homeTeamScore: match.homeTeamScore,
      awayTeamScore: match.awayTeamScore,
      players: match.playerMatchStats.map((stat) => ({
        player: {
          id: stat.player.id,
          name: stat.player.name,
          number: stat.player.number,
          teamId: stat.player.teamId,
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
          playtimeIntervals: stat.playtimeIntervals as number[][] | null,
        },
      })),
    } satisfies TeamMatchHistoryDto;
  }

  /**
   * Validates and normalizes page number.
   */
  private validatePage(page: number): number {
    return page > 0 ? page : 1;
  }

  /**
   * Validates and normalizes limit.
   */
  private validateLimit(limit: number): number {
    return limit > 0 ? Math.min(limit, 100) : 50;
  }

  private buildPoolFilter(
    filters?: TeamFilters,
  ): Prisma.PoolsWhereInput | undefined {
    if (!filters?.level && !filters?.division && !filters?.poolLetter)
      return undefined;

    const championship: Prisma.ChampionshipsWhereInput = {};
    if (filters?.level) championship.level = filters.level;
    if (filters?.division) championship.division = filters.division;

    return {
      championship,
      ...(filters?.poolLetter ? { letter: filters.poolLetter } : {}),
    };
  }

  private buildClubFilter(
    filters?: TeamFilters,
  ): Prisma.ClubsWhereInput | undefined {
    if (
      !filters?.clubId &&
      !filters?.committeeId &&
      !filters?.leagueId &&
      !filters?.clubName
    )
      return undefined;

    const clubWhere: Prisma.ClubsWhereInput = {};

    if (filters?.clubId) clubWhere.id = filters.clubId;

    if (
      filters?.level === CompetitionLevel.DEPARTMENTAL &&
      filters?.committeeId
    ) {
      clubWhere.committeeId = filters.committeeId;
    } else if (
      filters?.level === CompetitionLevel.REGIONAL &&
      filters?.leagueId
    ) {
      clubWhere.committee = { leagueId: filters.leagueId };
    }

    if (filters?.clubName) {
      clubWhere.name = { contains: filters.clubName, mode: "insensitive" };
    }

    return clubWhere;
  }

  /**
   * Builds the Prisma where clause from filters.
   *
   * @param filters - Team filters
   * @returns Prisma where clause
   */
  private buildWhereClause(filters?: TeamFilters): Prisma.TeamsWhereInput {
    const where: Prisma.TeamsWhereInput = {};

    const poolFilter = this.buildPoolFilter(filters);
    if (poolFilter) where.pool = poolFilter;

    const clubFilter = this.buildClubFilter(filters);
    if (clubFilter) where.club = clubFilter;

    if (filters?.number !== undefined) where.number = filters.number;
    if (filters?.category) where.category = filters.category;
    if (filters?.gender) where.gender = filters.gender;

    return where;
  }
}
