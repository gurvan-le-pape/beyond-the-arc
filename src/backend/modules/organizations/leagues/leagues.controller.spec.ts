// src/backend/modules/organizations/leagues/leagues.controller.spec.ts
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";

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
      imports: [LoggerModule.forRoot()],
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
        CacheDedupService,
      ],
    }).compile();

    controller = module.get<LeaguesController>(LeaguesController);
    service = module.get<LeaguesService>(LeaguesService);

    jest.clearAllMocks();
  });

  const mockLeagueDto = (
    overrides: Partial<LeagueResponseDto> = {},
  ): LeagueResponseDto =>
    ({
      address: null,
      region: { name: "Region", code: "REG" },
      ...overrides,
    }) as LeagueResponseDto;

  describe("getAllLeagues", () => {
    it("should return array of leagues with regions", async () => {
      // Arrange
      const mockLeagues: LeagueResponseDto[] = [
        mockLeagueDto({
          id: 1,
          name: "LIGUE REGIONALE AUVERGNE-RHONE-ALPES DE BASKET-BALL",
          region: { name: "Auvergne-Rhône-Alpes", code: "ARA" },
        }),
        mockLeagueDto({
          id: 2,
          name: "LIGUE REGIONALE BOURGOGNE-FRANCHE-COMTE DE BASKET-BALL",
          region: { name: "Bourgogne-Franche-Comté", code: "BFC" },
        }),
        mockLeagueDto({
          id: 3,
          name: "LIGUE REGIONALE BRETAGNE DE BASKET-BALL",
          region: { name: "Bretagne", code: "BRE" },
        }),
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
    it("should return league with region for valid ID", async () => {
      // Arrange
      const mockLeague = mockLeagueDto({
        id: 1,
        name: "LIGUE REGIONALE BRETAGNE DE BASKET-BALL",
        region: { name: "Bretagne", code: "BRE" },
      });

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
      const mockLeague = mockLeagueDto({
        id: 42,
        name: "LIGUE REGIONALE TEST DE BASKET-BALL",
        region: { name: "Test Region", code: "TST" },
      });

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
