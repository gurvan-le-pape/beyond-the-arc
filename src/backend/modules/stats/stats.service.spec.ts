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
    client: {
      clubs: { count: jest.fn() },
      teams: { count: jest.fn() },
      players: { count: jest.fn() },
      matches: { count: jest.fn() },
      leagues: { count: jest.fn() },
      committees: { count: jest.fn() },
      championships: { count: jest.fn() },
    },
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
      mockPrismaService.client.clubs.count.mockResolvedValue(840);
      mockPrismaService.client.teams.count.mockResolvedValue(3200);
      mockPrismaService.client.players.count.mockResolvedValue(12400);
      mockPrismaService.client.matches.count.mockResolvedValue(48000);
      mockPrismaService.client.leagues.count.mockResolvedValue(26);
      mockPrismaService.client.committees.count.mockResolvedValue(95);
      mockPrismaService.client.championships.count
        .mockResolvedValueOnce(12)
        .mockResolvedValueOnce(84)
        .mockResolvedValueOnce(288);

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
        championshipsByLevel: { national: 12, regional: 84, departmental: 288 },
      });
    });

    it("should call all count queries", async () => {
      // Arrange
      mockPrismaService.client.clubs.count.mockResolvedValue(0);
      mockPrismaService.client.teams.count.mockResolvedValue(0);
      mockPrismaService.client.players.count.mockResolvedValue(0);
      mockPrismaService.client.matches.count.mockResolvedValue(0);
      mockPrismaService.client.leagues.count.mockResolvedValue(0);
      mockPrismaService.client.committees.count.mockResolvedValue(0);
      mockPrismaService.client.championships.count.mockResolvedValue(0);

      // Act
      await service.getStats();

      // Assert
      expect(mockPrismaService.client.clubs.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.client.teams.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.client.players.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.client.matches.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.client.leagues.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.client.committees.count).toHaveBeenCalledTimes(
        1,
      );
      expect(
        mockPrismaService.client.championships.count,
      ).toHaveBeenCalledTimes(3);
      expect(mockPrismaService.client.championships.count).toHaveBeenCalledWith(
        { where: { level: "national" } },
      );
      expect(mockPrismaService.client.championships.count).toHaveBeenCalledWith(
        { where: { level: "regional" } },
      );
      expect(mockPrismaService.client.championships.count).toHaveBeenCalledWith(
        { where: { level: "departmental" } },
      );
    });

    it("should return zeroed counts when platform has no data", async () => {
      // Arrange
      mockPrismaService.client.clubs.count.mockResolvedValue(0);
      mockPrismaService.client.teams.count.mockResolvedValue(0);
      mockPrismaService.client.players.count.mockResolvedValue(0);
      mockPrismaService.client.matches.count.mockResolvedValue(0);
      mockPrismaService.client.leagues.count.mockResolvedValue(0);
      mockPrismaService.client.committees.count.mockResolvedValue(0);
      mockPrismaService.client.championships.count.mockResolvedValue(0);

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
        championshipsByLevel: { national: 0, regional: 0, departmental: 0 },
      });
    });

    it("should propagate database errors", async () => {
      // Arrange
      mockPrismaService.client.clubs.count.mockRejectedValue(
        new Error("Database connection failed"),
      );
      mockPrismaService.client.teams.count.mockResolvedValue(0);
      mockPrismaService.client.players.count.mockResolvedValue(0);
      mockPrismaService.client.matches.count.mockResolvedValue(0);
      mockPrismaService.client.leagues.count.mockResolvedValue(0);
      mockPrismaService.client.committees.count.mockResolvedValue(0);
      mockPrismaService.client.championships.count.mockResolvedValue(0);

      // Act & Assert
      await expect(service.getStats()).rejects.toThrow(
        "Database connection failed",
      );
    });

    it("should run all queries in parallel via Promise.all", async () => {
      // The count assertions live in the test above; this one has to observe
      // *concurrency* or it proves nothing the other does not.
      //
      // Each mock records how many queries had started by the time it resumed
      // from its first await. Under Promise.all every call is issued before any
      // continuation runs, so every reading is 9. Serially the readings are
      // 1, 2, 3 … — so the minimum is the discriminator, and it needs no timers.
      const TOTAL_QUERIES = 9;
      let started = 0;
      const startedOnResume: number[] = [];

      const countingMock = () => async () => {
        started += 1;
        await Promise.resolve();
        startedOnResume.push(started);
        return 0;
      };

      mockPrismaService.client.clubs.count.mockImplementation(countingMock());
      mockPrismaService.client.teams.count.mockImplementation(countingMock());
      mockPrismaService.client.players.count.mockImplementation(countingMock());
      mockPrismaService.client.matches.count.mockImplementation(countingMock());
      mockPrismaService.client.leagues.count.mockImplementation(countingMock());
      mockPrismaService.client.committees.count.mockImplementation(
        countingMock(),
      );
      mockPrismaService.client.championships.count.mockImplementation(
        countingMock(),
      );

      await service.getStats();

      expect(startedOnResume).toHaveLength(TOTAL_QUERIES);
      expect(Math.min(...startedOnResume)).toBe(TOTAL_QUERIES);
    });
  });
});
