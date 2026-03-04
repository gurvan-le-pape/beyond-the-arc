// src/backend/modules/competitions/championships/championships.service.spec.ts
import { CompetitionLevel } from "@common/constants/competition-levels";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
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
describe("ChampionshipsService", () => {
  let service: ChampionshipsService;
  let prismaService: PrismaService;

  // Mock Prisma service
  const mockPrismaService = {
    championships: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChampionshipsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ChampionshipsService>(ChampionshipsService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe("findAllDivisions", () => {
    it("should return all distinct divisions", async () => {
      // Arrange
      const mockDivisions = [{ division: 1 }, { division: 2 }, { division: 3 }];

      mockPrismaService.championships.findMany.mockResolvedValue(mockDivisions);

      // Act
      const result = await service.findAllDivisions();

      // Assert
      expect(result).toEqual([1, 2, 3]);

      expect(mockPrismaService.championships.findMany).toHaveBeenCalledWith({
        select: { division: true },
        distinct: ["division"],
        orderBy: { division: "asc" },
      });
    });

    it("should filter out null divisions", async () => {
      // Arrange
      const mockDivisions = [
        { division: 1 },
        { division: null },
        { division: 2 },
      ];

      mockPrismaService.championships.findMany.mockResolvedValue(mockDivisions);

      // Act
      const result = await service.findAllDivisions();

      // Assert
      expect(result).toHaveLength(2);
      expect(result).toEqual([1, 2]);
    });

    it("should return empty array when no divisions exist", async () => {
      // Arrange
      mockPrismaService.championships.findMany.mockResolvedValue([]);

      // Act
      const result = await service.findAllDivisions();

      // Assert
      expect(result).toEqual([]);
    });

    it("should propagate database errors", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockPrismaService.championships.findMany.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.findAllDivisions()).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  describe("findChampionshipById", () => {
    it("should return championship when found", async () => {
      // Arrange
      const mockChampionship = {
        id: 1,
        name: "Championship Régional U18",
        category: "U18",
        gender: "male",
        seasonYear: "2024-2025",
        level: CompetitionLevel.REGIONAL,
        division: 1,
      };

      mockPrismaService.championships.findUnique.mockResolvedValue(
        mockChampionship,
      );

      // Act
      const result = await service.findChampionshipById(1);

      // Assert
      expect(result).toEqual(mockChampionship);
      expect(mockPrismaService.championships.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          name: true,
          category: true,
          gender: true,
          seasonYear: true,
          level: true,
          division: true,
        },
      });
    });

    it("should throw NotFoundException when championship not found", async () => {
      // Arrange
      mockPrismaService.championships.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.findChampionshipById(999)).rejects.toThrow(
        NotFoundException,
      );

      await expect(service.findChampionshipById(999)).rejects.toThrow(
        "Championship with ID 999 not found",
      );
    });
  });

  describe("findChampionshipsByLevel", () => {
    describe("Regional level", () => {
      it("should return regional championships for given league", async () => {
        // Arrange
        const mockChampionships = [
          {
            id: 1,
            name: "Championship Régional U18",
            category: "U18",
            gender: "male",
            seasonYear: "2024-2025",
            level: CompetitionLevel.REGIONAL,
            division: 1,
          },
          {
            id: 2,
            name: "Championship Régional Senior",
            category: "Senior",
            gender: "female",
            seasonYear: "2024-2025",
            level: CompetitionLevel.REGIONAL,
            division: 2,
          },
        ];

        mockPrismaService.championships.findMany.mockResolvedValue(
          mockChampionships,
        );

        // Act
        const result = await service.findChampionshipsByLevel(
          CompetitionLevel.REGIONAL,
          1,
        );

        // Assert
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe("Championship Régional U18");

        expect(mockPrismaService.championships.findMany).toHaveBeenCalledWith({
          where: {
            leagueId: 1,
            level: CompetitionLevel.REGIONAL,
          },
          select: {
            id: true,
            name: true,
            category: true,
            gender: true,
            seasonYear: true,
            level: true,
            division: true,
          },
          orderBy: [{ division: "asc" }, { category: "asc" }],
        });
      });

      it("should throw NotFoundException when no regional championships found", async () => {
        // Arrange
        mockPrismaService.championships.findMany.mockResolvedValue([]);

        // Act & Assert
        await expect(
          service.findChampionshipsByLevel(CompetitionLevel.REGIONAL, 999),
        ).rejects.toThrow(NotFoundException);

        await expect(
          service.findChampionshipsByLevel(CompetitionLevel.REGIONAL, 999),
        ).rejects.toThrow("No regional championships found for league ID 999");
      });
    });

    describe("Departmental level", () => {
      it("should return departmental championships for given committee", async () => {
        // Arrange
        const mockChampionships = [
          {
            id: 1,
            name: "Championship Departmental U15",
            category: "U15",
            gender: "male",
            seasonYear: "2024-2025",
            level: CompetitionLevel.DEPARTMENTAL,
            division: 1,
          },
        ];

        mockPrismaService.championships.findMany.mockResolvedValue(
          mockChampionships,
        );

        // Act
        const result = await service.findChampionshipsByLevel(
          CompetitionLevel.DEPARTMENTAL,
          5,
        );

        // Assert
        expect(result).toHaveLength(1);
        expect(result[0].level).toBe(CompetitionLevel.DEPARTMENTAL);

        expect(mockPrismaService.championships.findMany).toHaveBeenCalledWith({
          where: {
            committeeId: 5,
            level: CompetitionLevel.DEPARTMENTAL,
          },
          select: {
            id: true,
            name: true,
            category: true,
            gender: true,
            seasonYear: true,
            level: true,
            division: true,
          },
          orderBy: [{ division: "asc" }, { category: "asc" }],
        });
      });

      it("should throw NotFoundException when no departmental championships found", async () => {
        // Arrange
        mockPrismaService.championships.findMany.mockResolvedValue([]);

        // Act & Assert
        await expect(
          service.findChampionshipsByLevel(CompetitionLevel.DEPARTMENTAL, 999),
        ).rejects.toThrow(NotFoundException);

        await expect(
          service.findChampionshipsByLevel(CompetitionLevel.DEPARTMENTAL, 999),
        ).rejects.toThrow(
          "No departmental championships found for committee ID 999",
        );
      });
    });

    describe("Business routing logic", () => {
      it("should route to regional championships when level is regional", async () => {
        // Arrange
        mockPrismaService.championships.findMany.mockResolvedValue([
          {
            id: 1,
            name: "Test Regional",
            category: "U18",
            gender: "male",
            seasonYear: "2024-2025",
            level: CompetitionLevel.REGIONAL,
            division: 1,
          },
        ]);

        // Act
        await service.findChampionshipsByLevel(CompetitionLevel.REGIONAL, 1);

        // Assert
        expect(mockPrismaService.championships.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              leagueId: 1,
              level: CompetitionLevel.REGIONAL,
            }),
          }),
        );
      });

      it("should route to departmental championships when level is departmental", async () => {
        // Arrange
        mockPrismaService.championships.findMany.mockResolvedValue([
          {
            id: 1,
            name: "Test Departmental",
            category: "U15",
            gender: "male",
            seasonYear: "2024-2025",
            level: CompetitionLevel.DEPARTMENTAL,
            division: 1,
          },
        ]);

        // Act
        await service.findChampionshipsByLevel(
          CompetitionLevel.DEPARTMENTAL,
          5,
        );

        // Assert
        expect(mockPrismaService.championships.findMany).toHaveBeenCalledWith(
          expect.objectContaining({
            where: expect.objectContaining({
              committeeId: 5,
              level: CompetitionLevel.DEPARTMENTAL,
            }),
          }),
        );
      });
    });
  });
});
