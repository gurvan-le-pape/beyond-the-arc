// src/backend/modules/teams/teams.service.spec.ts
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { PrismaService } from "prisma/prisma.service";

import { TeamsService } from "./teams.service";

describe("TeamsService", () => {
  let service: TeamsService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    teams: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    pools: {
      findMany: jest.fn(),
    },
    championships: {
      findMany: jest.fn(),
    },
    matches: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe("findAllTeams", () => {
    it("should return paginated teams with metadata", async () => {
      // Arrange
      const mockTeams = [
        {
          id: 1,
          number: 1,
          clubId: 1,
          category: "U18",
          gender: "M",
          color: "Blue",
          poolId: null,
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
          _count: { players: 12 },
        },
      ];

      mockPrismaService.teams.findMany.mockResolvedValueOnce(mockTeams);
      mockPrismaService.teams.count.mockResolvedValue(1);

      // Act
      const result = await service.findAllTeams({
        page: 1,
        limit: 50,
        clubId: 1,
      });

      // Assert
      expect(result.items).toHaveLength(1);
      expect(result.items[0].id).toBe(1);
      expect(result.items[0]._count.players).toBe(12);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
      expect(result.totalPages).toBe(1);
    });

    it("should handle pagination correctly", async () => {
      // Arrange
      mockPrismaService.teams.findMany.mockResolvedValueOnce([]);
      mockPrismaService.teams.count.mockResolvedValue(150);

      // Act
      const result = await service.findAllTeams({ page: 2, limit: 20 });

      // Assert
      expect(result.total).toBe(150);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(20);
      expect(result.totalPages).toBe(8);

      expect(mockPrismaService.teams.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 20,
          take: 20,
        }),
      );
    });

    it("should validate and cap limit at 100", async () => {
      // Arrange
      mockPrismaService.teams.findMany.mockResolvedValueOnce([]);
      mockPrismaService.teams.count.mockResolvedValue(0);

      // Act
      await service.findAllTeams({ limit: 200 });

      // Assert
      expect(mockPrismaService.teams.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100,
        }),
      );
    });

    it("should default to page 1 if invalid page provided", async () => {
      // Arrange
      mockPrismaService.teams.findMany.mockResolvedValueOnce([]);
      mockPrismaService.teams.count.mockResolvedValue(0);

      // Act
      await service.findAllTeams({ page: -1 });

      // Assert
      expect(mockPrismaService.teams.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
        }),
      );
    });

    it("should propagate database errors", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockPrismaService.teams.findMany.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findAllTeams()).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  describe("findTeamFilterValues", () => {
    it("should return available filter values", async () => {
      // Arrange
      mockPrismaService.teams.findMany.mockResolvedValueOnce([
        { number: 1 },
        { number: 2 },
      ]);
      mockPrismaService.pools.findMany.mockResolvedValueOnce([
        { letter: "A" },
        { letter: "B" },
      ]);
      mockPrismaService.championships.findMany.mockResolvedValueOnce([
        { division: "D1" },
        { division: null },
        { division: "D2" },
      ]);

      // Act
      const result = await service.findTeamFilterValues();

      // Assert
      expect(result.numbers).toEqual([1, 2]);
      expect(result.poolLetters).toEqual(["A", "B"]);
      expect(result.divisions).toEqual(["D1", "D2"]); // null filtered out
    });
  });

  describe("findTeamById", () => {
    it("should return team when found", async () => {
      // Arrange
      const mockTeam = {
        id: 1,
        number: 1,
        clubId: 1,
        category: "U18",
        gender: "M",
        color: "Blue",
        poolId: null,
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
        _count: { players: 12 },
        players: [],
        homeMatches: [],
        awayMatches: [],
      };

      mockPrismaService.teams.findUnique.mockResolvedValue(mockTeam);

      // Act
      const result = await service.findTeamById(1);

      // Assert
      expect(result.id).toBe(1);
      expect(result._count.players).toBe(12);
      expect(result.players).toEqual([]);
      expect(result.homeMatches).toEqual([]);
      expect(result.awayMatches).toEqual([]);
      expect(mockPrismaService.teams.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.any(Object),
      });
    });

    it("should throw NotFoundException when team not found", async () => {
      // Arrange
      mockPrismaService.teams.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findTeamById(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findTeamById(999)).rejects.toThrow(
        "Team with ID 999 not found",
      );
    });
  });

  describe("findTeamMatchHistory", () => {
    it("should return match history for a team", async () => {
      // Arrange
      const mockMatches = [
        {
          id: 1,
          date: new Date("2024-02-05"),
          homeTeam: { id: 1, number: 1, club: { id: 1, name: "Club A" } },
          awayTeam: { id: 2, number: 1, club: { id: 2, name: "Club B" } },
          homeTeamScore: 85,
          awayTeamScore: 72,
          playerMatchStats: [
            {
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
          ],
        },
      ];

      mockPrismaService.teams.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.matches.findMany.mockResolvedValue(mockMatches);

      // Act
      const result = await service.findTeamMatchHistory(1);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(result[0].players).toHaveLength(1);
      expect(result[0].players[0].player.id).toBe(1);
      expect(result[0].players[0].stats.points).toBe(15);
      expect(result[0].players[0].stats.rebounds.total).toBe(8);
      expect(result[0].players[0].stats.rebounds.offensive).toBe(3);
      expect(result[0].players[0].stats.rebounds.defensive).toBe(5);
    });

    it("should return empty array when no matches found", async () => {
      // Arrange
      mockPrismaService.teams.findUnique.mockResolvedValue({ id: 1 });
      mockPrismaService.matches.findMany.mockResolvedValue([]);

      // Act
      const result = await service.findTeamMatchHistory(1);

      // Assert
      expect(result).toEqual([]);
    });

    it("should throw NotFoundException when team not found", async () => {
      // Arrange
      mockPrismaService.teams.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findTeamMatchHistory(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findTeamMatchHistory(999)).rejects.toThrow(
        "Team with ID 999 not found",
      );
    });
  });
});
