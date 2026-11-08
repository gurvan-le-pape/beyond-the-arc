// src/backend/modules/organizations/committees/committees.service.spec.ts
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";
import { PrismaService } from "prisma/prisma.service";

import { CommitteesService } from "./committees.service";

describe("CommitteesService", () => {
  let service: CommitteesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    client: {
      committees: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
      },
      clubs: {
        findMany: jest.fn(),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      providers: [
        CommitteesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        CacheDedupService,
      ],
    }).compile();

    service = module.get<CommitteesService>(CommitteesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  const EXPECTED_SELECT = {
    id: true,
    name: true,
    address: true,
    leagueId: true,
    departmentCode: true,
    departmentName: true,
    _count: { select: { clubs: true } },
    clubs: {
      select: { code: true },
      where: { code: { not: null } },
      take: 1,
    },
  };

  const mockCommitteeData = (overrides = {}) => ({
    address: null,
    _count: { clubs: 0 },
    clubs: [],
    ...overrides,
  });

  describe("findAllCommittees", () => {
    it("should return all committees with department information", async () => {
      const mockCommittees = [
        mockCommitteeData({
          id: 1,
          name: "Comité Departmental de l'Ain",
          leagueId: 1,
          departmentName: "Ain",
          departmentCode: "01",
        }),
        mockCommitteeData({
          id: 2,
          name: "Comité Departmental de l'Aisne",
          leagueId: 1,
          departmentName: "Aisne",
          departmentCode: "02",
        }),
      ];

      mockPrismaService.client.committees.findMany.mockResolvedValue(
        mockCommittees,
      );

      const result = await service.findAllCommittees();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Comité Departmental de l'Ain");
      expect(result[0].department).toEqual({ name: "Ain", code: "01" });

      expect(mockPrismaService.client.committees.findMany).toHaveBeenCalledWith(
        {
          select: EXPECTED_SELECT,
          orderBy: [{ name: "asc" }],
        },
      );
    });

    it("should return empty array when no committees exist", async () => {
      mockPrismaService.client.committees.findMany.mockResolvedValue([]);

      const result = await service.findAllCommittees();

      expect(result).toEqual([]);
    });

    it("should propagate database errors", async () => {
      const dbError = new Error("Database connection failed");
      mockPrismaService.client.committees.findMany.mockRejectedValue(dbError);

      await expect(service.findAllCommittees()).rejects.toThrow(
        "Database connection failed",
      );
    });
  });

  describe("findCommitteesByLeague", () => {
    it("should return committees for given league", async () => {
      const mockCommittees = [
        mockCommitteeData({
          id: 1,
          name: "Comité Departmental de l'Ain",
          leagueId: 1,
          departmentName: "Ain",
          departmentCode: "01",
        }),
        mockCommitteeData({
          id: 2,
          name: "Comité Departmental de l'Aisne",
          leagueId: 1,
          departmentName: "Aisne",
          departmentCode: "02",
        }),
      ];

      mockPrismaService.client.committees.findMany.mockResolvedValue(
        mockCommittees,
      );

      const result = await service.findCommitteesByLeague(1);

      expect(result).toHaveLength(2);
      expect(result[0].leagueId).toBe(1);

      expect(mockPrismaService.client.committees.findMany).toHaveBeenCalledWith(
        {
          where: { leagueId: 1 },
          select: EXPECTED_SELECT,
          orderBy: [{ name: "asc" }],
        },
      );
    });

    it("should return an empty array when no committees found", async () => {
      mockPrismaService.client.committees.findMany.mockResolvedValue([]);

      await expect(service.findCommitteesByLeague(999)).resolves.toEqual([]);
    });
  });

  describe("findCommitteeById", () => {
    it("should return committee when found", async () => {
      const mockCommittee = mockCommitteeData({
        id: 1,
        name: "Comité Departmental de l'Ain",
        leagueId: 1,
        departmentName: "Ain",
        departmentCode: "01",
        _count: { clubs: 5 },
        clubs: [{ code: "ARA0001042" }],
      });

      mockPrismaService.client.committees.findUnique.mockResolvedValue(
        mockCommittee,
      );
      const clubs = [
        { id: 7, name: "AIN BASKET" },
        { id: 3, name: "BOURG BASKET" },
      ];
      mockPrismaService.client.clubs.findMany.mockResolvedValue(clubs);

      const result = await service.findCommitteeById(1);

      expect(result.id).toBe(1);
      expect(result.name).toBe("Comité Departmental de l'Ain");
      expect(result.clubCount).toBe(5);
      expect(result.department).toEqual({ name: "Ain", code: "01" });
      expect(result.ffbbUrl).toBe(
        "https://competitions.ffbb.com/ligues/ara/comites/0001",
      );

      expect(
        mockPrismaService.client.committees.findUnique,
      ).toHaveBeenCalledWith({
        where: { id: 1 },
        select: EXPECTED_SELECT,
      });
      // Every club, unpaginated: the committee page lists them all.
      expect(result.clubs).toEqual(clubs);
      expect(mockPrismaService.client.clubs.findMany).toHaveBeenCalledWith({
        where: { committeeId: 1 },
        select: { id: true, name: true },
        orderBy: [{ name: "asc" }, { id: "asc" }],
      });
    });

    it("should throw NotFoundException when committee not found", async () => {
      mockPrismaService.client.committees.findUnique.mockResolvedValue(null);
      mockPrismaService.client.clubs.findMany.mockResolvedValue([]);

      await expect(service.findCommitteeById(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findCommitteeById(999)).rejects.toThrow(
        "Committee with ID 999 not found",
      );
    });
  });
});
