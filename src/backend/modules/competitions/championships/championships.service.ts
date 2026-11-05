// src/backend/modules/competitions/championships/championships.service.ts
import { Category, CompetitionLevel, Gender } from "@common/constants";
import { PaginatedResponseDto } from "@common/dto";
import { buildChampionshipWhere, resolvePagination } from "@common/utils";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../../prisma/generated/prisma/client";
import type { GetChampionshipsQueryDto } from "./dto/championships.query.dto";
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
  league: { select: { name: true, region: { select: { name: true } } } },
  committee: {
    select: { name: true, department: { select: { name: true } } },
  },
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
    filters: GetChampionshipsQueryDto = {},
  ): Promise<PaginatedResponseDto<ChampionshipResponseDto>> {
    const { page, limit, skip } = resolvePagination(filters);
    const where = this.buildWhereClause(filters);

    const [championships, total] = await Promise.all([
      this.prisma.client.championships.findMany({
        where,
        select: CHAMPIONSHIP_SELECT,
        orderBy: [{ division: "asc" }, { category: "asc" }, { id: "asc" }],
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
   * Builds the Prisma where clause from filters. Each filter applies on its
   * own: `leagueId` and `committeeId` name the organiser directly rather than
   * through the level.
   *
   * @param filters - Championship filters
   * @returns Prisma where clause
   */
  private buildWhereClause(
    filters: GetChampionshipsQueryDto,
  ): Prisma.ChampionshipsWhereInput {
    const where: Prisma.ChampionshipsWhereInput = {
      ...buildChampionshipWhere(filters),
    };

    if (filters.leagueId) where.leagueId = filters.leagueId;
    if (filters.committeeId) where.committeeId = filters.committeeId;

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
      category: entity.category as Category,
      gender: entity.gender as Gender,
      seasonYear: entity.seasonYear,
      level: entity.level as CompetitionLevel,
      division: entity.division,
      leagueId: entity.leagueId,
      committeeId: entity.committeeId,
      committeeName: entity.committee?.name ?? null,
      leagueName: entity.league?.name ?? null,
      regionName: entity.league?.region.name ?? null,
      departmentName: entity.committee?.department.name ?? null,
      pools: entity.pools.map((p) => ({
        id: p.id,
        letter: p.letter,
        name: p.name,
        nbMatchdays: p.matches.length,
      })),
    } satisfies ChampionshipResponseDto; // TypeScript validates this matches
  }
}
