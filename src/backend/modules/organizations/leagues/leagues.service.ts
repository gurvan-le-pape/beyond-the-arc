// src/backend/modules/organizations/leagues/leagues.service.ts
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

import { LeagueResponseDto } from "./dto/leagues.response.dto";

/**
 * Fields to select from the leagues table.
 * Single source of truth for consistent queries.
 */
const LEAGUE_SELECT = {
  id: true,
  name: true,
} as const;

/**
 * Type representing the Prisma league select result.
 * This matches exactly what Prisma returns from the select query.
 */
type LeagueSelectResult = Prisma.LeaguesGetPayload<{
  select: typeof LEAGUE_SELECT;
}>;

/**
 * Service handling business logic for leagues regionales.
 * Encapsulates database access and domain logic.
 */
@Injectable()
export class LeaguesService {
  private readonly logger = new Logger(LeaguesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all regional leagues.
   * Results are typically cached at the controller level.
   *
   * @returns Array of league DTOs
   */
  async findAllLeagues(): Promise<LeagueResponseDto[]> {
    this.logger.log("[findAllLeagues] Fetching all regional leagues");

    try {
      const leagues = await this.prisma.leagues.findMany({
        select: LEAGUE_SELECT,
        orderBy: { name: "asc" },
      });

      this.logger.log(
        `[findAllLeagues] Found ${leagues.length} regional leagues`,
      );

      return leagues.map((l) => this.mapToDto(l));
    } catch (error) {
      this.logger.error(
        "[findAllLeagues] Failed to fetch regional leagues",
        error,
      );
      throw error;
    }
  }

  /**
   * Finds a league by its ID.
   *
   * @param leagueId - The league ID
   * @returns League DTO
   * @throws NotFoundException if league doesn't exist
   */
  async findLeagueById(leagueId: number): Promise<LeagueResponseDto> {
    this.logger.log(`[findLeagueById] Fetching league with ID: ${leagueId}`);

    const league = await this.prisma.leagues.findUnique({
      where: { id: leagueId },
      select: LEAGUE_SELECT,
    });

    if (!league) {
      this.logger.warn(`[findLeagueById] League with ID ${leagueId} not found`);
      throw new NotFoundException(`League with ID ${leagueId} not found`);
    }

    return this.mapToDto(league);
  }

  /**
   * Maps a Prisma league entity to a response DTO.
   * Centralizes the mapping logic and handles null values.
   * The `satisfies` operator ensures compile-time type checking.
   *
   * @param league - Prisma league select result
   * @returns LeagueResponseDto
   */
  private mapToDto(league: LeagueSelectResult): LeagueResponseDto {
    return {
      id: league.id,
      name: league.name,
    } satisfies LeagueResponseDto; // TypeScript validates this matches
  }
}
