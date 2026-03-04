// src/backend/modules/organizations/committees/committees.service.spec.ts
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
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
      providers: [
        CommitteesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CommitteesService>(CommitteesService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe("findAllCommittees", () => {
    it("should return all committees with department information", async () => {
      const mockCommittees = [
        {
          id: 1,
          name: "Comité Departmental de l'Ain",
          leagueId: 1,
          department: { id: 1, name: "Ain", code: "01" },
        },
        {
          id: 2,
          name: "Comité Departmental de l'Aisne",
          leagueId: 1,
          department: { id: 2, name: "Aisne", code: "02" },
        },
      ];

      mockPrismaService.committees.findMany.mockResolvedValue(mockCommittees);

      const result = await service.findAllCommittees();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("Comité Departmental de l'Ain");
      expect(result[0].department).toEqual({ id: 1, name: "Ain", code: "01" });

      expect(mockPrismaService.committees.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          leagueId: true,
          department: {
            select: { id: true, name: true, code: true },
          },
        },
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
        {
          id: 1,
          name: "Comité Departmental de l'Ain",
          leagueId: 1,
          department: { id: 1, name: "Ain", code: "01" },
        },
        {
          id: 2,
          name: "Comité Departmental de l'Aisne",
          leagueId: 1,
          department: { id: 2, name: "Aisne", code: "02" },
        },
      ];

      mockPrismaService.committees.findMany.mockResolvedValue(mockCommittees);

      const result = await service.findCommitteesByLeague(1);

      expect(result).toHaveLength(2);
      expect(result[0].leagueId).toBe(1);

      expect(mockPrismaService.committees.findMany).toHaveBeenCalledWith({
        where: { leagueId: 1 },
        select: {
          id: true,
          name: true,
          leagueId: true,
          department: {
            select: { id: true, name: true, code: true },
          },
        },
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
      const mockCommittee = {
        id: 1,
        name: "Comité Departmental de l'Ain",
        leagueId: 1,
        department: { id: 1, name: "Ain", code: "01" },
      };

      mockPrismaService.committees.findUnique.mockResolvedValue(mockCommittee);

      const result = await service.findCommitteeById(1);

      expect(result).toEqual({
        id: 1,
        name: "Comité Departmental de l'Ain",
        leagueId: 1,
        department: { id: 1, name: "Ain", code: "01" },
      });

      expect(mockPrismaService.committees.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          name: true,
          leagueId: true,
          department: {
            select: { id: true, name: true, code: true },
          },
        },
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
