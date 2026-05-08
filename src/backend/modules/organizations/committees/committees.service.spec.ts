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
    committees: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
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
    phone: true,
    email: true,
    address: true,
    leagueId: true,
    president: {
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        code: true,
      },
    },
    department: {
      select: { id: true, name: true, code: true },
    },
    _count: { select: { clubs: true } },
  };

  const mockCommitteeData = (overrides = {}) => ({
    phone: null,
    email: null,
    address: null,
    president: null,
    _count: { clubs: 0 },
    ...overrides,
  });

  describe("findAllCommittees", () => {
    it("should return all committees with department information", async () => {
      const mockCommittees = [
        mockCommitteeData({
          id: 1,
          name: "Comité Departmental de l'Ain",
          leagueId: 1,
          department: { id: 1, name: "Ain", code: "01" },
        }),
        mockCommitteeData({
          id: 2,
          name: "Comité Departmental de l'Aisne",
          leagueId: 1,
          department: { id: 2, name: "Aisne", code: "02" },
        }),
      ];

      mockPrismaService.committees.findMany.mockResolvedValue(mockCommittees);

      const result = await service.findAllCommittees();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Comité Departmental de l'Ain");
      expect(result[0].department).toEqual({ id: 1, name: "Ain", code: "01" });

      expect(mockPrismaService.committees.findMany).toHaveBeenCalledWith({
        select: EXPECTED_SELECT,
        orderBy: [{ name: "asc" }],
      });
    });

    it("should return empty array when no committees exist", async () => {
      mockPrismaService.committees.findMany.mockResolvedValue([]);

      const result = await service.findAllCommittees();

      expect(result).toEqual([]);
    });

    it("should propagate database errors", async () => {
      const dbError = new Error("Database connection failed");
      mockPrismaService.committees.findMany.mockRejectedValue(dbError);

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
          department: { id: 1, name: "Ain", code: "01" },
        }),
        mockCommitteeData({
          id: 2,
          name: "Comité Departmental de l'Aisne",
          leagueId: 1,
          department: { id: 2, name: "Aisne", code: "02" },
        }),
      ];

      mockPrismaService.committees.findMany.mockResolvedValue(mockCommittees);

      const result = await service.findCommitteesByLeague(1);

      expect(result).toHaveLength(2);
      expect(result[0].leagueId).toBe(1);

      expect(mockPrismaService.committees.findMany).toHaveBeenCalledWith({
        where: { leagueId: 1 },
        select: EXPECTED_SELECT,
        orderBy: [{ name: "asc" }],
      });
    });

    it("should throw NotFoundException when no committees found", async () => {
      mockPrismaService.committees.findMany.mockResolvedValue([]);

      await expect(service.findCommitteesByLeague(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findCommitteesByLeague(999)).rejects.toThrow(
        "No committees found for league ID 999",
      );
    });
  });

  describe("findCommitteeById", () => {
    it("should return committee when found", async () => {
      const mockCommittee = mockCommitteeData({
        id: 1,
        name: "Comité Departmental de l'Ain",
        leagueId: 1,
        department: { id: 1, name: "Ain", code: "01" },
        _count: { clubs: 5 },
      });

      mockPrismaService.committees.findUnique.mockResolvedValue(mockCommittee);

      const result = await service.findCommitteeById(1);

      expect(result.id).toBe(1);
      expect(result.name).toBe("Comité Departmental de l'Ain");
      expect(result.clubCount).toBe(5);
      expect(result.department).toEqual({ id: 1, name: "Ain", code: "01" });

      expect(mockPrismaService.committees.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: EXPECTED_SELECT,
      });
    });

    it("should throw NotFoundException when committee not found", async () => {
      mockPrismaService.committees.findUnique.mockResolvedValue(null);

      await expect(service.findCommitteeById(999)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findCommitteeById(999)).rejects.toThrow(
        "Committee with ID 999 not found",
      );
    });
  });
});
