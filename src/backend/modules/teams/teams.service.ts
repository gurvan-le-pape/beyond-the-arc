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
  type MappedPlayerMatchStats,
  mapPlayerSummary,
  nameContains,
  parseBoxScore,
  resolvePagination,
} from "@common/utils";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../prisma/generated/prisma/client";
import { aggregateTeamSeasonStats } from "./aggregate-team-season-stats";
import type { GetTeamsQueryDto } from "./dto/teams.query.dto";
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

/** What the season aggregation reads of each of the team's players. */
const TEAM_PLAYER_SUMMARY_SELECT = {
  id: true,
  name: true,
  number: true,
  position: true,
  teamId: true,
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
   * Finds a team by ID with full details including its roster and season stats.
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

    // Each player's lines across the season. A box score also holds the
    // opponent's players, who have no entry on this roster to land in.
    const linesByPlayer = new Map<number, MappedPlayerMatchStats[]>();
    for (const match of boxScores) {
      for (const { playerId, stats } of parseBoxScore(
        match.boxScore,
        match.id,
      )) {
        const lines = linesByPlayer.get(playerId) ?? [];
        lines.push(stats);
        linesByPlayer.set(playerId, lines);
      }
    }

    return this.mapToDetailDto(team, linesByPlayer);
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

    // The box scores feed the season stats only; the history itself does not
    // return them.
    const [matchRows, players] = await Promise.all([
      this.prisma.client.matches.findMany({
        where: teamMatchesWhere(teamId),
        select: { ...TEAM_MATCH_HISTORY_SELECT, boxScore: true },
        orderBy: { startsAt: "desc" },
      }),
      this.prisma.client.players.findMany({
        where: { teamId },
        select: TEAM_PLAYER_SUMMARY_SELECT,
      }),
    ]);
    const playersById = new Map(
      players.map((p) => [p.id, mapPlayerSummary(p)]),
    );

    return {
      matches: matchRows.map((match) => this.mapToMatchHistoryDto(match)),
      seasonStats: aggregateTeamSeasonStats(
        teamId,
        matchRows.map((match) => ({
          // Only a completed match has a box score; the opponent's lines have
          // no player in this team's roster and are left out.
          players: (match.boxScore === null
            ? []
            : parseBoxScore(match.boxScore, match.id)
          ).flatMap(({ playerId, stats }) => {
            const player = playersById.get(playerId);
            return player ? [{ player, stats }] : [];
          }),
        })),
      ),
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
    linesByPlayer: ReadonlyMap<number, MappedPlayerMatchStats[]>,
  ): TeamDetailResponseDto {
    const baseDto = this.mapToDto(entity);

    return {
      ...baseDto,
      players: entity.players.map((p) => ({
        ...mapPlayerSummary(p),
        seasonStats: aggregateCareerStats(linesByPlayer.get(p.id) ?? []),
      })),
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
    } satisfies TeamMatchHistoryDto;
  }

  private buildPoolFilter(
    filters: GetTeamsQueryDto,
  ): Prisma.PoolsWhereInput | undefined {
    const { poolLetter } = filters;
    const championship = buildChampionshipWhere(filters);

    if (!championship && !poolLetter) return undefined;

    return {
      ...(championship ? { championship } : {}),
      ...(poolLetter ? { letter: poolLetter } : {}),
    };
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

    const poolFilter = this.buildPoolFilter(filters);
    if (poolFilter) where.pool = poolFilter;

    const clubFilter = this.buildClubFilter(filters);
    if (clubFilter) where.club = clubFilter;

    if (filters.number !== undefined) where.number = filters.number;

    return where;
  }
}
