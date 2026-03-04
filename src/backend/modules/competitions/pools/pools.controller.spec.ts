// src/backend/modules/competitions/pools/pools.controller.spec.ts
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import type { PoolResponseDto } from "./dto/pools.response.dto";
import { PoolsController } from "./pools.controller";
import { PoolsService } from "./pools.service";

/**
 * Unit tests for PoolsController.
 *
 * Tests cover:
 * - Request handling
 * - Response formatting
 * - Error propagation
 * - Validation
 */
describe("PoolsController", () => {
  let controller: PoolsController;
  let service: PoolsService;

  // Mock service
  const mockPoolsService = {
    findPoolsByChampionshipId: jest.fn(),
    findPoolById: jest.fn(),
  };

  // Mock cache manager
  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoolsController],
      providers: [
        {
          provide: PoolsService,
          useValue: mockPoolsService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    controller = module.get<PoolsController>(PoolsController);
    service = module.get<PoolsService>(PoolsService);

    jest.clearAllMocks();
  });

  describe("getPoolsByChampionshipId", () => {
    it("should return array of pools for valid championship ID", async () => {
      // Arrange
      const mockPools: PoolResponseDto[] = [
        {
          id: 1,
          letter: "A",
          name: "Pool A - Seniors",
          championshipId: 1,
        },
        {
          id: 2,
          letter: "B",
          name: "Pool B - Seniors",
          championshipId: 1,
        },
      ];

      mockPoolsService.findPoolsByChampionshipId.mockResolvedValue(mockPools);

      // Act
      const result = await controller.getPoolsByChampionshipId({
        championshipId: 1,
      });

      // Assert
      expect(result).toEqual(mockPools);
      expect(service.findPoolsByChampionshipId).toHaveBeenCalledWith(1);
      expect(service.findPoolsByChampionshipId).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException when no pools found", async () => {
      // Arrange
      mockPoolsService.findPoolsByChampionshipId.mockRejectedValue(
        new NotFoundException("No pools found for championship ID 999"),
      );

      // Act & Assert
      await expect(
        controller.getPoolsByChampionshipId({ championshipId: 999 }),
      ).rejects.toThrow(NotFoundException);

      await expect(
        controller.getPoolsByChampionshipId({ championshipId: 999 }),
      ).rejects.toThrow("No pools found for championship ID 999");
    });

    it("should propagate service errors", async () => {
      // Arrange
      const error = new Error("Database error");
      mockPoolsService.findPoolsByChampionshipId.mockRejectedValue(error);

      // Act & Assert
      await expect(
        controller.getPoolsByChampionshipId({ championshipId: 1 }),
      ).rejects.toThrow("Database error");
    });

    it("should handle empty result arrays", async () => {
      // Arrange
      mockPoolsService.findPoolsByChampionshipId.mockRejectedValue(
        new NotFoundException("No pools found for championship ID 1"),
      );

      // Act & Assert
      await expect(
        controller.getPoolsByChampionshipId({ championshipId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe("getPoolById", () => {
    it("should return pool for valid ID", async () => {
      // Arrange
      const mockPool: PoolResponseDto = {
        id: 1,
        letter: "A",
        name: "Pool A - Seniors",
        championshipId: 1,
      };

      mockPoolsService.findPoolById.mockResolvedValue(mockPool);

      // Act
      const result = await controller.getPoolById(1);

      // Assert
      expect(result).toEqual(mockPool);
      expect(service.findPoolById).toHaveBeenCalledWith(1);
      expect(service.findPoolById).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException for non-existent ID", async () => {
      // Arrange
      mockPoolsService.findPoolById.mockRejectedValue(
        new NotFoundException("Pool with ID 999 not found"),
      );

      // Act & Assert
      await expect(controller.getPoolById(999)).rejects.toThrow(
        NotFoundException,
      );

      await expect(controller.getPoolById(999)).rejects.toThrow(
        "Pool with ID 999 not found",
      );
    });

    it("should accept ID as number parameter", async () => {
      // Arrange
      const mockPool: PoolResponseDto = {
        id: 42,
        letter: "C",
        name: "Pool C",
        championshipId: 5,
      };

      mockPoolsService.findPoolById.mockResolvedValue(mockPool);

      // Act
      await controller.getPoolById(42);

      // Assert
      expect(service.findPoolById).toHaveBeenCalledWith(42);
    });

    it("should propagate service errors", async () => {
      // Arrange
      const error = new Error("Database error");
      mockPoolsService.findPoolById.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getPoolById(1)).rejects.toThrow("Database error");
    });
  });

  describe("metadata", () => {
    it("should be decorated with @Controller", () => {
      const metadata = Reflect.getMetadata("path", PoolsController);
      expect(metadata).toBe("pools");
    });
  });
});
