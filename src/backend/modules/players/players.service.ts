// src/backend/modules/players/players.service.ts
import {
  Category,
  CompetitionLevel,
  Gender,
  MatchStatus,
  Position,
} from "@common/constants";
import { PaginatedResponseDto } from "@common/dto";
import {
  aggregateCareerStats,
  buildChampionshipWhere,
  buildClubOrganizationWhere,
  mapPlayerMatchStats,
  mapPlayerSummary,
  nameContains,
  PLAYER_MATCH_STAT_FIELDS_SELECT,
  resolvePagination,
} from "@common/utils";
import { Injectable, NotFoundException } from "@nestjs/common";
import { formatInTimeZone } from "date-fns-tz";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../prisma/generated/prisma/client";
import type { GetPlayersQueryDto } from "./dto/players.query.dto";
import type {
  FilterValuesPlayersResponseDto,
  MatchHistoryDto,
  PlayerMatchHistoryResponseDto,
  PlayerResponseDto,
} from "./dto/players.response.dto";

/**
 * Fields to select from the players table with full relations.
 * Single source of truth for consistent queries.
 */
const PLAYER_SELECT = {
  id: true,
  name: true,
  number: true,
  position: true,
  heightCm: true,
  weightKg: true,
  birthdate: true,
  teamId: true,
  team: {
    select: {
      id: true,
      number: true,
      clubId: true,
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
              category: true,
              gender: true,
              level: true,
              division: true,
            },
          },
        },
      },
    },
  },
} as const;

/**
 * Fields to select for match history queries.
 * Single source of truth for match history data.
 */
const PLAYER_MATCH_HISTORY_SELECT = {
  match: {
    select: {
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
    },
  },
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
} as const;

/**
 * Types derived from Prisma select objects.
 * Always in sync with the actual queries.
 */
type PlayerSelectResult = Prisma.PlayersGetPayload<{
  select: typeof PLAYER_SELECT;
}>;

type PlayerMatchHistorySelectResult = Prisma.PlayerMatchStatsGetPayload<{
  select: typeof PLAYER_MATCH_HISTORY_SELECT;
}>;

/**
 * Service handling business logic for players.
 * Encapsulates database access and domain logic.
 */
