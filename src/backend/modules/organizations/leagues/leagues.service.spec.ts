// src/backend/modules/organizations/leagues/leagues.service.spec.ts
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";
import { PrismaService } from "prisma/prisma.service";

import { LeaguesService } from "./leagues.service";

/**
 * Unit tests for LeaguesService.
 *
 * Tests cover:
 * - Happy path scenarios
 * - Error handling
 * - Edge cases
 * - Data transformation
 */
describe("LeaguesService", () => {
  let service: LeaguesService;
  let prismaService: PrismaService;

  // Mock Prisma service
  const mockPrismaService = {
    client: {
      leagues: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        LeaguesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        CacheDedupService,
      ],
    }).compile();

    service = module.get<LeaguesService>(LeaguesService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  // Shared select shape — mirrors LEAGUE_SELECT in the service
  const EXPECTED_SELECT = {
    id: true,
    name: true,
    phone: true,
    email: true,
    address: true,
    president: {
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        code: true,
      },
    },
    region: {
      select: {
        id: true,
        name: true,
        code: true,
      },
    },
    committees: {
      select: {
        _count: { select: { clubs: true } },
      },
    },
  };

  const mockLeagueData = (overrides = {}) => ({
    phone: null,
    email: null,
    address: null,
    president: null,
    committees: [],
    ...overrides,
  });

  describe("findAllLeagues", () => {
    it("should return all leagues with their region", async () => {
      // Arrange
      const mockLeagues = [
        mockLeagueData({
          id: 1,
          name: "LIGUE REGIONALE AUVERGNE-RHONE-ALPES DE BASKET-BALL",
          region: { id: 1, name: "Auvergne-Rhône-Alpes", code: "ARA" },
        }),
        mockLeagueData({
          id: 2,
          name: "LIGUE REGIONALE BOURGOGNE-FRANCHE-COMTE DE BASKET-BALL",
          region: { id: 2, name: "Bourgogne-Franche-Comté", code: "BFC" },
        }),
        mockLeagueData({
          id: 3,
          name: "LIGUE REGIONALE BRETAGNE DE BASKET-BALL",
          region: { id: 3, name: "Bretagne", code: "BRE" },
        }),
      ];

      mockPrismaService.client.leagues.findMany.mockResolvedValue(mockLeagues);

      // Act
      const result = await service.findAllLeagues();

      // Assert
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe(
        "LIGUE REGIONALE AUVERGNE-RHONE-ALPES DE BASKET-BALL",
      );
      expect(result[0].clubCount).toBe(0);
      expect(result[0].region).toEqual({
        id: 1,
        name: "Auvergne-Rhône-Alpes",
        code: "ARA",
      });
      expect(result).toHaveLength(3);

      expect(mockPrismaService.client.leagues.findMany).toHaveBeenCalledWith({
        select: EXPECTED_SELECT,
        orderBy: { name: "asc" },
      });
    });

    it("should return empty array when no leagues exist", async () => {
      // Arrange
      mockPrismaService.client.leagues.findMany.mockResolvedValue([]);

      // Act
      const result = await service.findAllLeagues();

      // Assert
      expect(result).toEqual([]);
    });

    it("should propagate database errors", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockPrismaService.client.leagues.findMany.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findAllLeagues()).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  describe("findLeagueById", () => {
    it("should return league with region when found", async () => {
      // Arrange
      const mockLeague = mockLeagueData({
        id: 1,
        name: "LIGUE REGIONALE BRETAGNE DE BASKET-BALL",
        region: { id: 3, name: "Bretagne", code: "BRE" },
        committees: [{ _count: { clubs: 10 } }, { _count: { clubs: 5 } }],
      });

      mockPrismaService.client.leagues.findUnique.mockResolvedValue(mockLeague);

      // Act
      const result = await service.findLeagueById(1);

      // Assert
      expect(result.id).toBe(1);
      expect(result.name).toBe("LIGUE REGIONALE BRETAGNE DE BASKET-BALL");
      expect(result.clubCount).toBe(15);
      expect(result.region).toEqual({ id: 3, name: "Bretagne", code: "BRE" });

      expect(mockPrismaService.client.leagues.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: EXPECTED_SELECT,
      });
    });

    it("should throw NotFoundException when league not found", async () => {
      // Arrange
      mockPrismaService.client.leagues.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findLeagueById(999)).rejects.toThrow(
        NotFoundException,
      );

      await expect(service.findLeagueById(999)).rejects.toThrow(
        "League with ID 999 not found",
      );
    });
  });
});
