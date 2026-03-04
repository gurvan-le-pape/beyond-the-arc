// src/backend/modules/competitions/pools/pools.service.spec.ts
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
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
    pools: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoolsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
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
        { id: 1, letter: "A", name: "Pool A - Seniors", championshipId: 1 },
        { id: 2, letter: "B", name: "Pool B - Seniors", championshipId: 1 },
      ];

      mockPrismaService.pools.findMany.mockResolvedValue(mockPools);

      // Act
      const result = await service.findPoolsByChampionshipId(championshipId);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        letter: "A",
        name: "Pool A - Seniors",
        championshipId: 1,
      });
      expect(result[1].letter).toBe("B");

      expect(mockPrismaService.pools.findMany).toHaveBeenCalledWith({
        where: { championshipId },
        select: {
          id: true,
          letter: true,
          name: true,
          championshipId: true,
        },
        orderBy: { letter: "asc" },
      });
    });

    it("should throw NotFoundException when no pools found", async () => {
      // Arrange
      const championshipId = 999;
      mockPrismaService.pools.findMany.mockResolvedValue([]);

      // Act & Assert
      await expect(
        service.findPoolsByChampionshipId(championshipId),
      ).rejects.toThrow(NotFoundException);

      await expect(
        service.findPoolsByChampionshipId(championshipId),
      ).rejects.toThrow("No pools found for championship ID 999");
    });

    it("should propagate database errors", async () => {
      // Arrange
      const championshipId = 1;
      const dbError = new Error("Database connection failed");
      mockPrismaService.pools.findMany.mockRejectedValue(dbError);

      // Act & Assert
      await expect(
        service.findPoolsByChampionshipId(championshipId),
      ).rejects.toThrow("Database connection failed");
    });

    it("should order results by letter ascending", async () => {
      // Arrange
      const championshipId = 1;
      mockPrismaService.pools.findMany.mockResolvedValue([
        { id: 1, letter: "A", name: "Pool A", championshipId: 1 },
      ]);

      // Act
      await service.findPoolsByChampionshipId(championshipId);

      // Assert
      expect(mockPrismaService.pools.findMany).toHaveBeenCalledWith(
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
      };

      mockPrismaService.pools.findUnique.mockResolvedValue(mockPool);

      // Act
      const result = await service.findPoolById(id);

      // Assert
      expect(result).toEqual({
        id: 1,
        letter: "A",
        name: "Pool A - Seniors",
        championshipId: 1,
      });

      expect(mockPrismaService.pools.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: {
          id: true,
          letter: true,
          name: true,
          championshipId: true,
        },
      });
    });

    it("should throw NotFoundException when pool not found", async () => {
      // Arrange
      const id = 999;
      mockPrismaService.pools.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findPoolById(id)).rejects.toThrow(NotFoundException);

      await expect(service.findPoolById(id)).rejects.toThrow(
        "Pool with ID 999 not found",
      );
    });

    it("should use POOL_SELECT constant for consistent queries", async () => {
      // Arrange
      const id = 1;
      mockPrismaService.pools.findUnique.mockResolvedValue({
        id: 1,
        letter: "A",
        name: "Test",
        championshipId: 1,
      });

      // Act
      await service.findPoolById(id);

      // Assert
      expect(mockPrismaService.pools.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: {
          id: true,
          letter: true,
          name: true,
          championshipId: true,
        },
      });
    });
  });
});
