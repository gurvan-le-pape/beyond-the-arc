// src/backend/modules/competitions/championships/championships.service.ts
import { CompetitionLevel } from "@common/constants/competition-levels";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

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
  private readonly logger = new Logger(ChampionshipsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all distinct divisions from championships.
   *
   * @returns Array of division numbers
   *
   * Note: Results are cached at the controller level.
   */
  async findAllDivisions(): Promise<number[]> {
    const divisions = await this.prisma.championships.findMany({
      select: { division: true },
      distinct: ["division"],
      orderBy: { division: "asc" },
    });
    return divisions
      .map((d) => d.division)
      .filter((division): division is number => typeof division === "number");
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
    this.logger.log(
      `[findChampionshipById] Fetching championship ID: ${championshipId}`,
    );

    const championship = await this.prisma.championships.findUnique({
      where: { id: championshipId },
      select: CHAMPIONSHIP_SELECT,
    });

    if (!championship) {
      this.logger.warn(
        `[findChampionshipById] Championship with ID ${championshipId} not found`,
      );
      throw new NotFoundException(
        `Championship with ID ${championshipId} not found`,
      );
    }

    return this.mapToDto(championship);
  }

  /**
   * Finds championships by competition level and associated ID.
   * This is the main business routing logic method.
   *
   * @param level - Competition level (regional or departmental)
   * @param id - League ID (for regional) or Committee ID (for departmental)
   * @returns Array of ChampionshipResponseDto
   * @throws NotFoundException if no championships found
   */
  async findChampionshipsByLevel(
    level: CompetitionLevel,
    id: number,
  ): Promise<ChampionshipResponseDto[]> {
    this.logger.log(
      `[findChampionshipsByLevel] Fetching championships: level=${level}, id=${id}`,
    );

    if (level === CompetitionLevel.REGIONAL) {
      return this.findRegionalChampionships(id);
    }
    return this.findDepartmentalChampionships(id);
  }

  /**
   * Finds all regional championships for a given league.
   * Private helper method to avoid circular dependencies.
   *
   * @param leagueId - The league ID
   * @returns Array of championship DTOs
   * @throws NotFoundException if no championships found
   */
  private async findRegionalChampionships(
    leagueId: number,
  ): Promise<ChampionshipResponseDto[]> {
    this.logger.log(
      `[findRegionalChampionships] Fetching regional championships for league ID: ${leagueId}`,
    );

    const championships = await this.queryChampionshipsByCondition({
      leagueId: leagueId,
      level: CompetitionLevel.REGIONAL,
    });

    if (championships.length === 0) {
      this.logger.warn(
        `[findRegionalChampionships] No regional championships found for league ID: ${leagueId}`,
      );
      throw new NotFoundException(
        `No regional championships found for league ID ${leagueId}`,
      );
    }

    this.logger.log(
      `[findRegionalChampionships] Found ${championships.length} regional championships for league ID: ${leagueId}`,
    );

    return championships.map((c) => this.mapToDto(c));
  }

  /**
   * Finds all departmental championships for a given committee.
   * Private helper method to avoid circular dependencies.
   *
   * @param committeeId - The committee ID
   * @returns Array of championship DTOs
   * @throws NotFoundException if no championships found
   */
  private async findDepartmentalChampionships(
    committeeId: number,
  ): Promise<ChampionshipResponseDto[]> {
    this.logger.log(
      `[findDepartmentalChampionships] Fetching departmental championships for committee ID: ${committeeId}`,
    );

    const championships = await this.queryChampionshipsByCondition({
      committeeId: committeeId,
      level: CompetitionLevel.DEPARTMENTAL,
    });

    if (championships.length === 0) {
      this.logger.warn(
        `[findDepartmentalChampionships] No departmental championships found for committee ID: ${committeeId}`,
      );
      throw new NotFoundException(
        `No departmental championships found for committee ID ${committeeId}`,
      );
    }

    this.logger.log(
      `[findDepartmentalChampionships] Found ${championships.length} departmental championships for committee ID: ${committeeId}`,
    );

    return championships.map((c) => this.mapToDto(c));
  }

  /**
   * Private helper method to query championships by condition.
   * Reduces duplication and centralizes database query logic.
   *
   * @param condition - Prisma where condition
   * @returns Array of championship entities
   */
  private async queryChampionshipsByCondition(
    condition: Prisma.ChampionshipsWhereInput,
  ): Promise<ChampionshipSelectResult[]> {
    try {
      return await this.prisma.championships.findMany({
        where: condition,
        select: CHAMPIONSHIP_SELECT,
        orderBy: [{ division: "asc" }, { category: "asc" }],
      });
    } catch (error) {
      this.logger.error(
        `[queryChampionshipsByCondition] Failed to fetch championships`,
        error,
      );
      throw error;
    }
  }

  /**
   * Maps a Prisma championship entity to a response DTO.
   * Centralizes the mapping logic and handles null values.
   * The `satisfies` operator ensures compile-time type checking.
   *
   * @param championship - Prisma championship select result
   * @returns ChampionshipResponseDto
   */
  private mapToDto(entity: ChampionshipSelectResult): ChampionshipResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      category: entity.category ?? null,
      gender: entity.gender,
      seasonYear: entity.seasonYear,
      level: entity.level,
      division: entity.division,
    } satisfies ChampionshipResponseDto; // TypeScript validates this matches
  }
}
