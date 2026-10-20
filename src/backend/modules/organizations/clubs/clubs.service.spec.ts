// src/backend/modules/organizations/clubs/clubs.service.spec.ts
/**
 * clubs.service.spec.ts
 * Unit tests for ClubsService.
 *
 * Tests business logic and error handling for all public methods.
 * Mocks PrismaService to isolate service logic.
 */

import { Category, Gender } from "@common/constants";
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
    leaderboards: {
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
        leaderboards: {
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
  describe("getClubCountsByRegion", () => {
    it("should return club counts grouped by league", async () => {
      prisma.client.clubs.groupBy.mockResolvedValue([
        { committeeId: 1, _count: { id: 5 } },
        { committeeId: 2, _count: { id: 3 } },
        { committeeId: 3, _count: { id: 4 } },
      ]);

      prisma.client.committees.findMany.mockResolvedValue([
        { id: 1, leagueId: 10 },
        { id: 2, leagueId: 10 },
        { id: 3, leagueId: 20 },
      ]);

      prisma.client.leagues.findMany.mockResolvedValue([
        {
          id: 10,
          name: "League Auvergne-Rhône-Alpes",
          region: { code: "84" },
        },
        { id: 20, name: "League Île-de-France", region: { code: "11" } },
      ]);

      const result = await service.getClubCountsByRegion();

      expect(result).toEqual([
        {
          id: 10,
          code: "84",
          name: "League Auvergne-Rhône-Alpes",
          clubCount: 8, // 5 + 3
        },
        {
          id: 20,
          code: "11",
          name: "League Île-de-France",
          clubCount: 4,
        },
      ]);

      expect(prisma.client.clubs.groupBy).toHaveBeenCalledWith({
        by: ["committeeId"],
        _count: { id: true },
      });
    });

    it("should return zero count for leagues with no clubs", async () => {
      prisma.client.clubs.groupBy.mockResolvedValue([]);
      prisma.client.committees.findMany.mockResolvedValue([]);
      prisma.client.leagues.findMany.mockResolvedValue([
        { id: 10, name: "League Sans Clubs", region: { code: "99" } },
      ]);

      const result = await service.getClubCountsByRegion();

      expect(result).toEqual([
        { id: 10, code: "99", name: "League Sans Clubs", clubCount: 0 },
      ]);
    });

    it("should handle leagues without region codes", async () => {
      prisma.client.clubs.groupBy.mockResolvedValue([
        { committeeId: 1, _count: { id: 5 } },
      ]);
      prisma.client.committees.findMany.mockResolvedValue([
        { id: 1, leagueId: 10 },
      ]);
      prisma.client.leagues.findMany.mockResolvedValue([
        { id: 10, name: "League X", region: null },
      ]);

      const result = await service.getClubCountsByRegion();

      expect(result[0].code).toBeNull();
    });

    it("should ignore committees with null leagueId", async () => {
      prisma.client.clubs.groupBy.mockResolvedValue([
        { committeeId: 1, _count: { id: 5 } },
        { committeeId: 2, _count: { id: 3 } },
      ]);
      prisma.client.committees.findMany.mockResolvedValue([
        { id: 1, leagueId: 10 },
        { id: 2, leagueId: null },
      ]);
      prisma.client.leagues.findMany.mockResolvedValue([
        { id: 10, name: "League X", region: { code: "01" } },
      ]);

      const result = await service.getClubCountsByRegion();

      expect(result[0].clubCount).toBe(5);
    });

    it("should skip entries where committeeId is null", async () => {
      prisma.client.clubs.groupBy.mockResolvedValue([
        { committeeId: null, _count: { id: 3 } },
        { committeeId: 1, _count: { id: 5 } },
      ]);
      prisma.client.committees.findMany.mockResolvedValue([
        { id: 1, leagueId: 10 },
      ]);
      prisma.client.leagues.findMany.mockResolvedValue([
        { id: 10, name: "League X", region: { code: "01" } },
      ]);

      const result = await service.getClubCountsByRegion();

      expect(result[0].clubCount).toBe(5);
    });

    it("should propagate database errors", async () => {
      const dbError = new Error("Database error");
      prisma.client.clubs.groupBy.mockRejectedValue(dbError);

      await expect(service.getClubCountsByRegion()).rejects.toThrow(dbError);
    });
  });

  // ============================================================================
  // getClubCountsByDepartment
  // ============================================================================
  describe("getClubCountsByDepartment", () => {
    it("should return club counts by department for all leagues", async () => {
      prisma.client.committees.findMany.mockResolvedValue([
        {
          id: 1,
          name: "Comité de l'Ain",
          department: { id: 1, name: "Ain", code: "01" },
          leagueId: 10,
          _count: { clubs: 15 },
        },
        {
          id: 2,
          name: "Comité du Rhône",
          department: { id: 2, name: "Rhône", code: "69" },
          leagueId: 10,
          _count: { clubs: 25 },
        },
      ]);

      const result = await service.getClubCountsByDepartment();

      expect(result).toEqual([
        {
          id: 1,
          name: "Comité de l'Ain",
          department: { id: 1, name: "Ain", code: "01" },
          leagueId: 10,
          clubCount: 15,
        },
        {
          id: 2,
          name: "Comité du Rhône",
          department: { id: 2, name: "Rhône", code: "69" },
          leagueId: 10,
          clubCount: 25,
        },
      ]);

      expect(prisma.client.committees.findMany).toHaveBeenCalledWith({
        where: {},
        select: expect.any(Object),
        orderBy: { name: "asc" },
      });
    });

    it("should filter by leagueId when provided", async () => {
      prisma.client.committees.findMany.mockResolvedValue([
        {
          id: 1,
          name: "Comité de l'Ain",
          department: { id: 1, name: "Ain", code: "01" },
          leagueId: 10,
          _count: { clubs: 15 },
        },
      ]);

      await service.getClubCountsByDepartment(10);

      expect(prisma.client.committees.findMany).toHaveBeenCalledWith({
        where: { leagueId: 10 },
        select: expect.any(Object),
        orderBy: { name: "asc" },
      });
    });

    it("should return empty array when no committees found", async () => {
      prisma.client.committees.findMany.mockResolvedValue([]);

      const result = await service.getClubCountsByDepartment();

      expect(result).toEqual([]);
    });

    it("should handle committees with zero clubs", async () => {
      prisma.client.committees.findMany.mockResolvedValue([
        {
          id: 1,
          name: "Comité Vide",
          department: { id: 1, name: "Test", code: "00" },
          leagueId: 10,
          _count: { clubs: 0 },
        },
      ]);

      const result = await service.getClubCountsByDepartment();

      expect(result[0].clubCount).toBe(0);
    });

    it("should propagate database errors", async () => {
      const dbError = new Error("Database error");
      prisma.client.committees.findMany.mockRejectedValue(dbError);

      await expect(service.getClubCountsByDepartment()).rejects.toThrow(
        dbError,
      );
    });
  });

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
      website: "https://monaco.com",
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
            website: "https://monaco.com",
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

    it("should filter by category via teams", async () => {
      await service.findClubsByFilters({ category: Category.U18 });

      expect(prisma.client.clubs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { teams: { some: { category: Category.U18 } } },
        }),
      );
    });

    it("should filter by gender via teams", async () => {
      await service.findClubsByFilters({ gender: Gender.FEMALE });

      expect(prisma.client.clubs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { teams: { some: { gender: Gender.FEMALE } } },
        }),
      );
    });

    it("should combine multiple filters", async () => {
      await service.findClubsByFilters({
        committeeId: 1,
        leagueId: 2,
        category: Category.U18,
        gender: Gender.MALE,
      });

      expect(prisma.client.clubs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            committeeId: 1,
            committee: { leagueId: 2 },
            teams: { some: { category: Category.U18, gender: Gender.MALE } },
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
        category: Category.U18,
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
      website: "https://monaco.com",
      code: "SUD0013011",
      teams: [
        {
          id: 1,
          number: 1,
          category: "U18",
          gender: "male",
          poolId: 10,
          pool: {
            id: 10,
            name: "Pool A",
            letter: "A",
            championship: {
              id: 1,
              name: "Championship Régional U18",
              level: "regional",
              division: 1,
              committeeId: null,
              leagueId: 1,
            },
          },
        },
      ],
    };

    /** A standings row of pool 10, as STANDING_SELECT returns it. */
    const row = (teamId: number, points: number, pointDifference: number) => ({
      teamId,
      poolId: 10,
      points,
      gamesPlayed: 10,
      gamesWon: 7,
      gamesLost: 3,
      pointDifference,
    });

    it("should rank the team within its pool and report the pool size", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue(mockPrismaClub);
      prisma.client.leaderboards.findMany.mockResolvedValue([
        row(1, 15, 25),
        row(2, 17, 0),
        row(3, 15, 10),
        row(4, 12, 5),
      ]);

      const result = await service.findClubById(1);

      expect(result).toMatchObject({
        id: 1,
        name: "AS Monaco Basket",
        ffbbUrl:
          "https://competitions.ffbb.com/ligues/sud/comites/0013/clubs/sud0013011",
      });
      // Behind team 2 on points, ahead of team 3 on point difference.
      expect(result.teams[0].leaderboard).toEqual({
        rank: 2,
        poolSize: 4,
        points: 15,
        gamesPlayed: 10,
        gamesWon: 7,
        gamesLost: 3,
        pointDifference: 25,
        poolId: 10,
      });
    });

    it("should share a rank between tied teams, like the pool standings", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue(mockPrismaClub);
      prisma.client.leaderboards.findMany.mockResolvedValue([
        row(2, 15, 25),
        row(1, 15, 25),
        row(3, 9, 0),
      ]);

      const result = await service.findClubById(1);

      expect(result.teams[0].leaderboard?.rank).toBe(1);
    });

    it("should read every pool of the club in one query", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue({
        ...mockPrismaClub,
        teams: [
          mockPrismaClub.teams[0],
          { ...mockPrismaClub.teams[0], id: 2, poolId: 11 },
          { ...mockPrismaClub.teams[0], id: 3, poolId: 10 },
        ],
      });
      prisma.client.leaderboards.findMany.mockResolvedValue([]);

      await service.findClubById(1);

      expect(prisma.client.leaderboards.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.client.leaderboards.findMany).toHaveBeenCalledWith({
        where: { poolId: { in: [10, 11] } },
        select: expect.any(Object),
      });
    });

    it("should return null leaderboard when team has no standings row", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue(mockPrismaClub);
      prisma.client.leaderboards.findMany.mockResolvedValue([row(2, 15, 25)]);

      const result = await service.findClubById(1);

      expect(result.teams[0].leaderboard).toBeNull();
    });

    it("should return null leaderboard without querying when team has no pool", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue({
        ...mockPrismaClub,
        teams: [{ ...mockPrismaClub.teams[0], pool: null, poolId: null }],
      });

      const result = await service.findClubById(1);

      expect(result.teams[0].leaderboard).toBeNull();
      expect(prisma.client.leaderboards.findMany).not.toHaveBeenCalled();
    });

    it("should handle club with no teams", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue({
        ...mockPrismaClub,
        teams: [],
      });

      const result = await service.findClubById(1);

      expect(result.teams).toHaveLength(0);
      expect(prisma.client.leaderboards.findMany).not.toHaveBeenCalled();
    });

    it("should handle club with null fields", async () => {
      prisma.client.clubs.findUnique.mockResolvedValue({
        ...mockPrismaClub,
        address: null,
        website: null,
        code: null,
        teams: [],
      });

      const result = await service.findClubById(1);

      expect(result.address).toBeNull();
      expect(result.website).toBeNull();
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
