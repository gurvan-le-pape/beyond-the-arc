// src/backend/modules/competitions/championships/championships.controller.spec.ts
import { CompetitionLevel } from "@common/constants";
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";

import { ChampionshipsController } from "./championships.controller";
import { ChampionshipsService } from "./championships.service";
import type { ChampionshipResponseDto } from "./dto/championships.response.dto";

/**
 * Unit tests for ChampionshipsController.
 *
 * Tests cover:
 * - Request handling
 * - Response formatting
 * - Error propagation
 * - Validation
 */
describe("ChampionshipsController", () => {
  let controller: ChampionshipsController;
  let service: ChampionshipsService;

  // Mock service
  const mockChampionshipsService = {
    findChampionshipById: jest.fn(),
    findChampionships: jest.fn(),
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
      imports: [LoggerModule.forRoot()],
      controllers: [ChampionshipsController],
      providers: [
        { provide: ChampionshipsService, useValue: mockChampionshipsService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
        CacheDedupService,
      ],
    }).compile();

    controller = module.get<ChampionshipsController>(ChampionshipsController);
    service = module.get<ChampionshipsService>(ChampionshipsService);

    jest.clearAllMocks();
  });

  describe("getChampionshipById", () => {
    it("should return championship for valid ID", async () => {
      // Arrange
      const mockChampionship: ChampionshipResponseDto = {
        id: 1,
        category: "U18",
        gender: "male",
        seasonYear: "2024-2025",
        level: CompetitionLevel.REGIONAL,
        division: 1,
        leagueId: 1,
        committeeId: null,
        committeeName: null,
        leagueName: "LIGUE REGIONALE DE BRETAGNE DE BASKET-BALL",
        regionName: "Bretagne",
        departmentName: null,
        pools: [],
      };

      mockChampionshipsService.findChampionshipById.mockResolvedValue(
        mockChampionship,
      );

      // Act
      const result = await controller.getChampionshipById(1);

      // Assert
      expect(result).toEqual(mockChampionship);
      expect(service.findChampionshipById).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException for non-existent ID", async () => {
      // Arrange
      mockChampionshipsService.findChampionshipById.mockRejectedValue(
        new NotFoundException("Championship with ID 999 not found"),
      );

      // Act & Assert
      await expect(controller.getChampionshipById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("getChampionships", () => {
    // Arrange
    const mockPaginatedResponse = {
      items: [
        {
          id: 1,
          category: "U18",
          gender: "male",
          seasonYear: "2024-2025",
          level: CompetitionLevel.REGIONAL,
          division: 1,
          leagueId: 1,
          committeeId: null,
          committeeName: null,
          leagueName: "LIGUE REGIONALE DE BRETAGNE DE BASKET-BALL",
          regionName: "Bretagne",
          departmentName: null,
          pools: [],
        },
      ],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    };

    it("should call findChampionships with all query params", async () => {
      mockChampionshipsService.findChampionships.mockResolvedValue(
        mockPaginatedResponse,
      );

      const query = {
        level: CompetitionLevel.REGIONAL,
        leagueId: 1,
        committeeId: 5,
        category: "U18" as any,
        gender: "male" as any,
        page: 1,
        limit: 20,
      };

      // Act
      const result = await controller.getChampionships(query);

      // Assert
      expect(result).toEqual(mockPaginatedResponse);
      expect(service.findChampionships).toHaveBeenCalledWith({
        level: CompetitionLevel.REGIONAL,
        leagueId: 1,
        committeeId: 5,
        category: "U18",
        gender: "male",
        page: 1,
        limit: 20,
      });
    });

    it("should pass an empty query through when no params are provided", async () => {
      // Arrange
      mockChampionshipsService.findChampionships.mockResolvedValue({
        ...mockPaginatedResponse,
        items: [],
        total: 0,
        totalPages: 0,
      });

      await controller.getChampionships({});

      expect(service.findChampionships).toHaveBeenCalledWith({});
    });

    it("should return empty paginated response when no results", async () => {
      mockChampionshipsService.findChampionships.mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      });

      const result = await controller.getChampionships({
        level: CompetitionLevel.REGIONAL,
        leagueId: 999,
      });

      // Act & Assert
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it("should filter by departmental level and committee ID", async () => {
      mockChampionshipsService.findChampionships.mockResolvedValue(
        mockPaginatedResponse,
      );

      await controller.getChampionships({
        level: CompetitionLevel.DEPARTMENTAL,
        committeeId: 5,
      });

      expect(service.findChampionships).toHaveBeenCalledWith(
        expect.objectContaining({
          level: CompetitionLevel.DEPARTMENTAL,
          committeeId: 5,
        }),
      );
    });
  });

  describe("metadata", () => {
    it("should be decorated with @Controller", () => {
      const metadata = Reflect.getMetadata("path", ChampionshipsController);
      expect(metadata).toBe("championships");
    });
  });
});