@Injectable()
export class PlayersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all players with optional filters and pagination.
   *
   * @param filters - Optional filters and pagination params
   * @returns Paginated list of players
   */
  async findAllPlayers(
    filters: GetPlayersQueryDto = {},
  ): Promise<PaginatedResponseDto<PlayerResponseDto>> {
    const { page, limit, skip } = resolvePagination(filters);

    const where = this.buildWhereClause(filters);

    const [players, total] = await Promise.all([
      this.prisma.client.players.findMany({
        where,
        select: PLAYER_SELECT,
        orderBy: [{ name: "asc" }, { id: "asc" }],
        skip,
        take: limit,
      }),
      this.prisma.client.players.count({ where }),
    ]);

    return {
      items: players.map((p) => this.mapToDto(p)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Retrieves available filter values for player queries.
   * Intended for populating filter dropdowns on the frontend.
   *
   * @returns Available player numbers and team numbers
   */
  async findPlayerFilterValues(filters?: {
    committeeId?: number;
    leagueId?: number;
  }): Promise<FilterValuesPlayersResponseDto> {
    const clubWhere = buildClubOrganizationWhere(filters);
    const teamWhere: Prisma.TeamsWhereInput = clubWhere
      ? { club: clubWhere }
      : {};

    const [numbers, teamNumbers] = await Promise.all([
      this.prisma.client.players.findMany({
        where: { team: teamWhere },
        select: { number: true },
        distinct: ["number"],
        orderBy: { number: "asc" },
      }),
      this.prisma.client.teams.findMany({
        where: teamWhere,
        select: { number: true },
        distinct: ["number"],
        orderBy: { number: "asc" },
      }),
    ]);

    return {
      numbers: numbers.map((p) => p.number),
      teamNumbers: teamNumbers.map((t) => t.number),
    };
  }

  /**
   * Finds a player by ID with full details including team.
   *
   * @param id - The player ID
   * @returns Player with full details
   * @throws NotFoundException if player doesn't exist
   */
  async findPlayerById(id: number): Promise<PlayerResponseDto> {
    const player = await this.prisma.client.players.findUnique({
      where: { id },
      select: PLAYER_SELECT,
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }

    return this.mapToDto(player);
  }

  /**
   * Retrieves match history for a specific player.
   * Returns all matches the player has participated in with their stats.
   *
   * @param playerId - The player ID
   * @returns Array of match history entries
   * @throws NotFoundException if player doesn't exist
   */
  async findPlayerMatchHistory(
    playerId: number,
  ): Promise<PlayerMatchHistoryResponseDto> {
    const playerExists = await this.prisma.client.players.findUnique({
      where: { id: playerId },
      select: { id: true },
    });

    if (!playerExists) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    const stats = await this.prisma.client.playerMatchStats.findMany({
      where: { playerId },
      select: PLAYER_MATCH_HISTORY_SELECT,
      orderBy: { match: { startsAt: "desc" } },
    });

    const matches = stats.map((stat) => this.mapToMatchHistoryDto(stat));

    return {
      matches,
      career: aggregateCareerStats(matches.map((m) => m.player.stats)),
    };
  }

  /**
   * Maps a Prisma player entity to a response DTO.
   *
   * @param entity - Prisma player select result
   * @returns PlayerResponseDto
   */
  private mapToDto(entity: PlayerSelectResult): PlayerResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      number: entity.number,
      position: entity.position as Position,
      heightCm: entity.heightCm,
      weightKg: entity.weightKg,
      // A birthdate is a calendar date, not an instant. The column is
      // @db.Date and Prisma hands it back as a Date at UTC midnight, so the
      // zone is named explicitly rather than left to the process's.
      birthdate: formatInTimeZone(entity.birthdate, "UTC", "yyyy-MM-dd"),
      teamId: entity.teamId,
      team: {
        id: entity.team.id,
        number: entity.team.number,
        clubId: entity.team.clubId,
        category: entity.team.pool.championship.category as Category,
        gender: entity.team.pool.championship.gender as Gender,
        club: {
          id: entity.team.club.id,
          name: entity.team.club.name,
          committee: {
            id: entity.team.club.committee.id,
            name: entity.team.club.committee.name,
            league: {
              id: entity.team.club.committee.league.id,
              name: entity.team.club.committee.league.name,
            },
          },
        },
        pool: {
          id: entity.team.pool.id,
          letter: entity.team.pool.letter,
          championship: {
            id: entity.team.pool.championship.id,
            level: entity.team.pool.championship.level as CompetitionLevel,
            division: entity.team.pool.championship.division,
          },
        },
      },
    } satisfies PlayerResponseDto;
  }

  /**
   * Maps a Prisma player match stats entity to a match history DTO.
   *
   * @param stat - Prisma player match stats select result
   * @returns MatchHistoryDto
   */
  private mapToMatchHistoryDto(
    stat: PlayerMatchHistorySelectResult,
  ): MatchHistoryDto {
    return {
      id: stat.match.id,
      startsAt: stat.match.startsAt,
      homeTeam: {
        id: stat.match.homeTeam.id,
        number: stat.match.homeTeam.number,
        club: {
          id: stat.match.homeTeam.club.id,
          name: stat.match.homeTeam.club.name,
        },
      },
      awayTeam: {
        id: stat.match.awayTeam.id,
        number: stat.match.awayTeam.number,
        club: {
          id: stat.match.awayTeam.club.id,
          name: stat.match.awayTeam.club.name,
        },
      },
      status: stat.match.status as MatchStatus,
      homeTeamScore: stat.match.homeTeamScore,
      awayTeamScore: stat.match.awayTeamScore,
      player: {
        player: mapPlayerSummary(stat.player),
        stats: mapPlayerMatchStats(stat),
      },
    } satisfies MatchHistoryDto;
  }

  private buildTeamFilter(filters: GetPlayersQueryDto): Prisma.TeamsWhereInput {
    const teamWhere: Prisma.TeamsWhereInput = {};

    const { level, category, gender } = filters;
    const championship = buildChampionshipWhere({ level, category, gender });
    if (championship) teamWhere.pool = { championship };

    const clubWhere = buildClubOrganizationWhere(filters);
    if (clubWhere) teamWhere.club = clubWhere;

    if (filters.teamId) teamWhere.id = filters.teamId;
    if (filters.teamNumber) teamWhere.number = filters.teamNumber;
    if (filters.clubId) teamWhere.clubId = filters.clubId;

    return teamWhere;
  }

  /**
   * Builds the Prisma where clause from filters.
   *
   * @param filters - Player filters
   * @returns Prisma where clause
   */
  private buildWhereClause(
    filters: GetPlayersQueryDto,
  ): Prisma.PlayersWhereInput {
    const where: Prisma.PlayersWhereInput = {};

    if (filters.search) where.name = nameContains(filters.search);
    if (filters.number) where.number = filters.number;

    const teamWhere = this.buildTeamFilter(filters);
    if (Object.keys(teamWhere).length > 0) where.team = teamWhere;

    return where;
  }
}
