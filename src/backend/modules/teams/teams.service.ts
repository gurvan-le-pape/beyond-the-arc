// src/backend/modules/teams/teams.service.ts
import {
  Category,
  CompetitionLevel,
  Gender,
  MatchStatus,
} from "@common/constants";
import { PaginatedResponseDto } from "@common/dto";
import {
  aggregateCareerStats,
  buildChampionshipWhere,
  buildClubOrganizationWhere,
  mapPlayerSummary,
  nameContains,
  parseBoxScore,
  resolvePagination,
} from "@common/utils";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../prisma/generated/prisma/client";
import {
  aggregateTeamSeasonStats,
  type MatchParticipants,
} from "./aggregate-team-season-stats";
import type { GetTeamsQueryDto } from "./dto/teams.query.dto";
import type {
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
      letter: true,
      championship: {
        select: {
          id: true,
          seasonYear: true,
          category: true,
          gender: true,
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
 * Fields to select for team details with their roster.
 */
const TEAM_DETAIL_SELECT = {
  ...TEAM_SELECT,
  players: {
    select: {
      id: true,
      name: true,
      number: true,
      position: true,
      teamId: true,
    },
    orderBy: {
      number: "asc" as const,
    },
  },
} as const;

/**
 * Fields to select for match history queries.
 */
const TEAM_MATCH_HISTORY_SELECT = {
  id: true,
  startsAt: true,
  status: true,
  homeTeamScore: true,
  awayTeamScore: true,
  forfeit: true,
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

/** The matches a team plays in, home or away. */
function teamMatchesWhere(teamId: number): Prisma.MatchesWhereInput {
  return { OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }] };
}

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
    filters: GetTeamsQueryDto = {},
  ): Promise<PaginatedResponseDto<TeamResponseDto>> {
    const { page, limit, skip } = resolvePagination(filters);
    const where = this.buildWhereClause(filters);

    const [teams, total] = await Promise.all([
      this.prisma.client.teams.findMany({
        where,
        select: TEAM_SELECT,
        orderBy: [{ club: { name: "asc" } }, { id: "asc" }],
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
   * Finds a team by ID with its roster, each player's season stats and the
   * team's.
   *
   * @param id - The team ID
   * @returns Team with full details
   * @throws NotFoundException if team doesn't exist
   */
  async findTeamById(id: number): Promise<TeamDetailResponseDto> {
    const [team, boxScores] = await Promise.all([
      this.prisma.client.teams.findUnique({
        where: { id },
        select: TEAM_DETAIL_SELECT,
      }),
      this.prisma.client.matches.findMany({
        where: { ...teamMatchesWhere(id), status: MatchStatus.COMPLETED },
        select: { id: true, boxScore: true },
      }),
    ]);

    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }

    // One pass over the season's box scores feeds both the roster's stats and
    // the team's. A box score also holds the opponent's players, who are not
    // on this roster and are left out.
    const roster = new Map(
      team.players.map((p) => [p.id, mapPlayerSummary(p)]),
    );
    const matches = boxScores.map((match) => ({
      players: parseBoxScore(match.boxScore, match.id).flatMap(
        ({ playerId, stats }) => {
          const player = roster.get(playerId);
          return player ? [{ player, stats }] : [];
        },
      ),
    }));

    return this.mapToDetailDto(team, matches);
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

    const matches = await this.prisma.client.matches.findMany({
      where: teamMatchesWhere(teamId),
      select: TEAM_MATCH_HISTORY_SELECT,
      orderBy: { startsAt: "desc" },
    });

    return {
      matches: matches.map((match) => this.mapToMatchHistoryDto(match)),
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
      seasonYear: entity.pool.championship.seasonYear,
      category: entity.pool.championship.category as Category,
      gender: entity.pool.championship.gender as Gender,
      poolId: entity.poolId,
      club: {
        id: entity.club.id,
        name: entity.club.name,
        committee: entity.club.committee,
      },
      pool: {
        id: entity.pool.id,
        letter: entity.pool.letter,
        championship: {
          id: entity.pool.championship.id,
          level: entity.pool.championship.level as CompetitionLevel,
          division: entity.pool.championship.division,
        },
      },
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
    matches: readonly MatchParticipants[],
  ): TeamDetailResponseDto {
    const lines = matches.flatMap((match) => match.players);

    return {
      ...this.mapToDto(entity),
      players: entity.players.map((p) => ({
        ...mapPlayerSummary(p),
        seasonStats: aggregateCareerStats(
          lines.filter((line) => line.player.id === p.id).map((l) => l.stats),
        ),
      })),
      seasonStats: aggregateTeamSeasonStats(entity.id, matches),
    } satisfies TeamDetailResponseDto;
  }

  /**
   * Maps a Prisma match entity to a match history DTO.
   */
  private mapToMatchHistoryDto(match: MatchSelectResult): TeamMatchHistoryDto {
    return {
      id: match.id,
      startsAt: match.startsAt,
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
      status: match.status as MatchStatus,
      homeTeamScore: match.homeTeamScore,
      awayTeamScore: match.awayTeamScore,
      forfeit: match.forfeit,
    } satisfies TeamMatchHistoryDto;
  }

  private buildPoolFilter(
    filters: GetTeamsQueryDto,
  ): Prisma.PoolsWhereInput | undefined {
    // A pool id already fixes the championship.
    if (filters.poolId) return undefined;

    const championship = buildChampionshipWhere(filters);
    return championship ? { championship } : undefined;
  }

  private buildClubFilter(
    filters: GetTeamsQueryDto,
  ): Prisma.ClubsWhereInput | undefined {
    const clubWhere: Prisma.ClubsWhereInput = {
      ...buildClubOrganizationWhere(filters),
    };

    if (filters.clubId) clubWhere.id = filters.clubId;

    if (filters.search) {
      clubWhere.name = nameContains(filters.search);
    }

    return Object.keys(clubWhere).length > 0 ? clubWhere : undefined;
  }

  /**
   * Builds the Prisma where clause from filters.
   *
   * @param filters - Team filters
   * @returns Prisma where clause
   */
  private buildWhereClause(filters: GetTeamsQueryDto): Prisma.TeamsWhereInput {
    const where: Prisma.TeamsWhereInput = {};

    if (filters.poolId) where.poolId = filters.poolId;

    const poolFilter = this.buildPoolFilter(filters);
    if (poolFilter) where.pool = poolFilter;

    const clubFilter = this.buildClubFilter(filters);
    if (clubFilter) where.club = clubFilter;

    if (filters.number !== undefined) where.number = filters.number;

    return where;
  }
}
