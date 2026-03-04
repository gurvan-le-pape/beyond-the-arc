// src/backend/modules/competitions/championships/championships.controller.spec.ts
import { CompetitionLevel } from "@common/constants/competition-levels";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

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
    findAllDivisions: jest.fn(),
    findChampionshipById: jest.fn(),
    findChampionshipsByLevel: jest.fn(),
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
      controllers: [ChampionshipsController],
      providers: [
        {
          provide: ChampionshipsService,
          useValue: mockChampionshipsService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
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
        name: "Championship Régional U18",
        category: "U18",
        gender: "male",
        seasonYear: "2024-2025",
        level: CompetitionLevel.REGIONAL,
        division: 1,
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

    it("should accept ID as number parameter", async () => {
      // Arrange
      const mockChampionship: ChampionshipResponseDto = {
        id: 42,
        name: "Test Championship",
        category: null,
        gender: "male",
        seasonYear: "2024-2025",
        level: "regional",
        division: 1,
      };

      mockChampionshipsService.findChampionshipById.mockResolvedValue(
        mockChampionship,
      );

      // Act
      await controller.getChampionshipById(42);

      // Assert
      expect(service.findChampionshipById).toHaveBeenCalledWith(42);
    });
  });

  describe("getChampionships", () => {
    describe("Regional level", () => {
      it("should return regional championships for valid league ID", async () => {
        // Arrange
        const mockChampionships: ChampionshipResponseDto[] = [
          {
            id: 1,
            name: "Championship Régional U18",
            category: "U18",
            gender: "male",
            seasonYear: "2024-2025",
            level: CompetitionLevel.REGIONAL,
            division: 1,
          },
          {
            id: 2,
            name: "Championship Régional Senior",
            category: "Senior",
            gender: "female",
            seasonYear: "2024-2025",
            level: CompetitionLevel.REGIONAL,
            division: 2,
          },
        ];

        mockChampionshipsService.findChampionshipsByLevel.mockResolvedValue(
          mockChampionships,
        );

        const query = {
          level: CompetitionLevel.REGIONAL,
          id: 1,
        };

        // Act
        const result = await controller.getChampionships(query);

        // Assert
        expect(result).toEqual(mockChampionships);
        expect(service.findChampionshipsByLevel).toHaveBeenCalledWith(
          CompetitionLevel.REGIONAL,
          1,
        );
      });

      it("should throw NotFoundException when no championships found", async () => {
        // Arrange
        mockChampionshipsService.findChampionshipsByLevel.mockRejectedValue(
          new NotFoundException(
            "No regional championships found for league ID 999",
          ),
        );

        const query = {
          level: CompetitionLevel.REGIONAL,
          id: 999,
        };

        // Act & Assert
        await expect(controller.getChampionships(query)).rejects.toThrow(
          NotFoundException,
        );
      });
    });

    describe("Departmental level", () => {
      it("should return departmental championships for valid committee ID", async () => {
        // Arrange
        const mockChampionships: ChampionshipResponseDto[] = [
          {
            id: 1,
            name: "Championship Departmental U15",
            category: "U15",
            gender: "male",
            seasonYear: "2024-2025",
            level: CompetitionLevel.DEPARTMENTAL,
            division: 1,
          },
        ];

        mockChampionshipsService.findChampionshipsByLevel.mockResolvedValue(
          mockChampionships,
        );

        const query = {
          level: CompetitionLevel.DEPARTMENTAL,
          id: 5,
        };

        // Act
        const result = await controller.getChampionships(query);

        // Assert
        expect(result).toEqual(mockChampionships);
        expect(service.findChampionshipsByLevel).toHaveBeenCalledWith(
          CompetitionLevel.DEPARTMENTAL,
          5,
        );
      });

      it("should throw NotFoundException when no championships found", async () => {
        // Arrange
        mockChampionshipsService.findChampionshipsByLevel.mockRejectedValue(
          new NotFoundException(
            "No departmental championships found for committee ID 999",
          ),
        );

        const query = {
          level: CompetitionLevel.DEPARTMENTAL,
          id: 999,
        };

        // Act & Assert
        await expect(controller.getChampionships(query)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe("metadata", () => {
    it("should be decorated with @Controller", () => {
      const metadata = Reflect.getMetadata("path", ChampionshipsController);
      expect(metadata).toBe("championships");
    });
  });
});
