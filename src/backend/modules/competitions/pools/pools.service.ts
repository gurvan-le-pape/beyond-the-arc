// src/backend/modules/competitions/pools/pools.service.ts
import { Category, CompetitionLevel } from "@common/constants";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import { Prisma } from "../../../prisma/generated/prisma/client";
import {
  PoolResponseDto,
  RecentPoolResponseDto,
} from "./dto/pools.response.dto";

/** Most recent pools returned by {@link PoolsService.findRecentPools}. */
const RECENT_POOLS_LIMIT = 10;

/**
 * Tie-break between pools that played the same round, most prominent first:
 * level, then category, then division (lower first), then pool id.
 */
const RECENT_POOLS_LEVEL_ORDER: readonly string[] = [
  CompetitionLevel.NATIONAL,
  CompetitionLevel.REGIONAL,
  CompetitionLevel.DEPARTMENTAL,
];
const RECENT_POOLS_CATEGORY_ORDER: readonly string[] = [
  Category.SENIORS,
  Category.U21,
  Category.U18,
  Category.U15,
  Category.U13,
  Category.U11,
];

/**
 * Position of `value` in `order`, with unknown values after every known one.
 */
const rankIn = (order: readonly string[], value: string): number => {
  const index = order.indexOf(value);
  return index === -1 ? order.length : index;
};

/**
 * Fields to select from the pools table.
 * Single source of truth for consistent queries.
 */
const POOL_SELECT = {
  id: true,
  letter: true,
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
    const pools = await this.prisma.client.pools.findMany({
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
    const pool = await this.prisma.client.pools.findUnique({
      where: { id: poolId },
      select: POOL_SELECT,
    });

    if (!pool) {
      throw new NotFoundException(`Pool with ID ${poolId} not found`);
    }

    return this.mapToDto(pool);
  }

  /**
   * Finds the pools that played the most recent completed round.
   *
   * @remarks
   * The round is the latest tip-off instant of any completed match. Thousands
   * of matches share that instant, so pools are ordered deterministically:
   * level (national first), category (seniors first, then youngest last),
   * division (lower first), then pool id. Same data, same answer.
   *
   * The categories are strings with no database order, so the candidates'
   * sort keys are fetched and sorted here; only the winners are loaded in full.
   *
   * @returns At most {@link RECENT_POOLS_LIMIT} pools, or `[]` before any match is completed
   */
  async findRecentPools(): Promise<RecentPoolResponseDto[]> {
    const latest = await this.prisma.client.matches.findFirst({
      where: { status: "completed" },
      orderBy: { startsAt: "desc" },
      select: { startsAt: true },
    });

    if (!latest) {
      return [];
    }

    const playedAt = latest.startsAt;
    const playedInRound = { status: "completed", startsAt: playedAt };

    const candidates = await this.prisma.client.pools.findMany({
      where: { matches: { some: playedInRound } },
      select: {
        id: true,
        championship: {
          select: { level: true, category: true, division: true },
        },
      },
    });

    const recentIds = candidates
      .map(({ id, championship }) => ({
        id,
        sortKey: [
          rankIn(RECENT_POOLS_LEVEL_ORDER, championship.level),
          rankIn(RECENT_POOLS_CATEGORY_ORDER, championship.category),
          championship.division,
          id,
        ],
      }))
      .sort((a, b) => {
        const differing = a.sortKey.findIndex((key, i) => key !== b.sortKey[i]);
        return differing === -1
          ? 0
          : a.sortKey[differing] - b.sortKey[differing];
      })
      .slice(0, RECENT_POOLS_LIMIT)
      .map(({ id }) => id);

    const [pools, roundMatches] = await Promise.all([
      this.prisma.client.pools.findMany({
        where: { id: { in: recentIds } },
        select: POOL_SELECT,
      }),
      this.prisma.client.matches.findMany({
        where: { ...playedInRound, poolId: { in: recentIds } },
        distinct: ["poolId"],
        select: { poolId: true, matchday: true },
      }),
    ]);
    const poolById = new Map(pools.map((pool) => [pool.id, pool]));
    const matchdayByPool = new Map(
      roundMatches.map((match) => [match.poolId, match.matchday]),
    );

    // Every id here came from a pool with a completed match at playedAt —
    // that is the filter that selected it — so both lookups always hit.
    return recentIds.map((id) => ({
      ...this.mapToDto(poolById.get(id)!),
      matchday: matchdayByPool.get(id)!,
      playedAt,
    }));
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
      championshipId: pool.championshipId,
      nbMatchdays: pool.matches.length,
    } satisfies PoolResponseDto; // TypeScript validates this matches
  }
}
