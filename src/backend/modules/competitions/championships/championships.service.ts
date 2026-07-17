// src/backend/modules/competitions/championships/championships.service.ts
import { CompetitionLevel } from "@common/constants";
import { PaginatedResponseDto } from "@common/dto";
import { Category, Gender } from "@common/index";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../../prisma/generated/prisma/client";
import { ChampionshipResponseDto } from "./dto/championships.response.dto";

/**
 * Fields to select from the championships table.
 * Single source of truth for consistent queries.
 */
const CHAMPIONSHIP_SELECT = {
  id: true,
  name: true,
  category: true,
  gender: true,
  seasonYear: true,
  level: true,
  division: true,
  leagueId: true,
  committeeId: true,
  league: { select: { name: true } },
  committee: { select: { name: true } },
  pools: {
    select: {
      id: true,
      letter: true,
      name: true,
      matches: {
        select: { matchday: true },
        distinct: ["matchday"] as ["matchday"],
      },
    },
  },
} as const;

/**
 * Type representing the Prisma championship select result.
 * This matches exactly what Prisma returns from the select query.
 */
type ChampionshipSelectResult = Prisma.ChampionshipsGetPayload<{
  select: typeof CHAMPIONSHIP_SELECT;
}>;

/**
 * Filters for querying championships.
 */
type ChampionshipFilters = {
  level?: CompetitionLevel;
  id?: number;
  category?: Category;
  gender?: Gender;
  page?: number;
  limit?: number;
};

/**
 * Service handling business logic for championships.
 * Encapsulates database access and domain logic.
 */
@Injectable()
export class ChampionshipsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds championships with optional filters and pagination.
   *
   * @param filters - Optional filter and pagination criteria
   * @returns Paginated list of championship DTOs
   */
  async findChampionships(
    filters?: ChampionshipFilters,
  ): Promise<PaginatedResponseDto<ChampionshipResponseDto>> {
    const page = Math.max(1, filters?.page ?? 1);
    const limit = Math.min(Math.max(1, filters?.limit ?? 20), 100);
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(filters);

    const [championships, total] = await Promise.all([
      this.prisma.client.championships.findMany({
        where,
        select: CHAMPIONSHIP_SELECT,
        orderBy: [{ division: "asc" }, { category: "asc" }],
        skip,
        take: limit,
      }),
      this.prisma.client.championships.count({ where }),
    ]);

    return {
      items: championships.map((c) => this.mapToDto(c)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Finds a championship by its ID.
   *
   * @param championshipId - The championship ID
   * @returns Championship DTO
   * @throws NotFoundException if championship doesn't exist
   */
  async findChampionshipById(
    championshipId: number,
  ): Promise<ChampionshipResponseDto> {
    const championship = await this.prisma.client.championships.findUnique({
      where: { id: championshipId },
      select: CHAMPIONSHIP_SELECT,
    });

    if (!championship) {
      throw new NotFoundException(
        `Championship with ID ${championshipId} not found`,
      );
    }

    return this.mapToDto(championship);
  }

  /**
   * Builds the Prisma where clause from filters.
   * Routes the id param to leagueId or committeeId based on level.
   *
   * @param filters - Championship filters
   * @returns Prisma where clause
   */
  private buildWhereClause(
    filters?: ChampionshipFilters,
  ): Prisma.ChampionshipsWhereInput {
    const where: Prisma.ChampionshipsWhereInput = {};

    if (filters?.level) where.level = filters.level;
    if (filters?.category) where.category = filters.category;
    if (filters?.gender) where.gender = filters.gender;

    if (filters?.id) {
      if (filters.level === CompetitionLevel.REGIONAL) {
        where.leagueId = filters.id;
      } else if (filters.level === CompetitionLevel.DEPARTMENTAL) {
        where.committeeId = filters.id;
      }
    }

    return where;
  }

  /**
   * Maps a Prisma championship entity to a response DTO.
   * Centralizes the mapping logic and handles null values.
   * The `satisfies` operator ensures compile-time type checking.
   *
   * @param entity - Prisma championship select result
   * @returns ChampionshipResponseDto
   */
  private mapToDto(entity: ChampionshipSelectResult): ChampionshipResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      category: entity.category,
      gender: entity.gender,
      seasonYear: entity.seasonYear,
      level: entity.level,
      division: entity.division,
      leagueId: entity.leagueId ?? null,
      committeeId: entity.committeeId ?? null,
      committeeName: entity.committee?.name ?? null,
      leagueName: entity.league?.name ?? null,
      pools: entity.pools.map((p) => ({
        id: p.id,
        letter: p.letter,
        name: p.name,
        nbMatchdays: p.matches.length,
      })),
    } satisfies ChampionshipResponseDto; // TypeScript validates this matches
  }
}
