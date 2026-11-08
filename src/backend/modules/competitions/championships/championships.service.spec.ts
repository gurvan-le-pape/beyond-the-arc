// src/backend/modules/competitions/championships/championships.service.spec.ts
import { CompetitionLevel } from "@common/constants";
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";
import { PrismaService } from "prisma/prisma.service";

import { ChampionshipsService } from "./championships.service";

/**
 * Unit tests for ChampionshipsService.
 *
 * Tests cover:
 * - Happy path scenarios
 * - Error handling
 * - Edge cases
 * - Data transformation
 */
const ILLE_ET_VILAINE = {
  id: 5,
  name: "COMITE D'ILLE-ET-VILAINE DE BASKET-BALL",
  departmentName: "Ille-et-Vilaine",
  league: {
    id: 1,
    name: "LIGUE REGIONALE DE BRETAGNE DE BASKET-BALL",
    regionName: "Bretagne",
  },
};

describe("ChampionshipsService", () => {
  let service: ChampionshipsService;
  let prismaService: PrismaService;

  // Mock Prisma service
  const mockPrismaService = {
    client: {
      championships: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        ChampionshipsService,
        { provide: PrismaService, useValue: mockPrismaService },
        CacheDedupService,
      ],
    }).compile();

    service = module.get<ChampionshipsService>(ChampionshipsService);
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe("findChampionshipById", () => {
    it.each([
      [
        "a departmental championship names its committee and league",
        CompetitionLevel.DEPARTMENTAL,
        {
          leagueId: 1,
          committeeId: 5,
          leagueName: "LIGUE REGIONALE DE BRETAGNE DE BASKET-BALL",
          committeeName: "COMITE D'ILLE-ET-VILAINE DE BASKET-BALL",
          regionName: "Bretagne",
          departmentName: "Ille-et-Vilaine",
        },
      ],
      [
        "a regional championship names its league only",
        CompetitionLevel.REGIONAL,
        {
          leagueId: 1,
          committeeId: null,
          leagueName: "LIGUE REGIONALE DE BRETAGNE DE BASKET-BALL",
          committeeName: null,
          regionName: "Bretagne",
          departmentName: null,
        },
      ],
      [
        "a national championship has no organiser",
        CompetitionLevel.NATIONAL,
        {
          leagueId: null,
          committeeId: null,
          leagueName: null,
          committeeName: null,
          regionName: null,
          departmentName: null,
        },
      ],
    ])("%s", async (_name, level, organiser) => {
      mockPrismaService.client.championships.findUnique.mockResolvedValue({
        id: 1,
        category: "U18",
        gender: "male",
        seasonYear: "2024-2025",
        level,
        division: 1,
        pools: [
          {
            id: 1,
            letter: "A",
            teams: [{ club: { committee: ILLE_ET_VILAINE }, homeMatches: [] }],
          },
        ],
      });

      await expect(service.findChampionshipById(1)).resolves.toMatchObject(
        organiser,
      );
    });

    it("has no organiser when no pool has a team yet", async () => {
      mockPrismaService.client.championships.findUnique.mockResolvedValue({
        id: 1,
        category: "U18",
        gender: "male",
        seasonYear: "2024-2025",
        level: CompetitionLevel.REGIONAL,
        division: 1,
        pools: [{ id: 1, letter: "A", teams: [] }],
      });

      await expect(service.findChampionshipById(1)).resolves.toMatchObject({
        leagueId: null,
        leagueName: null,
      });
    });

    it("should return championship when found", async () => {
      // Arrange — Prisma relation shape (input to mapToDto)
      const mockPrismaChampionship = {
        id: 1,
        category: "U18",
        gender: "male",
        seasonYear: "2024-2025",
        level: CompetitionLevel.REGIONAL,
        division: 1,
        pools: [
          {
            id: 1,
            letter: "A",
            teams: [
              {
                club: { committee: ILLE_ET_VILAINE },
                homeMatches: [{ matchday: 1 }, { matchday: 2 }],
              },
            ],
          },
        ],
      };

      mockPrismaService.client.championships.findUnique.mockResolvedValue(
        mockPrismaChampionship,
      );

      // Act
      const result = await service.findChampionshipById(1);

      // Assert — DTO shape (output of mapToDto)
      expect(result).toEqual({
        id: 1,
        category: "U18",
        gender: "male",
        seasonYear: "2024-2025",
        level: CompetitionLevel.REGIONAL,
        division: 1,
        leagueId: 1,
        committeeId: null,
        committeeName: null,
        leagueName: "LIGUE REGIONALE DE BRETAGNE DE BASKET-BALL",
        regionName: "Bretagne",
        departmentName: null,
        pools: [{ id: 1, letter: "A", nbMatchdays: 2 }],
      });

      expect(
        mockPrismaService.client.championships.findUnique,
      ).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.objectContaining({
          id: true,
          category: true,
          // The page's pool picker shows them in this order.
          pools: expect.objectContaining({ orderBy: { letter: "asc" } }),
        }),
      });
    });

    it("should throw NotFoundException when championship not found", async () => {
      // Arrange
      mockPrismaService.client.championships.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findChampionshipById(999)).rejects.toThrow(
        new NotFoundException("Championship with ID 999 not found"),
      );
    });
  });

  describe("findChampionships", () => {
    // Arrange — Prisma relation shape (input to mapToDto)
    const mockChampionship = {
      id: 1,
      category: "U18",
      gender: "male",
      seasonYear: "2024-2025",
      level: CompetitionLevel.REGIONAL,
      division: 1,
      pools: [],
    };

    it("should return paginated championships with no filters", async () => {
      mockPrismaService.client.championships.findMany.mockResolvedValue([
        mockChampionship,
      ]);
      mockPrismaService.client.championships.count.mockResolvedValue(1);

      const result = await service.findChampionships();

      expect(result).toEqual({
        items: expect.arrayContaining([
          expect.objectContaining({ id: 1, category: "U18" }),
        ]),
        total: 1,
        page: 1,
        limit: 50,
        totalPages: 1,
      });

      expect(
        mockPrismaService.client.championships.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
          skip: 0,
          take: 50,
        }),
      );
    });

    it("should filter by regional level and leagueId", async () => {
      mockPrismaService.client.championships.findMany.mockResolvedValue([
        mockChampionship,
      ]);
      mockPrismaService.client.championships.count.mockResolvedValue(1);

      // Act
      await service.findChampionships({
        level: CompetitionLevel.REGIONAL,
        leagueId: 1,
      });
      // Assert
      expect(
        mockPrismaService.client.championships.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [
              { level: CompetitionLevel.REGIONAL },
              { level: { not: CompetitionLevel.NATIONAL } },
              {
                pools: {
                  some: {
                    teams: {
                      some: { club: { committee: { leagueId: 1 } } },
                    },
                  },
                },
              },
            ],
          },
        }),
      );
    });

    it("should filter by departmental level and committeeId", async () => {
      // Arrange
      mockPrismaService.client.championships.findMany.mockResolvedValue([]);
      mockPrismaService.client.championships.count.mockResolvedValue(1);

      // Act
      await service.findChampionships({
        level: CompetitionLevel.DEPARTMENTAL,
        committeeId: 5,
      });

      // Assert
      expect(
        mockPrismaService.client.championships.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            AND: [
              { level: CompetitionLevel.DEPARTMENTAL },
              { level: CompetitionLevel.DEPARTMENTAL },
              {
                pools: {
                  some: { teams: { some: { club: { committeeId: 5 } } } },
                },
              },
            ],
          },
        }),
      );
    });

    it("should filter by category and gender", async () => {
      mockPrismaService.client.championships.findMany.mockResolvedValue([]);
      mockPrismaService.client.championships.count.mockResolvedValue(0);

      await service.findChampionships({
        category: "U18" as any,
        gender: "male" as any,
      });

      expect(
        mockPrismaService.client.championships.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: "U18",
            gender: "male",
          }),
        }),
      );
    });

    it("should return empty paginated response when no results", async () => {
      mockPrismaService.client.championships.findMany.mockResolvedValue([]);
      mockPrismaService.client.championships.count.mockResolvedValue(0);

      const result = await service.findChampionships({
        level: CompetitionLevel.REGIONAL,
        leagueId: 999,
      });

      expect(result).toEqual({
        items: [],
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
      });
    });

    it("should filter by an organiser without needing a level", async () => {
      mockPrismaService.client.championships.findMany.mockResolvedValue([]);
      mockPrismaService.client.championships.count.mockResolvedValue(0);

      await service.findChampionships({ committeeId: 5 });

      expect(
        mockPrismaService.client.championships.findMany.mock.calls[0][0].where,
      ).toEqual({
        AND: [
          { level: CompetitionLevel.DEPARTMENTAL },
          {
            pools: {
              some: { teams: { some: { club: { committeeId: 5 } } } },
            },
          },
        ],
      });
    });

    it("should apply pagination correctly", async () => {
      mockPrismaService.client.championships.findMany.mockResolvedValue([]);
      mockPrismaService.client.championships.count.mockResolvedValue(100);

      const result = await service.findChampionships({ page: 3, limit: 10 });

      expect(result.page).toBe(3);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(10);

      expect(
        mockPrismaService.client.championships.findMany,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: [{ division: "asc" }, { category: "asc" }, { id: "asc" }],
          skip: 20,
          take: 10,
        }),
      );
    });
  });
});
