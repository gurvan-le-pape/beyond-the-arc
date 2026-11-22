// src/backend/modules/organizations/clubs/clubs.service.spec.ts
/**
 * clubs.service.spec.ts
 * Unit tests for ClubsService.
 *
 * Tests business logic and error handling for all public methods.
 * Mocks PrismaService to isolate service logic.
 */

import { CompetitionLevel } from "@common/constants";
import { NotFoundException } from "@nestjs/common";
import type { PrismaService } from "prisma/prisma.service";

import { ClubsService } from "./clubs.service";

type MockedPrismaService = {
  client: {
    clubs: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      groupBy: jest.Mock;
      count: jest.Mock;
    };
    committees: {
      findMany: jest.Mock;
    };
    leagues: {
      findMany: jest.Mock;
    };
    teams: {
      findMany: jest.Mock;
    };
    matches: {
      findMany: jest.Mock;
    };
  };
};

describe("ClubsService", () => {
  let service: ClubsService;
  let prisma: MockedPrismaService;

  beforeEach(() => {
    prisma = {
      client: {
        clubs: {
          findMany: jest.fn(),
          findUnique: jest.fn(),
          groupBy: jest.fn(),
          count: jest.fn(),
        },
        committees: {
          findMany: jest.fn(),
        },
        leagues: {
          findMany: jest.fn(),
        },
        teams: {
          findMany: jest.fn(),
        },
        matches: {
          findMany: jest.fn(),
        },
      },
    };

    service = new ClubsService(prisma as unknown as PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // getClubCountsByRegion
  // ============================================================================
  // ============================================================================
  // getClubCountsByDepartment
  // ============================================================================
  // ============================================================================
  // findClubsByFilters
  // ============================================================================
  describe("findClubsByFilters", () => {
    const mockClub = {
      id: 1,
      name: "AS Monaco Basket",
      city: "Monaco",
      zipCode: "98000",
      latitude: { toNumber: () => 43.7384 } as any,
      longitude: { toNumber: () => 7.4246 } as any,
      committeeId: 1,
      committee: { leagueId: 5 },
    };

    beforeEach(() => {
      // findClubsByFilters now runs Promise.all([findMany, count])
      prisma.client.clubs.findMany.mockResolvedValue([mockClub]);
      prisma.client.clubs.count.mockResolvedValue(1);
    });

    it("should return paginated response when no filters provided", async () => {
      const result = await service.findClubsByFilters({});

      expect(result).toEqual({
        items: [
          {
            id: 1,
            name: "AS Monaco Basket",
            city: "Monaco",
            zipCode: "98000",
            latitude: 43.7384,
            longitude: 7.4246,
            committeeId: 1,
            leagueId: 5,
          },
        ],
        total: 1,
        page: 1,
        limit: 50,
        totalPages: 1,
      });

      expect(prisma.client.clubs.findMany).toHaveBeenCalledWith({
        where: {},
        select: expect.any(Object),
        orderBy: [{ name: "asc" }, { id: "asc" }],
        skip: 0,
        take: 50,
      });
      expect(prisma.client.clubs.count).toHaveBeenCalledWith({ where: {} });
    });

    it("should filter by committeeId", async () => {
      await service.findClubsByFilters({ committeeId: 1 });

      expect(prisma.client.clubs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { committeeId: 1 } }),
      );
      expect(prisma.client.clubs.count).toHaveBeenCalledWith({
        where: { committeeId: 1 },
      });
    });

    it("should filter by leagueId via committee relation", async () => {
      await service.findClubsByFilters({ leagueId: 2 });

      expect(prisma.client.clubs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { committee: { leagueId: 2 } },
        }),
      );
    });

    it("should filter by level via teams", async () => {
      await service.findClubsByFilters({
        level: CompetitionLevel.DEPARTMENTAL,
      });

      expect(prisma.client.clubs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            teams: {
              some: {
                pool: {
                  championship: { level: CompetitionLevel.DEPARTMENTAL },
                },
              },
            },
          },
        }),
      );
    });

    it("should combine multiple filters", async () => {
      await service.findClubsByFilters({
        committeeId: 1,
        leagueId: 2,
        level: CompetitionLevel.DEPARTMENTAL,
      });

      expect(prisma.client.clubs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            committeeId: 1,
            committee: { leagueId: 2 },
            teams: {
              some: {
                pool: {
                  championship: { level: CompetitionLevel.DEPARTMENTAL },
                },
              },
            },
          },
        }),
      );
    });

    it("should respect custom page and limit", async () => {
      prisma.client.clubs.count.mockResolvedValue(200);

      await service.findClubsByFilters({ page: 3, limit: 20 });

      expect(prisma.client.clubs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 40, take: 20 }),
      );
    });

    it("should compute totalPages correctly", async () => {
      prisma.client.clubs.count.mockResolvedValue(105);

      const result = await service.findClubsByFilters({ limit: 50 });

      expect(result.totalPages).toBe(3); // ceil(105 / 50)
    });

    it("should return empty items when no clubs match", async () => {
      prisma.client.clubs.findMany.mockResolvedValue([]);
      prisma.client.clubs.count.mockResolvedValue(0);

      const result = await service.findClubsByFilters({
        level: CompetitionLevel.NATIONAL,
      });

      expect(result.items).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it("should handle null latitude and longitude", async () => {
      prisma.client.clubs.findMany.mockResolvedValue([
        { ...mockClub, latitude: null, longitude: null },
      ]);

      const result = await service.findClubsByFilters({});

      expect(result.items[0].latitude).toBeNull();
      expect(result.items[0].longitude).toBeNull();
    });

    it("should propagate database errors", async () => {
      const dbError = new Error("Database error");
      prisma.client.clubs.findMany.mockRejectedValue(dbError);

      await expect(
        service.findClubsByFilters({ committeeId: 1 }),
      ).rejects.toThrow(dbError);
    });
  });

  // ============================================================================
  // findClubById
  // ============================================================================
  describe("findClubById", () => {
    const mockPrismaClub = {
      id: 1,
      name: "AS Monaco Basket",
      city: "Monaco",
      zipCode: "98000",
      address: "1 Avenue des Papalins",
      code: "SUD0013011",
      committeeId: 13,
      teams: [
        {
          id: 1,
          number: 1,
          poolId: 10,
          pool: {
            id: 10,
            letter: "A",
            championship: {
              id: 1,
              category: "U18",
              gender: "male",
              level: "regional",
              division: 1,
            },
          },
        },
      ],
    };

    /** The teams of pool 10, as the standings query reads them. */
    const poolTeams = (...ids: number[]) =>
      ids.map((id) => ({ id, poolId: 10 }));

    /** A completed match of pool 10. */
    const poolMatch = (
      homeTeamId: number,
      awayTeamId: number,
      homeTeamScore: number,
      awayTeamScore: number,
    ) => ({
      homeTeam: { poolId: 10 },
      homeTeamId,
      awayTeamId,
      homeTeamScore,
      awayTeamScore,
      forfeit: false,
    });

    it("should rank the team within its pool and report the pool size", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue(mockPrismaClub);
      prisma.client.teams.findMany.mockResolvedValue(poolTeams(1, 2, 3, 4));
      prisma.client.matches.findMany.mockResolvedValue([
        poolMatch(2, 3, 90, 60),
        poolMatch(2, 4, 90, 60),
        poolMatch(1, 4, 80, 70),
        poolMatch(3, 1, 75, 70),
      ]);

      const result = await service.findClubById(1);

      expect(result).toMatchObject({
        id: 1,
        name: "AS Monaco Basket",
        committeeId: 13,
        ffbbUrl:
          "https://competitions.ffbb.com/ligues/sud/comites/0013/clubs/sud0013011",
      });
      // Behind team 2 on points, ahead of team 3 on point difference.
      expect(result.teams[0].leaderboard).toEqual({
        rank: 2,
        poolSize: 4,
        points: 3,
        gamesPlayed: 2,
        gamesWon: 1,
        gamesLost: 1,
        gamesForfeited: 0,
        pointDifference: 5,
        poolId: 10,
      });
    });

    it("should share a rank between tied teams, like the pool standings", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue(mockPrismaClub);
      prisma.client.teams.findMany.mockResolvedValue(poolTeams(1, 2, 3, 4));
      prisma.client.matches.findMany.mockResolvedValue([
        poolMatch(2, 3, 80, 70),
        poolMatch(1, 4, 80, 70),
      ]);

      const result = await service.findClubById(1);

      expect(result.teams[0].leaderboard?.rank).toBe(1);
    });

    it("should read every pool of the club in one query each", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue({
        ...mockPrismaClub,
        teams: [
          mockPrismaClub.teams[0],
          { ...mockPrismaClub.teams[0], id: 2, poolId: 11 },
          { ...mockPrismaClub.teams[0], id: 3, poolId: 10 },
        ],
      });
      prisma.client.teams.findMany.mockResolvedValue([
        { id: 1, poolId: 10 },
        { id: 2, poolId: 11 },
        { id: 3, poolId: 10 },
      ]);
      prisma.client.matches.findMany.mockResolvedValue([]);

      await service.findClubById(1);

      expect(prisma.client.teams.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.client.teams.findMany).toHaveBeenCalledWith({
        where: { poolId: { in: [10, 11] } },
        select: expect.any(Object),
      });
      expect(prisma.client.matches.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.client.matches.findMany).toHaveBeenCalledWith({
        where: { homeTeam: { poolId: { in: [10, 11] } }, status: "completed" },
        select: expect.any(Object),
      });
    });

    it("should keep only the club's teams and not count another pool's matches", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue(mockPrismaClub);
      prisma.client.teams.findMany.mockResolvedValue([
        { id: 1, poolId: 10 },
        { id: 2, poolId: 10 },
      ]);
      prisma.client.matches.findMany.mockResolvedValue([
        poolMatch(1, 2, 80, 70),
        { ...poolMatch(1, 2, 80, 70), homeTeam: { poolId: 11 } },
      ]);

      const result = await service.findClubById(1);

      expect(result.teams).toHaveLength(1);
      expect(result.teams[0].leaderboard?.gamesPlayed).toBe(1);
    });

    it("should handle club with no teams", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue({
        ...mockPrismaClub,
        teams: [],
      });

      const result = await service.findClubById(1);

      expect(result.teams).toHaveLength(0);
      expect(prisma.client.teams.findMany).not.toHaveBeenCalled();
    });

    it("should handle club with null fields", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue({
        ...mockPrismaClub,
        address: null,
        code: null,
        teams: [],
      });

      const result = await service.findClubById(1);

      expect(result.address).toBeNull();
      expect(result.ffbbUrl).toBeNull();
    });

    // Contact details are FFBB's to publish; they are not read at all, so
    // nothing downstream can return them by accident.
    it("neither selects nor returns contact details", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue({
        ...mockPrismaClub,
        teams: [],
      });

      const result = await service.findClubById(1);

      const { select } = prisma.client.clubs.findUnique.mock.calls[0][0];
      for (const field of ["phone", "email", "president"]) {
        expect(select).not.toHaveProperty(field);
        expect(result).not.toHaveProperty(field);
      }
    });

    it("should throw NotFoundException when club does not exist", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue(null);

      await expect(service.findClubById(999)).rejects.toThrow(
        new NotFoundException("Club with ID 999 not found"),
      );
    });

    it("should re-throw NotFoundException from inner calls", async () => {
      const notFoundError = new NotFoundException("Club not found");
      prisma.client.clubs.findUnique.mockRejectedValue(notFoundError);

      await expect(service.findClubById(1)).rejects.toThrow(NotFoundException);
    });

    it("should propagate database errors", async () => {
      const dbError = new Error("Database error");
      prisma.client.clubs.findUnique.mockRejectedValue(dbError);

      await expect(service.findClubById(1)).rejects.toThrow(dbError);
    });
  });
});
