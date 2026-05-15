// src/backend/modules/competitions/pools/pools.service.spec.ts
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { NotFoundException } from "@nestjs/common";
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
        findUnique: jest.fn(),
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

  describe("findPoolsByChampionshipId", () => {
    it("should return all pools for a given championship", async () => {
      // Arrange
      const championshipId = 1;
      const mockPools = [
        {
          id: 1,
          letter: "A",
          name: "Pool A - Seniors",
          championshipId: 1,
          matches: [{ matchday: 1 }, { matchday: 2 }],
        },
        {
          id: 2,
          letter: "B",
          name: "Pool B - Seniors",
          championshipId: 1,
          matches: [],
        },
      ];

      mockPrismaService.client.pools.findMany.mockResolvedValue(mockPools);

      // Act
      const result = await service.findPoolsByChampionshipId(championshipId);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        letter: "A",
        name: "Pool A - Seniors",
        championshipId: 1,
        nbMatchdays: 2,
      });
      expect(result[1].letter).toBe("B");

      expect(mockPrismaService.client.pools.findMany).toHaveBeenCalledWith({
        where: { championshipId },
        select: {
          id: true,
          letter: true,
          name: true,
          championshipId: true,
          matches: {
            select: { matchday: true },
            distinct: ["matchday"],
          },
        },
        orderBy: { letter: "asc" },
      });
    });

    it("should return empty array when no pools found", async () => {
      // Arrange
      const championshipId = 999;
      mockPrismaService.client.pools.findMany.mockResolvedValue([]);

      // Act
      const result = await service.findPoolsByChampionshipId(championshipId);

      // Assert
      expect(result).toEqual([]);
    });

    it("should propagate database errors", async () => {
      // Arrange
      const championshipId = 1;
      const dbError = new Error("Database connection failed");
      mockPrismaService.client.pools.findMany.mockRejectedValue(dbError);

      // Act & Assert
      await expect(
        service.findPoolsByChampionshipId(championshipId),
      ).rejects.toThrow("Database connection failed");
    });

    it("should order results by letter ascending", async () => {
      // Arrange
      const championshipId = 1;
      mockPrismaService.client.pools.findMany.mockResolvedValue([
        {
          id: 1,
          letter: "A",
          name: "Pool A",
          championshipId: 1,
          matches: [],
        },
      ]);

      // Act
      await service.findPoolsByChampionshipId(championshipId);

      // Assert
      expect(mockPrismaService.client.pools.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { letter: "asc" },
        }),
      );
    });
  });

  describe("findPoolById", () => {
    it("should return pool when found", async () => {
      // Arrange
      const id = 1;
      const mockPool = {
        id: 1,
        letter: "A",
        name: "Pool A - Seniors",
        championshipId: 1,
        matches: [{ matchday: 1 }, { matchday: 2 }],
      };

      mockPrismaService.client.pools.findUnique.mockResolvedValue(mockPool);

      // Act
      const result = await service.findPoolById(id);

      // Assert
      expect(result).toEqual({
        id: 1,
        letter: "A",
        name: "Pool A - Seniors",
        championshipId: 1,
        nbMatchdays: 2,
      });

      expect(mockPrismaService.client.pools.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: {
          id: true,
          letter: true,
          name: true,
          championshipId: true,
          matches: {
            select: { matchday: true },
            distinct: ["matchday"],
          },
        },
      });
    });

    it("should throw NotFoundException when pool not found", async () => {
      // Arrange
      const id = 999;
      mockPrismaService.client.pools.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findPoolById(id)).rejects.toThrow(NotFoundException);

      await expect(service.findPoolById(id)).rejects.toThrow(
        "Pool with ID 999 not found",
      );
    });

    it("should use POOL_SELECT constant for consistent queries", async () => {
      // Arrange
      const id = 1;
      mockPrismaService.client.pools.findUnique.mockResolvedValue({
        id: 1,
        letter: "A",
        name: "Test",
        championshipId: 1,
        matches: [],
      });

      // Act
      await service.findPoolById(id);

      // Assert
      expect(mockPrismaService.client.pools.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: {
          id: true,
          letter: true,
          name: true,
          championshipId: true,
          matches: {
            select: { matchday: true },
            distinct: ["matchday"],
          },
        },
      });
    });
  });
});
