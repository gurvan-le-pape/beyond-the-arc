// src/backend/modules/organizations/leagues/leagues.controller.spec.ts
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import type { LeagueResponseDto } from "./dto/leagues.response.dto";
import { LeaguesController } from "./leagues.controller";
import { LeaguesService } from "./leagues.service";

/**
 * Unit tests for LeaguesController.
 *
 * Tests cover:
 * - Request handling
 * - Response formatting
 * - Error propagation
 * - Validation
 */
describe("LeaguesController", () => {
  let controller: LeaguesController;
  let service: LeaguesService;

  // Mock service
  const mockLeaguesService = {
    findAllLeagues: jest.fn(),
    findLeagueById: jest.fn(),
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
      controllers: [LeaguesController],
      providers: [
        {
          provide: LeaguesService,
          useValue: mockLeaguesService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    controller = module.get<LeaguesController>(LeaguesController);
    service = module.get<LeaguesService>(LeaguesService);

    jest.clearAllMocks();
  });

  describe("getAllLeagues", () => {
    it("should return array of leagues", async () => {
      // Arrange
      const mockLeagues: LeagueResponseDto[] = [
        { id: 1, name: "League Auvergne-Rhône-Alpes" },
        { id: 2, name: "League Bourgogne-Franche-Comté" },
        { id: 3, name: "League Bretagne" },
      ];

      mockLeaguesService.findAllLeagues.mockResolvedValue(mockLeagues);

      // Act
      const result = await controller.getAllLeagues();

      // Assert
      expect(result).toEqual(mockLeagues);
      expect(service.findAllLeagues).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no leagues exist", async () => {
      // Arrange
      mockLeaguesService.findAllLeagues.mockResolvedValue([]);

      // Act
      const result = await controller.getAllLeagues();

      // Assert
      expect(result).toEqual([]);
    });

    it("should propagate service errors", async () => {
      // Arrange
      const error = new Error("Database error");
      mockLeaguesService.findAllLeagues.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getAllLeagues()).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("getLeagueById", () => {
    it("should return league for valid ID", async () => {
      // Arrange
      const mockLeague: LeagueResponseDto = {
        id: 1,
        name: "League Auvergne-Rhône-Alpes",
      };

      mockLeaguesService.findLeagueById.mockResolvedValue(mockLeague);

      // Act
      const result = await controller.getLeagueById(1);

      // Assert
      expect(result).toEqual(mockLeague);
      expect(service.findLeagueById).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException for non-existent ID", async () => {
      // Arrange
      mockLeaguesService.findLeagueById.mockRejectedValue(
        new NotFoundException("League with ID 999 not found"),
      );

      // Act & Assert
      await expect(controller.getLeagueById(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should accept ID as number parameter", async () => {
      // Arrange
      const mockLeague: LeagueResponseDto = {
        id: 42,
        name: "Test League",
      };

      mockLeaguesService.findLeagueById.mockResolvedValue(mockLeague);

      // Act
      await controller.getLeagueById(42);

      // Assert
      expect(service.findLeagueById).toHaveBeenCalledWith(42);
    });
  });

  describe("metadata", () => {
    it("should be decorated with @Controller", () => {
      const metadata = Reflect.getMetadata("path", LeaguesController);
      expect(metadata).toBe("leagues");
    });
  });
});
