// src/backend/modules/stats/stats.service.spec.ts
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";
import { PrismaService } from "prisma/prisma.service";

import { StatsService } from "./stats.service";

/**
 * Unit tests for StatsService.
 *
 * Tests cover:
 * - Happy path scenarios
 * - Parallel query execution
 * - Error propagation
 */
describe("StatsService", () => {
  let service: StatsService;

  const mockPrismaService = {
    clubs: { count: jest.fn() },
    teams: { count: jest.fn() },
    players: { count: jest.fn() },
    matches: { count: jest.fn() },
    leagues: { count: jest.fn() },
    committees: { count: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        StatsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);

    jest.clearAllMocks();
  });

  describe("getStats", () => {
    it("should return all entity counts", async () => {
      // Arrange
      mockPrismaService.clubs.count.mockResolvedValue(840);
      mockPrismaService.teams.count.mockResolvedValue(3200);
      mockPrismaService.players.count.mockResolvedValue(12400);
      mockPrismaService.matches.count.mockResolvedValue(48000);
      mockPrismaService.leagues.count.mockResolvedValue(26);
      mockPrismaService.committees.count.mockResolvedValue(95);

      // Act
      const result = await service.getStats();

      // Assert
      expect(result).toEqual({
        clubs: 840,
        teams: 3200,
        players: 12400,
        matches: 48000,
        leagues: 26,
        committees: 95,
      });
    });

    it("should call all six count queries", async () => {
      // Arrange
      mockPrismaService.clubs.count.mockResolvedValue(0);
      mockPrismaService.teams.count.mockResolvedValue(0);
      mockPrismaService.players.count.mockResolvedValue(0);
      mockPrismaService.matches.count.mockResolvedValue(0);
      mockPrismaService.leagues.count.mockResolvedValue(0);
      mockPrismaService.committees.count.mockResolvedValue(0);

      // Act
      await service.getStats();

      // Assert
      expect(mockPrismaService.clubs.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.teams.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.players.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.matches.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.leagues.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.committees.count).toHaveBeenCalledTimes(1);
    });

    it("should return zeroed counts when platform has no data", async () => {
      // Arrange
      mockPrismaService.clubs.count.mockResolvedValue(0);
      mockPrismaService.teams.count.mockResolvedValue(0);
      mockPrismaService.players.count.mockResolvedValue(0);
      mockPrismaService.matches.count.mockResolvedValue(0);
      mockPrismaService.leagues.count.mockResolvedValue(0);
      mockPrismaService.committees.count.mockResolvedValue(0);

      // Act
      const result = await service.getStats();

      // Assert
      expect(result).toEqual({
        clubs: 0,
        teams: 0,
        players: 0,
        matches: 0,
        leagues: 0,
        committees: 0,
      });
    });

    it("should propagate database errors", async () => {
      // Arrange
      mockPrismaService.clubs.count.mockRejectedValue(
        new Error("Database connection failed"),
      );
      mockPrismaService.teams.count.mockResolvedValue(0);
      mockPrismaService.players.count.mockResolvedValue(0);
      mockPrismaService.matches.count.mockResolvedValue(0);
      mockPrismaService.leagues.count.mockResolvedValue(0);
      mockPrismaService.committees.count.mockResolvedValue(0);

      // Act & Assert
      await expect(service.getStats()).rejects.toThrow(
        "Database connection failed",
      );
    });

    it("should run all queries in parallel via Promise.all", async () => {
      // Arrange — track resolution order
      const order: string[] = [];

      mockPrismaService.clubs.count.mockImplementation(async () => {
        order.push("clubs");
        return 1;
      });
      mockPrismaService.teams.count.mockImplementation(async () => {
        order.push("teams");
        return 2;
      });
      mockPrismaService.players.count.mockImplementation(async () => {
        order.push("players");
        return 3;
      });
      mockPrismaService.matches.count.mockImplementation(async () => {
        order.push("matches");
        return 4;
      });
      mockPrismaService.leagues.count.mockImplementation(async () => {
        order.push("leagues");
        return 5;
      });
      mockPrismaService.committees.count.mockImplementation(async () => {
        order.push("committees");
        return 6;
      });

      // Act
      await service.getStats();

      // Assert — all six were called (order is non-deterministic in parallel)
      expect(order).toHaveLength(6);
      expect(order).toEqual(
        expect.arrayContaining([
          "clubs",
          "teams",
          "players",
          "matches",
          "leagues",
          "committees",
        ]),
      );
    });
  });
});
