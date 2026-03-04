// src/backend/modules/players/players.service.spec.ts
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { PrismaService } from "prisma/prisma.service";

import { PlayersService } from "./players.service";

/**
 * Unit tests for PlayersService.
 *
 * Tests cover:
 * - Happy path scenarios
 * - Error handling
 * - Edge cases (pagination, filters)
 * - Data transformation
 */
describe("PlayersService", () => {
  let service: PlayersService;
  let prismaService: PrismaService;

  // Mock Prisma service
  const mockPrismaService = {
    players: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    playerMatchStats: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PlayersService>(PlayersService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe("findAllPlayers", () => {
    it("should return paginated players with metadata", async () => {
      // Arrange
      const mockPlayers = [
        {
          id: 1,
          name: "Player 1",
          number: 10,
          teamId: 1,
          team: {
            id: 1,
            number: 1,
            clubId: 1,
            category: "U18",
            gender: "M",
            club: {
              id: 1,
              name: "Club 1",
              committee: {
                id: 1,
                name: "Committee 1",
                league: {
                  id: 1,
                  name: "League 1",
                },
              },
            },
            pool: null,
          },
        },
      ];

      mockPrismaService.players.findMany.mockResolvedValueOnce(mockPlayers);
      mockPrismaService.players.count.mockResolvedValue(1);

      // Act
      const result = await service.findAllPlayers({ page: 1, limit: 50 });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
      expect(result.totalPages).toBe(1);
    });

    it("should handle pagination correctly", async () => {
      // Arrange
      mockPrismaService.players.findMany.mockResolvedValueOnce([]);
      mockPrismaService.players.count.mockResolvedValue(150);

      // Act
      const result = await service.findAllPlayers({ page: 2, limit: 20 });

      // Assert
      expect(result.total).toBe(150);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(8);

      expect(mockPrismaService.players.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20, // (page 2 - 1) * 20
          take: 20,
        }),
      );
    });

    it("should validate and cap limit at 100", async () => {
      // Arrange
      mockPrismaService.players.findMany.mockResolvedValueOnce([]);
      mockPrismaService.players.count.mockResolvedValue(0);

      // Act
      await service.findAllPlayers({ limit: 200 });

      // Assert
      expect(mockPrismaService.players.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100, // Capped at 100
        }),
      );
    });

    it("should default to page 1 if invalid page provided", async () => {
      // Arrange
      mockPrismaService.players.findMany.mockResolvedValueOnce([]);
      mockPrismaService.players.count.mockResolvedValue(0);

      // Act
      await service.findAllPlayers({ page: -1 });

      // Assert
      expect(mockPrismaService.players.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0, // Page 1
        }),
      );
    });

    it("should propagate database errors", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockPrismaService.players.findMany.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findAllPlayers()).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  describe("findPlayerById", () => {
    it("should return player when found", async () => {
      // Arrange
      const mockPlayer = {
        id: 1,
        name: "Player 1",
        number: 10,
        teamId: 1,
        team: {
          id: 1,
          number: 1,
          clubId: 1,
          category: "U18",
          gender: "M",
          club: {
            id: 1,
            name: "Club 1",
            committee: {
              id: 1,
              name: "Committee 1",
              league: {
                id: 1,
                name: "League 1",
              },
            },
          },
          pool: null,
        },
      };

      mockPrismaService.players.findUnique.mockResolvedValue(mockPlayer);

      // Act
      const result = await service.findPlayerById(1);

      // Assert
      expect(result).toEqual(mockPlayer);
      expect(mockPrismaService.players.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.any(Object),
      });
    });

    it("should throw NotFoundException when player not found", async () => {
      // Arrange
      mockPrismaService.players.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findPlayerById(999)).rejects.toThrow(
        NotFoundException,
      );

      await expect(service.findPlayerById(999)).rejects.toThrow(
        "Player with ID 999 not found",
      );
    });
  });

  describe("findPlayerMatchHistory", () => {
    it("should return match history for a player", async () => {
      // Arrange
      const mockStats = [
        {
          match: {
            id: 1,
            date: new Date("2024-02-05"),
            homeTeam: { id: 1, number: 1, club: { id: 1, name: "Club A" } },
            awayTeam: { id: 2, number: 1, club: { id: 2, name: "Club B" } },
            homeTeamScore: 85,
            awayTeamScore: 72,
          },
          player: { id: 1, name: "Player 1", number: 10, teamId: 1 },
          points: 15,
          fouls: 2,
          threePointsMade: 2,
          threePointsAttempted: 5,
          twoPointsIntMade: 3,
          twoPointsIntAttempted: 6,
          twoPointsExtMade: 1,
          twoPointsExtAttempted: 3,
          freeThrowsMade: 4,
          freeThrowsAttempted: 5,
          assists: 7,
          turnovers: 3,
          reboundsOffensive: 3,
          reboundsDefensive: 5,
          steals: 2,
          blocks: 1,
          playtimeIntervals: [[0, 600]],
        },
      ];

      mockPrismaService.players.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.playerMatchStats.findMany.mockResolvedValue(mockStats);

      // Act
      const result = await service.findPlayerMatchHistory(1);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].player.player.id).toBe(1);
      expect(result[0].player.stats.points).toBe(15);
      expect(result[0].player.stats.rebounds.total).toBe(8); // 3 + 5
      expect(result[0].player.stats.rebounds.offensive).toBe(3);
      expect(result[0].player.stats.rebounds.defensive).toBe(5);
    });

    it("should return empty array when no matches found", async () => {
      // Arrange
      mockPrismaService.players.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.playerMatchStats.findMany.mockResolvedValue([]);

      // Act
      const result = await service.findPlayerMatchHistory(1);

      // Assert
      expect(result).toEqual([]);
    });

    it("should throw NotFoundException when player not found", async () => {
      // Arrange
      mockPrismaService.players.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findPlayerMatchHistory(999)).rejects.toThrow(
        NotFoundException,
      );

      await expect(service.findPlayerMatchHistory(999)).rejects.toThrow(
        "Player with ID 999 not found",
      );
    });
  });
});
