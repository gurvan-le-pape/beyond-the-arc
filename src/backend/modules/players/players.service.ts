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
  mapPlayerSummary,
  nameContains,
  parseBoxScoreLine,
  resolvePagination,
} from "@common/utils";
import { Injectable, NotFoundException } from "@nestjs/common";
import { formatInTimeZone } from "date-fns-tz";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../prisma/generated/prisma/client";
import type { GetPlayersQueryDto } from "./dto/players.query.dto";
import type {
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

/** What a match history entry shows of the player. */
const PLAYER_SUMMARY_SELECT = {
  id: true,
  name: true,
  number: true,
  position: true,
  teamId: true,
} as const;

/**
 * One row of `findPlayerMatchHistory`'s query: a match the player has a
 * box-score line in, with that line as stored.
 */
interface PlayerMatchHistoryRow {
  id: number;
  startsAt: Date;
  status: string;
  homeTeamScore: number | null;
  awayTeamScore: number | null;
  homeTeamId: number;
  homeTeamNumber: number;
  homeClubId: number;
  homeClubName: string;
  awayTeamId: number;
  awayTeamNumber: number;
  awayClubId: number;
  awayClubName: string;
  line: unknown;
}

/**
 * Types derived from Prisma select objects.
 * Always in sync with the actual queries.
 */
type PlayerSelectResult = Prisma.PlayersGetPayload<{
  select: typeof PLAYER_SELECT;
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
    const player = await this.prisma.client.players.findUnique({
      where: { id: playerId },
      select: PLAYER_SUMMARY_SELECT,
    });

    if (!player) {
      throw new NotFoundException(`Player with ID ${playerId} not found`);
    }

    // A player only ever plays for their team, so its matches are the ones to
    // look in; only those the player has a line in come back, with that line
    // alone rather than the whole box score.
    const key = String(playerId);
    const rows = await this.prisma.client.$queryRaw<PlayerMatchHistoryRow[]>`
      SELECT m.id,
             m.starts_at AS "startsAt",
             m.status,
             m.home_team_score AS "homeTeamScore",
             m.away_team_score AS "awayTeamScore",
             ht.id AS "homeTeamId",
             ht.number AS "homeTeamNumber",
             hc.id AS "homeClubId",
             hc.name AS "homeClubName",
             at.id AS "awayTeamId",
             at.number AS "awayTeamNumber",
             ac.id AS "awayClubId",
             ac.name AS "awayClubName",
             m.box_score -> ${key}::text AS line
      FROM matches m
      JOIN teams ht ON ht.id = m.home_team_id
      JOIN clubs hc ON hc.id = ht.club_id
      JOIN teams at ON at.id = m.away_team_id
      JOIN clubs ac ON ac.id = at.club_id
      WHERE (m.home_team_id = ${player.teamId}::int
             OR m.away_team_id = ${player.teamId}::int)
        AND m.box_score -> ${key}::text IS NOT NULL
      ORDER BY m.starts_at DESC, m.id
    `;

    const summary = mapPlayerSummary(player);
    const matches = rows.map((row) => this.mapToMatchHistoryDto(row, summary));

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
   * Maps a row of the match history query to a match history DTO.
   *
   * @param row - One match, with the player's box-score line as stored
   * @param player - The player the history is for
   * @returns MatchHistoryDto
   */
  private mapToMatchHistoryDto(
    row: PlayerMatchHistoryRow,
    player: ReturnType<typeof mapPlayerSummary>,
  ): MatchHistoryDto {
    return {
      id: row.id,
      startsAt: row.startsAt,
      homeTeam: {
        id: row.homeTeamId,
        number: row.homeTeamNumber,
        club: { id: row.homeClubId, name: row.homeClubName },
      },
      awayTeam: {
        id: row.awayTeamId,
        number: row.awayTeamNumber,
        club: { id: row.awayClubId, name: row.awayClubName },
      },
      status: row.status as MatchStatus,
      homeTeamScore: row.homeTeamScore,
      awayTeamScore: row.awayTeamScore,
      player: {
        player,
        stats: parseBoxScoreLine(
          row.line,
          `match ${row.id}, player ${player.id}`,
        ),
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
