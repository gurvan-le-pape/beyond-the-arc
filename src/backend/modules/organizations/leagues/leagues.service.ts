// src/backend/modules/organizations/leagues/leagues.service.ts
import { ffbbLeagueUrl, PRESIDENT_SELECT } from "@common/utils";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../../prisma/generated/prisma/client";
import { LeagueResponseDto } from "./dto/leagues.response.dto";

/**
 * Fields to select from the leagues table.
 * Single source of truth for consistent queries.
 */
const LEAGUE_SELECT = {
  id: true,
  name: true,
  phone: true,
  email: true,
  address: true,
  president: PRESIDENT_SELECT,
  region: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
  committees: {
    select: {
      _count: { select: { clubs: true } },
      // One club is enough: its code carries the league's FFBB code.
      clubs: {
        select: { code: true },
        where: { code: { not: null } },
        take: 1,
      },
    },
  },
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
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all regional leagues.
   * Results are typically cached at the controller level.
   *
   * @returns Array of league DTOs
   */
  async findAllLeagues(): Promise<LeagueResponseDto[]> {
    const leagues = await this.prisma.client.leagues.findMany({
      select: LEAGUE_SELECT,
      orderBy: { name: "asc" },
    });

    return leagues.map((l) => this.mapToDto(l));
  }

  /**
   * Finds a league by its ID.
   *
   * @param leagueId - The league ID
   * @returns League DTO
   * @throws NotFoundException if league doesn't exist
   */
  async findLeagueById(leagueId: number): Promise<LeagueResponseDto> {
    const league = await this.prisma.client.leagues.findUnique({
      where: { id: leagueId },
      select: LEAGUE_SELECT,
    });

    if (!league) {
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
    const clubCount = league.committees.reduce(
      (sum, c) => sum + c._count.clubs,
      0,
    );
    return {
      id: league.id,
      name: league.name,
      phone: league.phone,
      email: league.email,
      address: league.address,
      president: league.president,
      region: league.region,
      clubCount,
      ffbbUrl: ffbbLeagueUrl(
        league.committees.find((c) => c.clubs.length)?.clubs[0].code ?? null,
      ),
    } satisfies LeagueResponseDto; // TypeScript validates this matches
  }
}
