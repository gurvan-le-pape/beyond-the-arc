// src/backend/modules/competitions/leaderboards/leaderboards.service.ts
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../../prisma/generated/prisma/client";
import { LeaderboardResponseDto } from "./dto/leaderboards.response.dto";

/**
 * Fields to select from the leaderboards table.
 * Single source of truth for consistent queries.
 */
const LEADERBOARD_SELECT = {
  id: true,
  teamId: true,
  poolId: true,
  points: true,
  gamesPlayed: true,
  gamesWon: true,
  gamesLost: true,
  gamesForfeited: true,
  pointsFor: true,
  pointsAgainst: true,
  pointDifference: true,
  team: {
    select: {
      number: true,
      club: {
        select: {
          name: true,
        },
      },
    },
  },
} as const;

/**
 * Type representing the Prisma leaderboard select result.
 * This matches exactly what Prisma returns from the select query.
 */
type LeaderboardSelectResult = Prisma.LeaderboardsGetPayload<{
  select: typeof LEADERBOARD_SELECT;
}>;

/**
 * Service handling business logic for leaderboards.
 * Encapsulates database access and domain logic.
 */
@Injectable()
export class LeaderboardsService {
  private readonly logger = new Logger(LeaderboardsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds all leaderboard entries for a specific pool.
   * Results are sorted by points (descending) and point difference (descending).
   *
   * @param poolId - The pool ID
   * @returns Array of leaderboard entry DTOs
   */
  async findLeaderboardsByPoolId(
    poolId: number,
  ): Promise<LeaderboardResponseDto[]> {
    const leaderboards = await this.prisma.client.leaderboards.findMany({
      where: { poolId },
      select: LEADERBOARD_SELECT,
      orderBy: [{ points: "desc" }, { pointDifference: "desc" }],
    });

    if (leaderboards.length === 0) {
      throw new NotFoundException(
        `No leaderboard entries found for pool ID ${poolId}`,
      );
    }

    // Rank derived from sort order
    return leaderboards.map((entry, index) => this.mapToDto(entry, index + 1));
  }

  /**
   * Finds a leaderboard entry by its ID.
   *
   * @param leaderboardId - The leaderboard entry ID
   * @returns Leaderboard entry DTO
   * @throws NotFoundException if leaderboard entry doesn't exist
   */
  async findLeaderboardById(
    leaderboardId: number,
  ): Promise<LeaderboardResponseDto> {
    const leaderboard = await this.prisma.client.leaderboards.findUnique({
      where: { id: leaderboardId },
      select: LEADERBOARD_SELECT,
    });

    if (!leaderboard) {
      throw new NotFoundException(
        `Leaderboard entry with ID ${leaderboardId} not found`,
      );
    }

    // Compute rank via count query
    const rank =
      (await this.prisma.client.leaderboards.count({
        where: {
          poolId: leaderboard.poolId,
          OR: [
            { points: { gt: leaderboard.points } },
            {
              points: leaderboard.points,
              pointDifference: { gt: leaderboard.pointDifference },
            },
          ],
        },
      })) + 1;

    return this.mapToDto(leaderboard, rank);
  }

  /**
   * Maps a Prisma leaderboard entity to a response DTO.
   * Centralizes the mapping logic and flattens nested relations.
   * The `satisfies` operator ensures compile-time type checking.
   *
   * @param leaderboard - Prisma leaderboard select result
   * @returns LeaderboardResponseDto
   */
  private mapToDto(
    leaderboard: LeaderboardSelectResult,
    rank: number,
  ): LeaderboardResponseDto {
    return {
      id: leaderboard.id,
      teamId: leaderboard.teamId,
      rank,
      teamNumber: leaderboard.team.number,
      clubName: leaderboard.team.club.name,
      points: leaderboard.points,
      gamesPlayed: leaderboard.gamesPlayed,
      gamesWon: leaderboard.gamesWon,
      gamesLost: leaderboard.gamesLost,
      gamesForfeited: leaderboard.gamesForfeited,
      pointsFor: leaderboard.pointsFor,
      pointsAgainst: leaderboard.pointsAgainst,
      pointDifference: leaderboard.pointDifference,
    } satisfies LeaderboardResponseDto; // TypeScript validates this matches
  }
}
