// src/backend/modules/competitions/leaderboards/leaderboards.service.spec.ts
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";
import { PrismaService } from "prisma/prisma.service";

import { LeaderboardsService } from "./leaderboards.service";

describe("LeaderboardsService", () => {
  let service: LeaderboardsService;
  let prisma: PrismaService;

  const mockPrismaLeaderboard = {
    id: 1,
    teamId: 5,
    poolId: 10,
    points: 12,
    gamesPlayed: 8,
    gamesWon: 6,
    gamesLost: 2,
    gamesForfeited: 0,
    pointsFor: 645,
    pointsAgainst: 580,
    pointDifference: 65,
    team: {
      number: 1,
      club: {
        name: "AS Monaco Basket",
      },
    },
  };

  const mockPrismaService = {
    client: {
      leaderboards: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
      },
      matches: {
        findMany: jest.fn().mockResolvedValue([]),
      },
    },
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        LeaderboardsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        CacheDedupService,
      ],
    }).compile();

    service = module.get<LeaderboardsService>(LeaderboardsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findLeaderboardsByPoolId", () => {
    it("should return leaderboards with correct rank for a valid pool ID", async () => {
      const poolId = 1;
      mockPrismaService.client.leaderboards.findMany.mockResolvedValue([
        mockPrismaLeaderboard,
        { ...mockPrismaLeaderboard, id: 2, teamId: 6, points: 8 },
      ]);

      const result = await service.findLeaderboardsByPoolId(poolId);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 1,
        teamId: 5,
        rank: 1,
        teamNumber: 1,
        clubName: "AS Monaco Basket",
        points: 12,
      });
      expect(result[1]).toMatchObject({
        id: 2,
        teamId: 6,
        rank: 2,
        points: 8,
      });
      expect(prisma.client.leaderboards.findMany).toHaveBeenCalledWith({
        where: { poolId },
        orderBy: [{ points: "desc" }, { pointDifference: "desc" }],
        select: expect.any(Object),
      });
    });

    it("should give tied entries the same rank and skip the next rank", async () => {
      mockPrismaService.client.leaderboards.findMany.mockResolvedValue([
        mockPrismaLeaderboard,
        { ...mockPrismaLeaderboard, id: 2, teamId: 6 },
        { ...mockPrismaLeaderboard, id: 3, teamId: 7, points: 8 },
      ]);

      const result = await service.findLeaderboardsByPoolId(1);

      expect(result.map((entry) => entry.rank)).toEqual([1, 1, 3]);
    });

    it("should give each entry its team's form from the pool's completed matches", async () => {
      mockPrismaService.client.leaderboards.findMany.mockResolvedValue([
        mockPrismaLeaderboard,
        { ...mockPrismaLeaderboard, id: 2, teamId: 6, points: 8 },
        { ...mockPrismaLeaderboard, id: 3, teamId: 7, points: 0 },
      ]);
      // Newest first: team 5 beat team 6, after losing to it.
      mockPrismaService.client.matches.findMany.mockResolvedValueOnce([
        {
          id: 2,
          homeTeamId: 5,
          awayTeamId: 6,
          homeTeamScore: 80,
          awayTeamScore: 70,
        },
        {
          id: 1,
          homeTeamId: 6,
          awayTeamId: 5,
          homeTeamScore: 75,
          awayTeamScore: 74,
        },
      ]);

      const result = await service.findLeaderboardsByPoolId(10);

      expect(result.map((entry) => entry.form)).toEqual([
        [
          { matchId: 1, result: "L" },
          { matchId: 2, result: "W" },
        ],
        [
          { matchId: 1, result: "W" },
          { matchId: 2, result: "L" },
        ],
        [],
      ]);
      expect(prisma.client.matches.findMany).toHaveBeenCalledWith({
        where: { poolId: 10, status: "completed" },
        select: expect.any(Object),
        orderBy: { startsAt: "desc" },
      });
    });

    it("should return an empty array when no leaderboards found", async () => {
      const poolId = 999;
      mockPrismaService.client.leaderboards.findMany.mockResolvedValue([]);

      await expect(service.findLeaderboardsByPoolId(poolId)).resolves.toEqual(
        [],
      );
    });

    it("should handle database errors", async () => {
      const poolId = 1;
      const dbError = new Error("Database connection failed");
      mockPrismaService.client.leaderboards.findMany.mockRejectedValue(dbError);

      await expect(service.findLeaderboardsByPoolId(poolId)).rejects.toThrow(
        dbError,
      );
    });
  });

  describe("findLeaderboardById", () => {
    it("should return a leaderboard entry with correct rank for a valid ID", async () => {
      const id = 1;
      // 2 teams ranked above this one → rank 3
      mockPrismaService.client.leaderboards.findUnique.mockResolvedValue(
        mockPrismaLeaderboard,
      );
      mockPrismaService.client.leaderboards.count.mockResolvedValue(2);

      const result = await service.findLeaderboardById(id);

      expect(result).toMatchObject({
        id: 1,
        teamId: 5,
        rank: 3,
        teamNumber: 1,
        clubName: "AS Monaco Basket",
      });
      expect(prisma.client.leaderboards.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: expect.any(Object),
      });
      expect(prisma.client.leaderboards.count).toHaveBeenCalledWith({
        where: {
          poolId: mockPrismaLeaderboard.poolId,
          OR: [
            { points: { gt: mockPrismaLeaderboard.points } },
            {
              points: mockPrismaLeaderboard.points,
              pointDifference: { gt: mockPrismaLeaderboard.pointDifference },
            },
          ],
        },
      });
    });

    it("should return rank 1 when no entries are ranked higher", async () => {
      const id = 1;
      mockPrismaService.client.leaderboards.findUnique.mockResolvedValue(
        mockPrismaLeaderboard,
      );
      mockPrismaService.client.leaderboards.count.mockResolvedValue(0);

      const result = await service.findLeaderboardById(id);

      expect(result.rank).toBe(1);
    });

    it("should throw NotFoundException for non-existent ID", async () => {
      const id = 999;
      mockPrismaService.client.leaderboards.findUnique.mockResolvedValue(null);

      await expect(service.findLeaderboardById(id)).rejects.toThrow(
        new NotFoundException("Leaderboard entry with ID 999 not found"),
      );
      expect(prisma.client.leaderboards.count).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      const id = 1;
      const dbError = new Error("Database connection failed");
      mockPrismaService.client.leaderboards.findUnique.mockRejectedValue(
        dbError,
      );

      await expect(service.findLeaderboardById(id)).rejects.toThrow(dbError);
    });
  });
});
