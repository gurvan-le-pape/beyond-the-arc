// src/backend/modules/organizations/leagues/leagues.service.spec.ts
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
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
    leagues: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaguesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LeaguesService>(LeaguesService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe("findAllLeagues", () => {
    it("should return all leagues", async () => {
      // Arrange
      const mockLeagues = [
        { id: 1, name: "League Auvergne-Rhône-Alpes" },
        { id: 2, name: "League Bourgogne-Franche-Comté" },
        { id: 3, name: "League Bretagne" },
      ];

      mockPrismaService.leagues.findMany.mockResolvedValue(mockLeagues);

      // Act
      const result = await service.findAllLeagues();

      // Assert
      expect(result).toEqual([
        { id: 1, name: "League Auvergne-Rhône-Alpes" },
        { id: 2, name: "League Bourgogne-Franche-Comté" },
        { id: 3, name: "League Bretagne" },
      ]);

      expect(mockPrismaService.leagues.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
        },
        orderBy: { name: "asc" },
      });
    });

    it("should return empty array when no leagues exist", async () => {
      // Arrange
      mockPrismaService.leagues.findMany.mockResolvedValue([]);

      // Act
      const result = await service.findAllLeagues();

      // Assert
      expect(result).toEqual([]);
    });

    it("should propagate database errors", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockPrismaService.leagues.findMany.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findAllLeagues()).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  describe("findLeagueById", () => {
    it("should return league when found", async () => {
      // Arrange
      const mockLeague = {
        id: 1,
        name: "League Auvergne-Rhône-Alpes",
      };

      mockPrismaService.leagues.findUnique.mockResolvedValue(mockLeague);

      // Act
      const result = await service.findLeagueById(1);

      // Assert
      expect(result).toEqual(mockLeague);
      expect(mockPrismaService.leagues.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          name: true,
        },
      });
    });

    it("should throw NotFoundException when league not found", async () => {
      // Arrange
      mockPrismaService.leagues.findUnique.mockResolvedValue(null);

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
