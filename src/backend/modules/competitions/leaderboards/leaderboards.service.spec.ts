// src/backend/modules/competitions/leaderboards/leaderboards.service.spec.ts
import type { PrismaService } from "prisma/prisma.service";

import { LeaderboardsService } from "./leaderboards.service";

describe("LeaderboardsService", () => {
  const team = (id: number, number = 1, name = "AS Monaco Basket") => ({
    id,
    number,
    club: { name },
  });
  const match = (
    id: number,
    homeTeamId: number,
    awayTeamId: number,
    homeTeamScore: number,
    awayTeamScore: number,
  ) => ({
    id,
    homeTeamId,
    awayTeamId,
    homeTeamScore,
    awayTeamScore,
    forfeit: false,
  });

  const prisma = {
    client: {
      teams: { findMany: jest.fn() },
      matches: { findMany: jest.fn() },
    },
  };
  const service = new LeaderboardsService(prisma as unknown as PrismaService);

  beforeEach(() => {
    prisma.client.teams.findMany.mockResolvedValue([]);
    prisma.client.matches.findMany.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("findLeaderboardsByPoolId", () => {
    it("reads the pool's teams and its completed matches, newest first", async () => {
      await service.findLeaderboardsByPoolId(10);

      expect(prisma.client.teams.findMany).toHaveBeenCalledWith({
        where: { poolId: 10 },
        select: expect.any(Object),
      });
      expect(prisma.client.matches.findMany).toHaveBeenCalledWith({
        where: { homeTeam: { poolId: 10 }, status: "completed" },
        select: expect.any(Object),
        orderBy: { startsAt: "desc" },
      });
    });

    it("ranks the teams and names each one", async () => {
      prisma.client.teams.findMany.mockResolvedValue([
        team(5, 2, "BCM Gravelines"),
        team(6, 1, "AS Monaco Basket"),
      ]);
      prisma.client.matches.findMany.mockResolvedValue([
        match(1, 6, 5, 80, 70),
      ]);

      const result = await service.findLeaderboardsByPoolId(10);

      expect(result).toMatchObject([
        {
          teamId: 6,
          rank: 1,
          teamNumber: 1,
          clubName: "AS Monaco Basket",
          points: 2,
        },
        {
          teamId: 5,
          rank: 2,
          teamNumber: 2,
          clubName: "BCM Gravelines",
          points: 1,
        },
      ]);
    });

    it("gives a team that has not played a row at the bottom", async () => {
      prisma.client.teams.findMany.mockResolvedValue([
        team(5),
        team(6),
        team(7),
      ]);
      prisma.client.matches.findMany.mockResolvedValue([
        match(1, 5, 6, 80, 70),
      ]);

      const result = await service.findLeaderboardsByPoolId(10);

      expect(result[2]).toMatchObject({
        teamId: 7,
        rank: 3,
        gamesPlayed: 0,
        points: 0,
        form: [],
      });
    });

    it("gives each team its form from the pool's completed matches", async () => {
      prisma.client.teams.findMany.mockResolvedValue([team(5), team(6)]);
      // Newest first: team 5 beat team 6, after losing to it.
      prisma.client.matches.findMany.mockResolvedValue([
        match(2, 5, 6, 80, 70),
        match(1, 6, 5, 75, 74),
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
      ]);
    });

    it("returns an empty array for a pool with no teams", async () => {
      await expect(service.findLeaderboardsByPoolId(999)).resolves.toEqual([]);
    });

    it("propagates database errors", async () => {
      const dbError = new Error("Database connection failed");
      prisma.client.teams.findMany.mockRejectedValue(dbError);

      await expect(service.findLeaderboardsByPoolId(1)).rejects.toThrow(
        dbError,
      );
    });
  });
});
