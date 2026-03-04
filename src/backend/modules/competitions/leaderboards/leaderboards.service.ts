// src/backend/modules/competitions/leaderboards/leaderboards.service.ts
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

import { LeaderboardResponseDto } from "./dto/leaderboards.response.dto";

/**
 * Fields to select from the leaderboards table.
 * Single source of truth for consistent queries.
 */
const LEADERBOARD_SELECT = {
  id: true,
  teamId: true,
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
   * @throws NotFoundException if no leaderboard entries found
   */
  async findLeaderboardsByPoolId(
    poolId: number,
  ): Promise<LeaderboardResponseDto[]> {
    this.logger.log(
      `[findLeaderboardsByPoolId] Fetching leaderboards for pool ID: ${poolId}`,
    );

    try {
      const leaderboards = await this.prisma.leaderboards.findMany({
        where: { poolId },
        select: LEADERBOARD_SELECT,
        orderBy: [{ points: "desc" }, { pointDifference: "desc" }],
      });

      if (leaderboards.length === 0) {
        this.logger.warn(
          `[findLeaderboardsByPoolId] No leaderboard entries found for pool ID: ${poolId}`,
        );
        throw new NotFoundException(
          `No leaderboard entries found for pool ID ${poolId}`,
        );
      }

      this.logger.log(
        `[findLeaderboardsByPoolId] Found ${leaderboards.length} leaderboard entries for pool ID: ${poolId}`,
      );

      return leaderboards.map((entry) => this.mapToDto(entry));
    } catch (error) {
      // Re-throw if it's already a NestJS exception
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `[findLeaderboardsByPoolId] Failed to fetch leaderboards for pool ID ${poolId}`,
        error,
      );
      throw error;
    }
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
    this.logger.log(
      `[findLeaderboardById] Fetching leaderboard entry with ID: ${leaderboardId}`,
    );

    const leaderboard = await this.prisma.leaderboards.findUnique({
      where: { id: leaderboardId },
      select: LEADERBOARD_SELECT,
    });

    if (!leaderboard) {
      this.logger.warn(
        `[findLeaderboardById] Leaderboard entry with ID ${leaderboardId} not found`,
      );
      throw new NotFoundException(
        `Leaderboard entry with ID ${leaderboardId} not found`,
      );
    }

    return this.mapToDto(leaderboard);
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
  ): LeaderboardResponseDto {
    return {
      id: leaderboard.id,
      teamId: leaderboard.teamId,
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
