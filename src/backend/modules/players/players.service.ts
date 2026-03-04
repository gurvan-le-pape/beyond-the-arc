// src/backend/modules/players/players.service.ts
import { CompetitionLevel } from "@common/constants/competition-levels";
import { PaginatedResponseDto } from "@common/dto/paginated-response.dto";
import { Category, Gender } from "@common/index";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

import type {
  MatchHistoryDto,
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
  teamId: true,
  team: {
    select: {
      id: true,
      number: true,
      clubId: true,
      category: true,
      gender: true,
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
    },
  },
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
 * Filters for querying players.
 */
type PlayerFilters = {
  level?: CompetitionLevel;
  clubId?: number;
  teamId?: number;
  teamNumber?: number;
  number?: number;
  committeeId?: number;
  leagueId?: number;
  category?: Category;
  gender?: Gender;
  name?: string;
  page?: number;
  limit?: number;
};

/**
 * Service handling business logic for players.
 * Encapsulates database access and domain logic.
 */
@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all players with optional filters and pagination.
   *
   * @param filters - Optional filters and pagination params
   * @returns Paginated list of players
   */
  async findAllPlayers(
    filters?: PlayerFilters,
  ): Promise<PaginatedResponseDto<PlayerResponseDto>> {
    this.logger.log(
      `[findAllPlayers] Fetching players with filters: ${JSON.stringify(
        filters,
      )}`,
    );

    const page = this.validatePage(filters?.page ?? 1);
    const limit = this.validateLimit(filters?.limit ?? 50);
    const skip = (page - 1) * limit;

    const where = this.buildWhereClause(filters);

    try {
      const [players, total] = await Promise.all([
        this.prisma.players.findMany({
          where,
          select: PLAYER_SELECT,
          orderBy: { name: "asc" },
          skip,
          take: limit,
        }),
        this.prisma.players.count({ where }),
      ]);

      this.logger.log(
        `[findAllPlayers] Found ${players.length} players (total: ${total})`,
      );

      return {
        items: players.map((p) => this.mapToDto(p)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error("[findAllPlayers] Failed to fetch players", error);
      throw error;
    }
  }

  /**
   * Finds a player by ID with full details including team.
   *
   * @param id - The player ID
   * @returns Player with full details
   * @throws NotFoundException if player doesn't exist
   */
  async findPlayerById(id: number): Promise<PlayerResponseDto> {
    this.logger.log(`[findPlayerById] Fetching player with ID: ${id}`);

    const player = await this.prisma.players.findUnique({
      where: { id },
      select: PLAYER_SELECT,
    });

    if (!player) {
      this.logger.warn(`[findPlayerById] Player with ID ${id} not found`);
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
  async findPlayerMatchHistory(playerId: number): Promise<MatchHistoryDto[]> {
    this.logger.log(
      `[findPlayerMatchHistory] Fetching match history for player ID: ${playerId}`,
    );

    const playerExists = await this.prisma.players.findUnique({
      where: { id: playerId },
      select: { id: true },
    });

    if (!playerExists) {
      this.logger.warn(
        `[findPlayerMatchHistory] Player with ID ${playerId} not found`,
      );
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    const stats = await this.prisma.playerMatchStats.findMany({
      where: { playerId },
      select: PLAYER_MATCH_HISTORY_SELECT,
      orderBy: { match: { date: "desc" } },
    });

    this.logger.log(
      `[findPlayerMatchHistory] Found ${stats.length} matches for player ID: ${playerId}`,
    );

    return stats.map((stat) => this.mapToMatchHistoryDto(stat));
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
      name: entity.name, // Players.name is String (non-nullable), no fallback needed
      number: entity.number, // Players.number is Int (non-nullable)
      teamId: entity.teamId,
      team: {
        id: entity.team.id,
        number: entity.team.number, // Teams.number is Int (non-nullable)
        clubId: entity.team.clubId,
        category: entity.team.category as Category,
        gender: entity.team.gender as Gender,
        club: {
          id: entity.team.club.id,
          name: entity.team.club.name, // Clubs.name is String (non-nullable)
          committee: {
            id: entity.team.club.committee.id,
            name: entity.team.club.committee.name,
            league: {
              id: entity.team.club.committee.league.id,
              name: entity.team.club.committee.league.name,
            },
          },
        },
        pool: entity.team.pool
          ? {
              id: entity.team.pool.id,
              name: entity.team.pool.name, // Pools.name is String (non-nullable)
              championship: {
                id: entity.team.pool.championship.id,
                name: entity.team.pool.championship.name, // Championships.name is String (non-nullable)
                level: entity.team.pool.championship.level as CompetitionLevel,
                division: entity.team.pool.championship.division,
              },
            }
          : null,
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
      date: stat.match.date,
      homeTeam: {
        id: stat.match.homeTeam.id,
        number: stat.match.homeTeam.number, // Teams.number is Int (non-nullable)
        club: {
          id: stat.match.homeTeam.club.id,
          name: stat.match.homeTeam.club.name, // Clubs.name is String (non-nullable)
        },
      },
      awayTeam: {
        id: stat.match.awayTeam.id,
        number: stat.match.awayTeam.number, // Teams.number is Int (non-nullable)
        club: {
          id: stat.match.awayTeam.club.id,
          name: stat.match.awayTeam.club.name, // Clubs.name is String (non-nullable)
        },
      },
      homeTeamScore: stat.match.homeTeamScore, // Matches.homeTeamScore is Int (non-nullable)
      awayTeamScore: stat.match.awayTeamScore, // Matches.awayTeamScore is Int (non-nullable)
      player: {
        player: {
          id: stat.player.id,
          name: stat.player.name, // Players.name is String (non-nullable)
          number: stat.player.number, // Players.number is Int (non-nullable)
          teamId: stat.player.teamId,
        },
        stats: {
          // All PlayerMatchStats fields are Int @default(0) — non-nullable
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
      },
    } satisfies MatchHistoryDto;
  }

  /**
   * Validates and normalizes page number.
   *
   * @param page - Page number
   * @returns Valid page number (minimum 1)
   */
  private validatePage(page: number): number {
    return page > 0 ? page : 1;
  }

  /**
   * Validates and normalizes limit.
   *
   * @param limit - Limit
   * @returns Valid limit (minimum 1, maximum 100, default 50)
   */
  private validateLimit(limit: number): number {
    return limit > 0 ? Math.min(limit, 100) : 50;
  }

  /**
   * Builds the Prisma where clause from filters.
   *
   * @param filters - Player filters
   * @returns Prisma where clause
   */
  private buildWhereClause(filters?: PlayerFilters): Prisma.PlayersWhereInput {
    const where: Prisma.PlayersWhereInput = {};

    if (filters?.name) {
      where.name = { contains: filters.name, mode: "insensitive" };
    }

    if (filters?.number) {
      where.number = filters.number;
    }

    const teamWhere: Prisma.TeamsWhereInput = {};

    if (filters?.teamId) {
      teamWhere.id = filters.teamId;
    }

    if (filters?.teamNumber) {
      teamWhere.number = filters.teamNumber;
    }

    if (filters?.clubId) {
      teamWhere.clubId = filters.clubId;
    }

    if (!filters?.clubId && !filters?.teamId) {
      if (filters?.level) {
        teamWhere.pool = { championship: { level: filters.level } };
      }

      if (
        filters?.level === CompetitionLevel.DEPARTMENTAL &&
        filters?.committeeId
      ) {
        teamWhere.club = { committeeId: filters.committeeId };
      } else if (
        filters?.level === CompetitionLevel.REGIONAL &&
        filters?.leagueId
      ) {
        teamWhere.club = { committee: { leagueId: filters.leagueId } };
      }
    }

    if (filters?.category) {
      teamWhere.category = filters.category;
    }

    if (filters?.gender) {
      teamWhere.gender = filters.gender;
    }

    if (Object.keys(teamWhere).length > 0) {
      where.team = teamWhere;
    }

    return where;
  }
}
