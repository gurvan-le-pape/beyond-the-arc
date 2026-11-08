// src/backend/modules/competitions/pools/pools.service.spec.ts
import { CacheDedupService } from "@common/services/cache-dedup.service";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";
import { PrismaService } from "prisma/prisma.service";

import { PoolsService } from "./pools.service";

/**
 * Unit tests for PoolsService.
 *
 * Tests cover:
 * - Happy path scenarios
 * - Error handling
 * - Edge cases
 * - Data transformation
 */
describe("PoolsService", () => {
  let service: PoolsService;
  let prismaService: PrismaService;

  // Mock Prisma service
  const mockPrismaService = {
    client: {
      pools: {
        findMany: jest.fn(),
      },
      matches: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        PoolsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        CacheDedupService,
      ],
    }).compile();

    service = module.get<PoolsService>(PoolsService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe("findRecentPools", () => {
    const playedAt = new Date("2026-10-17T20:00:00Z");
    const round = { status: "completed", startsAt: playedAt };
    const candidate = (
      id: number,
      level: string,
      category: string,
      division: number,
    ) => ({ id, championship: { level, category, division } });
    const fullPool = (id: number) => ({
      id,
      letter: "A",
      championshipId: 1,
      teams: [{ homeMatches: [{ matchday: 1 }, { matchday: 2 }] }],
    });

    /** Stubs the round, its candidates, and full rows for whichever ids are asked for. */
    const givenRound = (candidates: ReturnType<typeof candidate>[]) => {
      mockPrismaService.client.matches.findFirst.mockResolvedValue({
        startsAt: playedAt,
      });
      mockPrismaService.client.pools.findMany.mockImplementation(
        (args: { where: { id?: { in: number[] } } }) =>
          Promise.resolve(
            args.where.id
              ? // Reversed, so the result order cannot leak from the query's
                [...args.where.id.in].reverse().map(fullPool)
              : candidates,
          ),
      );
      mockPrismaService.client.matches.findMany.mockImplementation(
        (args: { where: { homeTeam: { poolId: { in: number[] } } } }) =>
          Promise.resolve(
            args.where.homeTeam.poolId.in.map((poolId) => ({
              homeTeam: { poolId },
              matchday: 4,
            })),
          ),
      );
    };

    it("returns an empty array before any match is completed", async () => {
      mockPrismaService.client.matches.findFirst.mockResolvedValue(null);

      const result = await service.findRecentPools();

      expect(result).toEqual([]);
      expect(mockPrismaService.client.pools.findMany).not.toHaveBeenCalled();
    });

    it("takes candidates from pools with a completed match at the latest tip-off", async () => {
      givenRound([]);

      await service.findRecentPools();

      expect(mockPrismaService.client.matches.findFirst).toHaveBeenCalledWith({
        where: { status: "completed" },
        orderBy: { startsAt: "desc" },
        select: { startsAt: true },
      });
      expect(
        mockPrismaService.client.pools.findMany.mock.calls[0][0].where,
      ).toEqual({ teams: { some: { homeMatches: { some: round } } } });
    });

    it("orders by level, then category with seniors first, then division, then pool id", async () => {
      givenRound([
        candidate(1, "departmental", "Seniors", 1),
        candidate(2, "regional", "U13", 1),
        candidate(3, "regional", "Seniors", 2),
        candidate(4, "regional", "U21", 1),
        candidate(9, "regional", "Seniors", 1),
        candidate(8, "regional", "Seniors", 1),
      ]);

      const result = await service.findRecentPools();

      expect(result.map((pool) => pool.id)).toEqual([8, 9, 3, 4, 2, 1]);
    });

    it("returns at most ten pools", async () => {
      givenRound(
        Array.from({ length: 12 }, (_, i) =>
          candidate(i + 1, "regional", "Seniors", 1),
        ),
      );

      const result = await service.findRecentPools();

      expect(result.map((pool) => pool.id)).toEqual([
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ]);
    });

    it("attaches each pool's matchday in the round and the round's tip-off", async () => {
      givenRound([candidate(5985, "regional", "Seniors", 1)]);

      const result = await service.findRecentPools();

      expect(mockPrismaService.client.matches.findMany).toHaveBeenCalledWith({
        where: { ...round, homeTeam: { poolId: { in: [5985] } } },
        select: { matchday: true, homeTeam: { select: { poolId: true } } },
      });
      expect(result).toEqual([
        {
          id: 5985,
          letter: "A",
          championshipId: 1,
          nbMatchdays: 2,
          matchday: 4,
          playedAt,
        },
      ]);
    });
  });
});
