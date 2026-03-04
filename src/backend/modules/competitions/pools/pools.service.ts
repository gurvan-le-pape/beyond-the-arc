// src/backend/modules/competitions/pools/pools.service.ts
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "prisma/prisma.service";

import { PoolResponseDto } from "./dto/pools.response.dto";

/**
 * Fields to select from the pools table.
 * Single source of truth for consistent queries.
 */
const POOL_SELECT = {
  id: true,
  letter: true,
  name: true,
  championshipId: true,
} as const;

/**
 * Type representing the Prisma pool select result.
 * This matches exactly what Prisma returns from the select query.
 */
type PoolSelectResult = Prisma.PoolsGetPayload<{
  select: typeof POOL_SELECT;
}>;

/**
 * Service handling business logic for pools.
 * Encapsulates database access and domain logic.
 */
@Injectable()
export class PoolsService {
  private readonly logger = new Logger(PoolsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds all pools for a specific championship.
   *
   * @param championshipId - The championship ID
   * @returns Array of pool DTOs
   * @throws NotFoundException if no pools found
   */
  async findPoolsByChampionshipId(
    championshipId: number,
  ): Promise<PoolResponseDto[]> {
    this.logger.log(
      `[findPoolsByChampionshipId] Fetching pools for championship ID: ${championshipId}`,
    );

    try {
      const pools = await this.prisma.pools.findMany({
        where: { championshipId },
        select: POOL_SELECT,
        orderBy: { letter: "asc" },
      });

      if (pools.length === 0) {
        this.logger.warn(
          `[findPoolsByChampionshipId] No pools found for championship ID: ${championshipId}`,
        );
        throw new NotFoundException(
          `No pools found for championship ID ${championshipId}`,
        );
      }

      this.logger.log(
        `[findPoolsByChampionshipId] Found ${pools.length} pools for championship ID: ${championshipId}`,
      );

      return pools.map((pool) => this.mapToDto(pool));
    } catch (error) {
      // Re-throw if it's already a NestJS exception
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `[findPoolsByChampionshipId] Failed to fetch pools for championship ID ${championshipId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Finds a pool by its ID.
   *
   * @param poolId - The pool ID
   * @returns Pool DTO
   * @throws NotFoundException if pool doesn't exist
   */
  async findPoolById(poolId: number): Promise<PoolResponseDto> {
    this.logger.log(`[findPoolById] Fetching pool with ID: ${poolId}`);

    const pool = await this.prisma.pools.findUnique({
      where: { id: poolId },
      select: POOL_SELECT,
    });

    if (!pool) {
      this.logger.warn(`[findPoolById] Pool with ID ${poolId} not found`);
      throw new NotFoundException(`Pool with ID ${poolId} not found`);
    }

    return this.mapToDto(pool);
  }

  /**
   * Maps a Prisma pool entity to a response DTO.
   * Centralizes the mapping logic and handles null values.
   * The `satisfies` operator ensures compile-time type checking.
   *
   * @param pool - Prisma pool select result
   * @returns PoolResponseDto
   */
  private mapToDto(pool: PoolSelectResult): PoolResponseDto {
    return {
      id: pool.id,
      letter: pool.letter,
      name: pool.name,
      championshipId: pool.championshipId,
    } satisfies PoolResponseDto; // TypeScript validates this matches
  }
}
