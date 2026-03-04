// src/backend/modules/competitions/leaderboards/leaderboards.service.spec.ts
// leaderboards.service.spec.ts
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { PrismaService } from "prisma/prisma.service";

import { LeaderboardsService } from "./leaderboards.service";

describe("LeaderboardsService", () => {
  let service: LeaderboardsService;
  let prisma: PrismaService;

  const mockPrismaLeaderboard = {
    id: 1,
    teamId: 5,
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
    leaderboards: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeaderboardsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LeaderboardsService>(LeaderboardsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("findLeaderboardsByPoolId", () => {
    it("should return leaderboards for a valid pool ID", async () => {
      const poolId = 1;
      mockPrismaService.leaderboards.findMany.mockResolvedValue([
        mockPrismaLeaderboard,
      ]);

      const result = await service.findLeaderboardsByPoolId(poolId);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 1,
        teamId: 5,
        teamNumber: 1,
        clubName: "AS Monaco Basket",
        points: 12,
      });
      expect(prisma.leaderboards.findMany).toHaveBeenCalledWith({
        where: { poolId },
        orderBy: [{ points: "desc" }, { pointDifference: "desc" }],
        select: expect.any(Object),
      });
    });

    it("should throw NotFoundException when no leaderboards found", async () => {
      const poolId = 999;
      mockPrismaService.leaderboards.findMany.mockResolvedValue([]);

      await expect(service.findLeaderboardsByPoolId(poolId)).rejects.toThrow(
        new NotFoundException("No leaderboard entries found for pool ID 999"),
      );
    });

    it("should handle database errors", async () => {
      const poolId = 1;
      const dbError = new Error("Database connection failed");
      mockPrismaService.leaderboards.findMany.mockRejectedValue(dbError);

      await expect(service.findLeaderboardsByPoolId(poolId)).rejects.toThrow(
        dbError,
      );
    });
  });

  describe("findLeaderboardById", () => {
    it("should return a leaderboard entry for a valid ID", async () => {
      const id = 1;
      mockPrismaService.leaderboards.findUnique.mockResolvedValue(
        mockPrismaLeaderboard,
      );

      const result = await service.findLeaderboardById(id);

      expect(result).toMatchObject({
        id: 1,
        teamId: 5,
        teamNumber: 1,
        clubName: "AS Monaco Basket",
      });
      expect(prisma.leaderboards.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: expect.any(Object),
      });
    });

    it("should throw NotFoundException for non-existent ID", async () => {
      const id = 999;
      mockPrismaService.leaderboards.findUnique.mockResolvedValue(null);

      await expect(service.findLeaderboardById(id)).rejects.toThrow(
        new NotFoundException("Leaderboard entry with ID 999 not found"),
      );
    });
  });
});
