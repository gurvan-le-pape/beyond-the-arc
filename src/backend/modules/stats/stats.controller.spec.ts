// src/backend/modules/stats/stats.controller.spec.ts
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";

import type { StatsResponseDto } from "./dto/stats.response.dto";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";

/**
 * Unit tests for StatsController.
 *
 * Tests cover:
 * - Request handling
 * - Response formatting
 * - Error propagation
 */
describe("StatsController", () => {
  let controller: StatsController;
  let service: StatsService;

  const mockStatsService = {
    getStats: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      controllers: [StatsController],
      providers: [
        {
          provide: StatsService,
          useValue: mockStatsService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        CacheDedupService,
      ],
    }).compile();

    controller = module.get<StatsController>(StatsController);
    service = module.get<StatsService>(StatsService);

    jest.clearAllMocks();
  });

  describe("getStats", () => {
    it("should return platform statistics", async () => {
      // Arrange
      const mockStats: StatsResponseDto = {
        clubs: 840,
        teams: 3200,
        players: 12400,
        matches: 48000,
        leagues: 26,
        committees: 95,
        championshipsByLevel: { national: 12, regional: 84, departmental: 288 },
      };

      mockStatsService.getStats.mockResolvedValue(mockStats);

      // Act
      const result = await controller.getStats();

      // Assert
      expect(result).toEqual(mockStats);
      expect(service.getStats).toHaveBeenCalledTimes(1);
    });

    it("should return zeroed counts when platform has no data", async () => {
      // Arrange
      const mockStats: StatsResponseDto = {
        clubs: 0,
        teams: 0,
        players: 0,
        matches: 0,
        leagues: 0,
        committees: 0,
        championshipsByLevel: { national: 0, regional: 0, departmental: 0 },
      };

      mockStatsService.getStats.mockResolvedValue(mockStats);

      // Act
      const result = await controller.getStats();

      // Assert
      expect(result).toEqual(mockStats);
    });

    it("should propagate service errors", async () => {
      // Arrange
      mockStatsService.getStats.mockRejectedValue(new Error("Database error"));

      // Act & Assert
      await expect(controller.getStats()).rejects.toThrow("Database error");
    });
  });

  describe("metadata", () => {
    it("should be decorated with @Controller", () => {
      const metadata = Reflect.getMetadata("path", StatsController);
      expect(metadata).toBe("stats");
    });
  });
});
