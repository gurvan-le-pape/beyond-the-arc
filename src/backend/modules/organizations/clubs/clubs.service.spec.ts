// src/backend/modules/organizations/clubs/clubs.service.spec.ts
/**
 * clubs.service.spec.ts
 * Unit tests for ClubsService.
 *
 * Tests business logic and error handling for all public methods.
 * Mocks PrismaService to isolate service logic.
 */

import { Category } from "@common/constants/categories";
import { Gender } from "@common/constants/genders";
import {
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import type { PrismaService } from "prisma/prisma.service";

import { ClubsService } from "./clubs.service";

type MockedPrismaService = {
  clubs: {
    findMany: jest.Mock;
    findUnique: jest.Mock;
    groupBy: jest.Mock;
  };
  committees: {
    findMany: jest.Mock;
  };
  leagues: {
    findMany: jest.Mock;
  };
};

describe("ClubsService", () => {
  let service: ClubsService;
  let prisma: MockedPrismaService;

  beforeEach(() => {
    prisma = {
      clubs: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        groupBy: jest.fn(),
      },
      committees: {
        findMany: jest.fn(),
      },
      leagues: {
        findMany: jest.fn(),
      },
    };

    service = new ClubsService(prisma as unknown as PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getClubCountsByRegion", () => {
    it("should return club counts grouped by league", async () => {
      prisma.clubs.groupBy.mockResolvedValue([
        { committeeId: 1, _count: { id: 5 } },
        { committeeId: 2, _count: { id: 3 } },
        { committeeId: 3, _count: { id: 4 } },
      ]);

      prisma.committees.findMany.mockResolvedValue([
        { id: 1, leagueId: 10 },
        { id: 2, leagueId: 10 },
        { id: 3, leagueId: 20 },
      ]);

      prisma.leagues.findMany.mockResolvedValue([
        { id: 10, name: "League Auvergne-Rhône-Alpes", region: { code: "84" } },
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

      expect(prisma.clubs.groupBy).toHaveBeenCalledWith({
        by: ["committeeId"],
        _count: { id: true },
      });
    });

    it("should return zero count for leagues with no clubs", async () => {
      prisma.clubs.groupBy.mockResolvedValue([]);
      prisma.committees.findMany.mockResolvedValue([]);
      prisma.leagues.findMany.mockResolvedValue([
        { id: 10, name: "League Sans Clubs", region: { code: "99" } },
      ]);

      const result = await service.getClubCountsByRegion();

      expect(result).toEqual([
        {
          id: 10,
          code: "99",
          name: "League Sans Clubs",
          clubCount: 0,
        },
      ]);
    });

    it("should handle leagues without region codes", async () => {
      prisma.clubs.groupBy.mockResolvedValue([
        { committeeId: 1, _count: { id: 5 } },
      ]);
      prisma.committees.findMany.mockResolvedValue([{ id: 1, leagueId: 10 }]);
      prisma.leagues.findMany.mockResolvedValue([
        { id: 10, name: "League X", region: null },
      ]);

      const result = await service.getClubCountsByRegion();

      expect(result).toEqual([
        {
          id: 10,
          code: null,
          name: "League X",
          clubCount: 5,
        },
      ]);
    });

    it("should ignore committees with null leagueId", async () => {
      prisma.clubs.groupBy.mockResolvedValue([
        { committeeId: 1, _count: { id: 5 } },
        { committeeId: 2, _count: { id: 3 } },
      ]);
      prisma.committees.findMany.mockResolvedValue([
        { id: 1, leagueId: 10 },
        { id: 2, leagueId: null },
      ]);
      prisma.leagues.findMany.mockResolvedValue([
        { id: 10, name: "League X", region: { code: "01" } },
      ]);

      const result = await service.getClubCountsByRegion();

      expect(result[0].clubCount).toBe(5);
    });

    it("should throw InternalServerErrorException on database error", async () => {
      prisma.clubs.groupBy.mockRejectedValue(new Error("Database error"));

      await expect(service.getClubCountsByRegion()).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.getClubCountsByRegion()).rejects.toThrow(
        "Failed to fetch club statistics by region",
      );
    });
  });

  describe("getClubCountsByDepartment", () => {
    it("should return club counts by department for all leagues", async () => {
      prisma.committees.findMany.mockResolvedValue([
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

      expect(prisma.committees.findMany).toHaveBeenCalledWith({
        where: {},
        select: expect.any(Object),
        orderBy: { name: "asc" },
      });
    });

    it("should filter by leagueId when provided", async () => {
      prisma.committees.findMany.mockResolvedValue([
        {
          id: 1,
          name: "Comité de l'Ain",
          department: { id: 1, name: "Ain", code: "01" },
          leagueId: 10,
          _count: { clubs: 15 },
        },
      ]);

      await service.getClubCountsByDepartment(10);

      expect(prisma.committees.findMany).toHaveBeenCalledWith({
        where: { leagueId: 10 },
        select: expect.any(Object),
        orderBy: { name: "asc" },
      });
    });

    it("should return empty array when no committees found", async () => {
      prisma.committees.findMany.mockResolvedValue([]);

      const result = await service.getClubCountsByDepartment();

      expect(result).toEqual([]);
    });

    it("should handle committees with zero clubs", async () => {
      prisma.committees.findMany.mockResolvedValue([
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

    it("should throw InternalServerErrorException on database error", async () => {
      prisma.committees.findMany.mockRejectedValue(new Error("Database error"));

      await expect(service.getClubCountsByDepartment()).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.getClubCountsByDepartment()).rejects.toThrow(
        "Failed to fetch club statistics by department",
      );
    });
  });

  describe("findClubsByFilters", () => {
    const mockClub = {
      id: 1,
      name: "AS Monaco Basket",
      city: "Monaco",
      zipCode: "98000",
      latitude: { toNumber: () => 43.7384 } as any,
      longitude: { toNumber: () => 7.4246 } as any,
      email: "contact@monaco.com",
      phone: "0123456789",
      website: "https://monaco.com",
      committeeId: 1,
      committee: { leagueId: 5 },
    };

    it("should return all clubs when no filters provided", async () => {
      prisma.clubs.findMany.mockResolvedValue([mockClub]);

      const result = await service.findClubsByFilters({});

      expect(result).toEqual([
        {
          id: 1,
          name: "AS Monaco Basket",
          city: "Monaco",
          zipCode: "98000",
          latitude: 43.7384,
          longitude: 7.4246,
          email: "contact@monaco.com",
          phone: "0123456789",
          website: "https://monaco.com",
          committeeId: 1,
          leagueId: 5,
        },
      ]);
      expect(prisma.clubs.findMany).toHaveBeenCalledWith({
        where: {},
        select: expect.any(Object),
        orderBy: { name: "asc" },
      });
    });

    it("should filter by committeeId", async () => {
      prisma.clubs.findMany.mockResolvedValue([mockClub]);

      await service.findClubsByFilters({ committeeId: 1 });

      expect(prisma.clubs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { committeeId: 1 },
        }),
      );
    });

    it("should filter by leagueId via committee relation", async () => {
      prisma.clubs.findMany.mockResolvedValue([mockClub]);

      await service.findClubsByFilters({ leagueId: 2 });

      expect(prisma.clubs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { committee: { leagueId: 2 } },
        }),
      );
    });

    it("should filter by category via teams", async () => {
      const clubWithTeams = { ...mockClub, teams: [{ id: 1 }] };
      prisma.clubs.findMany.mockResolvedValue([clubWithTeams]);

      await service.findClubsByFilters({ category: Category.U18 });

      expect(prisma.clubs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({
            teams: {
              where: { category: Category.U18 },
              select: { id: true },
            },
          }),
        }),
      );
    });

    it("should filter by gender via teams", async () => {
      const clubWithTeams = { ...mockClub, teams: [{ id: 1 }] };
      prisma.clubs.findMany.mockResolvedValue([clubWithTeams]);

      await service.findClubsByFilters({ gender: Gender.FEMALE });

      expect(prisma.clubs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          select: expect.objectContaining({
            teams: {
              where: { gender: Gender.FEMALE },
              select: { id: true },
            },
          }),
        }),
      );
    });

    it("should combine multiple filters", async () => {
      prisma.clubs.findMany.mockResolvedValue([]);

      await service.findClubsByFilters({
        committeeId: 1,
        leagueId: 2,
        category: Category.U18,
        gender: Gender.MALE,
      });

      expect(prisma.clubs.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            committeeId: 1,
            committee: { leagueId: 2 },
          },
          select: expect.objectContaining({
            teams: {
              where: { category: Category.U18, gender: Gender.MALE },
              select: { id: true },
            },
          }),
        }),
      );
    });

    it("should return empty array when no clubs match", async () => {
      prisma.clubs.findMany.mockResolvedValue([]);

      const result = await service.findClubsByFilters({
        category: Category.U18,
      });

      expect(result).toEqual([]);
    });

    it("should throw InternalServerErrorException on database error", async () => {
      prisma.clubs.findMany.mockRejectedValue(new Error("Database error"));

      await expect(
        service.findClubsByFilters({ committeeId: 1 }),
      ).rejects.toThrow(InternalServerErrorException);
      await expect(
        service.findClubsByFilters({ committeeId: 1 }),
      ).rejects.toThrow("Failed to fetch clubs");
    });
  });

  describe("findClubById", () => {
    const mockClubDetailed = {
      id: 1,
      name: "AS Monaco Basket",
      city: "Monaco",
      zipCode: "98000",
      address: "1 Avenue des Papalins",
      phone: "0123456789",
      email: "contact@monaco.com",
      website: "https://monaco.com",
      teams: [
        {
          id: 1,
          number: 1,
          category: "U18",
          gender: "male",
          pool: {
            id: 1,
            name: "Pool A",
            championship: {
              id: 1,
              name: "Championship Régional U18",
              level: "regional",
              division: "Régionale 1",
              committeeId: null,
              leagueId: 1,
            },
            leaderboards: [
              { teamId: 1, points: 15 },
              { teamId: 2, points: 12 },
            ],
          },
          leaderboards: [
            {
              points: 15,
              gamesPlayed: 10,
              gamesWon: 7,
              gamesLost: 3,
              pointDifference: 25,
              poolId: 1,
            },
          ],
        },
      ],
    };

    it("should return club by id with nested teams", async () => {
      prisma.clubs.findUnique.mockResolvedValue(mockClubDetailed);

      const result = await service.findClubById(1);

      expect(result).toEqual(mockClubDetailed);
      expect(prisma.clubs.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.objectContaining({
          id: true,
          name: true,
          teams: expect.any(Object),
        }),
      });
    });

    it("should handle club with no teams", async () => {
      const clubNoTeams = { ...mockClubDetailed, teams: [] };
      prisma.clubs.findUnique.mockResolvedValue(clubNoTeams);

      const result = await service.findClubById(1);

      expect(result.teams).toEqual([]);
    });

    it("should handle team with null pool", async () => {
      const clubNullPool = {
        ...mockClubDetailed,
        teams: [{ ...mockClubDetailed.teams[0], pool: null }],
      };
      prisma.clubs.findUnique.mockResolvedValue(clubNullPool);

      const result = await service.findClubById(1);

      expect(result.teams[0].pool).toBeNull();
    });

    it("should throw NotFoundException when club not found", async () => {
      prisma.clubs.findUnique.mockResolvedValue(null);

      await expect(service.findClubById(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findClubById(999)).rejects.toThrow(
        "Club with ID 999 not found",
      );
    });

    it("should re-throw NotFoundException from database", async () => {
      const notFoundError = new NotFoundException("Club not found");
      prisma.clubs.findUnique.mockRejectedValue(notFoundError);

      await expect(service.findClubById(1)).rejects.toThrow(NotFoundException);
      await expect(service.findClubById(1)).rejects.toThrow("Club not found");
    });

    it("should wrap unknown errors in InternalServerErrorException", async () => {
      prisma.clubs.findUnique.mockRejectedValue(new Error("Database error"));

      await expect(service.findClubById(1)).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.findClubById(1)).rejects.toThrow(
        "Failed to fetch club",
      );
    });

    it("should handle club with null fields", async () => {
      const clubNullFields = {
        ...mockClubDetailed,
        address: null,
        phone: null,
        email: null,
        website: null,
      };
      prisma.clubs.findUnique.mockResolvedValue(clubNullFields);

      const result = await service.findClubById(1);

      expect(result.address).toBeNull();
      expect(result.phone).toBeNull();
      expect(result.email).toBeNull();
      expect(result.website).toBeNull();
    });

    it("should properly map complex nested structure", async () => {
      prisma.clubs.findUnique.mockResolvedValue(mockClubDetailed);

      const result = await service.findClubById(1);

      expect(result.teams[0]).toHaveProperty("id");
      expect(result.teams[0]).toHaveProperty("pool");
      expect(result.teams[0].pool).toHaveProperty("championship");
      expect(result.teams[0].pool).toHaveProperty("leaderboards");
      expect(result.teams[0]).toHaveProperty("leaderboards");
      expect(result.teams[0].pool?.championship.id).toBe(1);
      expect(result.teams[0].pool?.leaderboards).toHaveLength(2);
      expect(result.teams[0].leaderboards).toHaveLength(1);
    });
  });

  describe("mapToBasicDto", () => {
    it("should correctly map all fields including Decimal conversion", async () => {
      const mockClub = {
        id: 1,
        name: "Test Club",
        city: "Paris",
        zipCode: "75001",
        latitude: { toNumber: () => 48.8566 } as any,
        longitude: { toNumber: () => 2.3522 } as any,
        email: "test@club.com",
        phone: "0123456789",
        website: "https://club.com",
        committeeId: 1,
        committee: { leagueId: 1 },
      };

      prisma.clubs.findMany.mockResolvedValue([mockClub]);

      const result = await service.findClubsByFilters({});

      expect(result[0]).toEqual({
        id: 1,
        name: "Test Club",
        city: "Paris",
        zipCode: "75001",
        latitude: 48.8566,
        longitude: 2.3522,
        email: "test@club.com",
        phone: "0123456789",
        website: "https://club.com",
        committeeId: 1,
        leagueId: 1,
      });
    });

    it("should handle null values correctly", async () => {
      const mockClub = {
        id: 1,
        name: "Test Club",
        city: null,
        zipCode: null,
        latitude: null,
        longitude: null,
        email: null,
        phone: null,
        website: null,
        committeeId: null,
        committee: { leagueId: null },
      };

      prisma.clubs.findMany.mockResolvedValue([mockClub]);

      const result = await service.findClubsByFilters({});

      expect(result[0].city).toBeNull();
      expect(result[0].latitude).toBeNull();
      expect(result[0].longitude).toBeNull();
      expect(result[0].email).toBeNull();
      expect(result[0].website).toBeNull();
      expect(result[0].committeeId).toBeNull();
    });
  });

  describe("getAllDepartments", () => {
    it("should return all departments with region info", async () => {
      prisma.committees.findMany.mockResolvedValue([
        {
          id: 1,
          name: "Comité de l'Ain",
          department: { id: 1, name: "Ain", code: "01" },
          leagueId: 10,
          league: { id: 10, regionId: 5 },
          _count: { clubs: 15 },
        },
        {
          id: 2,
          name: "Comité du Rhône",
          department: { id: 2, name: "Rhône", code: "69" },
          leagueId: 10,
          league: { id: 10, regionId: 5 },
          _count: { clubs: 25 },
        },
      ]);

      const result = await service.getAllDepartments();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        name: "Comité de l'Ain",
        department: { id: 1, name: "Ain", code: "01" },
        leagueId: 10,
        region: { id: 5 },
        clubCount: 15,
      });
      expect(result[1].clubCount).toBe(25);
      expect(prisma.committees.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { name: "asc" } }),
      );
    });

    it("should return empty array when no departments found", async () => {
      prisma.committees.findMany.mockResolvedValue([]);

      const result = await service.getAllDepartments();

      expect(result).toEqual([]);
    });

    it("should throw InternalServerErrorException on database error", async () => {
      prisma.committees.findMany.mockRejectedValue(new Error("Database error"));

      await expect(service.getAllDepartments()).rejects.toThrow(
        InternalServerErrorException,
      );
      await expect(service.getAllDepartments()).rejects.toThrow(
        "Failed to fetch all departments",
      );
    });
  });

  describe("getClubCountsByRegion (edge cases)", () => {
    it("should skip entries where committeeId is null", async () => {
      prisma.clubs.groupBy.mockResolvedValue([
        { committeeId: null, _count: { id: 3 } },
        { committeeId: 1, _count: { id: 5 } },
      ]);
      prisma.committees.findMany.mockResolvedValue([{ id: 1, leagueId: 10 }]);
      prisma.leagues.findMany.mockResolvedValue([
        { id: 10, name: "League X", region: { code: "01" } },
      ]);

      const result = await service.getClubCountsByRegion();

      expect(result[0].clubCount).toBe(5);
    });
  });
});
