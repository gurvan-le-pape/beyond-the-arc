// src/backend/modules/teams/teams.service.ts
import { CompetitionLevel } from "@common/constants";
import { PaginatedResponseDto } from "@common/dto";
import { Category, Gender } from "@common/index";
import {
  buildClubOrganizationWhere,
  mapPlayerMatchStats,
  mapPlayerSummary,
  PLAYER_MATCH_STAT_FIELDS_SELECT,
  resolvePagination,
} from "@common/utils";
import { aggregateCareerStats } from "@modules/players/aggregate-career-stats";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../prisma/generated/prisma/client";
import { aggregateTeamSeasonStats } from "./aggregate-team-season-stats";
import type {
  FilterValuesTeamsResponseDto,
  TeamDetailResponseDto,
  TeamMatchHistoryDto,
  TeamMatchHistoryResponseDto,
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
  seasonYear: true,
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
  seasonYear: true,
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
      position: true,
      teamId: true,
      stats: {
        select: PLAYER_MATCH_STAT_FIELDS_SELECT,
      },
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
          position: true,
          teamId: true,
        },
      },
      ...PLAYER_MATCH_STAT_FIELDS_SELECT,
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
  search?: string;
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
    const { page, limit, skip } = resolvePagination(filters ?? {});
    const where = this.buildWhereClause(filters);

    const [teams, total] = await Promise.all([
      this.prisma.client.teams.findMany({
        where,
        select: TEAM_SELECT,
        orderBy: { club: { name: "asc" } },
        skip,
        take: limit,
      }),
      this.prisma.client.teams.count({ where }),
    ]);

    return {
      items: teams.map((t) => this.mapToDto(t)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
    const clubWhere = buildClubOrganizationWhere(filters);
    const teamWhere: Prisma.TeamsWhereInput = clubWhere
      ? { club: clubWhere }
      : {};

    const [numbers, pools, championships] = await Promise.all([
      this.prisma.client.teams.findMany({
        where: teamWhere,
        select: { number: true },
        distinct: ["number"],
        orderBy: { number: "asc" },
      }),
      this.prisma.client.pools.findMany({
        where: clubWhere ? { teams: { some: teamWhere } } : {},
        select: { letter: true },
        distinct: ["letter"],
        orderBy: { letter: "asc" },
      }),
      this.prisma.client.championships.findMany({
        where: clubWhere
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
    const team = await this.prisma.client.teams.findUnique({
      where: { id },
      select: TEAM_DETAIL_SELECT,
    });

    if (!team) {
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
  async findTeamMatchHistory(
    teamId: number,
  ): Promise<TeamMatchHistoryResponseDto> {
    const teamExists = await this.prisma.client.teams.findUnique({
      where: { id: teamId },
      select: { id: true },
    });

    if (!teamExists) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    const matchRows = await this.prisma.client.matches.findMany({
      where: {
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
      select: TEAM_MATCH_HISTORY_SELECT,
      orderBy: { date: "desc" },
    });

    const matches = matchRows.map((match) => this.mapToMatchHistoryDto(match));

    return {
      matches,
      seasonStats: aggregateTeamSeasonStats(teamId, matches),
    };
  }

  /**
   * Maps a Prisma team entity to a response DTO.
   */
  private mapToDto(entity: TeamSelectResult): TeamResponseDto {
    return {
      id: entity.id,
      number: entity.number,
      clubId: entity.clubId,
      seasonYear: entity.seasonYear,
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
        ...mapPlayerSummary(p),
        seasonStats: aggregateCareerStats(p.stats.map(mapPlayerMatchStats)),
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
        player: mapPlayerSummary(stat.player),
        stats: mapPlayerMatchStats(stat),
      })),
    } satisfies TeamMatchHistoryDto;
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
    const clubWhere: Prisma.ClubsWhereInput = {
      ...buildClubOrganizationWhere(filters),
    };

    if (filters?.clubId) clubWhere.id = filters.clubId;

    if (filters?.search) {
      clubWhere.name = { contains: filters.search, mode: "insensitive" };
    }

    return Object.keys(clubWhere).length > 0 ? clubWhere : undefined;
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
