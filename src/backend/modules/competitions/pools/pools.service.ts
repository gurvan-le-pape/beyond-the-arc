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
  matches: {
    select: { matchday: true },
    distinct: ["matchday"] as ["matchday"],
  },
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
   */
  async findPoolsByChampionshipId(
    championshipId: number,
  ): Promise<PoolResponseDto[]> {
    const pools = await this.prisma.pools.findMany({
      where: { championshipId },
      select: POOL_SELECT,
      orderBy: { letter: "asc" },
    });

    return pools.map((pool) => this.mapToDto(pool));
  }

  /**
   * Finds a pool by its ID.
   *
   * @param poolId - The pool ID
   * @returns Pool DTO
   * @throws NotFoundException if pool doesn't exist
   */
  async findPoolById(poolId: number): Promise<PoolResponseDto> {
    const pool = await this.prisma.pools.findUnique({
      where: { id: poolId },
      select: POOL_SELECT,
    });

    if (!pool) {
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
      nbMatchdays: pool.matches.length,
    } satisfies PoolResponseDto; // TypeScript validates this matches
  }
}
