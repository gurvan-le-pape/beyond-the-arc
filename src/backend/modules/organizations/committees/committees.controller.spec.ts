// src/backend/modules/organizations/committees/committees.controller.spec.ts
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import { CommitteesController } from "./committees.controller";
import { CommitteesService } from "./committees.service";
import type { CommitteeResponseDto } from "./dto/committees.response.dto";

/**
 * Unit tests for CommitteesController.
 *
 * Tests cover:
 * - Request handling
 * - Response formatting
 * - Error propagation
 * - Validation
 */
describe("CommitteesController", () => {
  let controller: CommitteesController;
  let service: CommitteesService;

  // Mock service
  const mockCommitteesService = {
    findAllCommittees: jest.fn(),
    findCommitteesByLeague: jest.fn(),
    findCommitteeById: jest.fn(),
  };

  // Mock cache manager
  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommitteesController],
      providers: [
        {
          provide: CommitteesService,
          useValue: mockCommitteesService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    controller = module.get<CommitteesController>(CommitteesController);
    service = module.get<CommitteesService>(CommitteesService);

    jest.clearAllMocks();
  });

  describe("getCommittees", () => {
    it("should return all committees when no leagueId provided", async () => {
      // Arrange
      const mockCommittees: CommitteeResponseDto[] = [
        {
          id: 1,
          name: "Comité Departmental de l'Ain",
          leagueId: 1,
          department: {
            id: 1,
            name: "Ain",
            code: "01",
          },
        },
        {
          id: 2,
          name: "Comité Departmental de l'Aisne",
          leagueId: 1,
          department: {
            id: 2,
            name: "Aisne",
            code: "02",
          },
        },
      ];

      mockCommitteesService.findAllCommittees.mockResolvedValue(mockCommittees);

      const query = {};

      // Act
      const result = await controller.getCommittees(query);

      // Assert
      expect(result).toEqual(mockCommittees);
      expect(service.findAllCommittees).toHaveBeenCalledTimes(1);
    });

    it("should return filtered committees when leagueId provided", async () => {
      // Arrange
      const mockCommittees: CommitteeResponseDto[] = [
        {
          id: 1,
          name: "Comité Departmental de l'Ain",
          leagueId: 1,
          department: {
            id: 1,
            name: "Ain",
            code: "01",
          },
        },
      ];

      mockCommitteesService.findCommitteesByLeague.mockResolvedValue(
        mockCommittees,
      );

      const query = { leagueId: 1 };

      // Act
      const result = await controller.getCommittees(query);

      // Assert
      expect(result).toEqual(mockCommittees);
      expect(service.findCommitteesByLeague).toHaveBeenCalledWith(1);
    });

    it("should call findCommitteesByLeague with the provided number", async () => {
      // Arrange
      mockCommitteesService.findCommitteesByLeague.mockResolvedValue([]);

      const query = { leagueId: 42 };

      // Act
      await controller.getCommittees(query);

      // Assert
      expect(service.findCommitteesByLeague).toHaveBeenCalledWith(42);
    });

    it("should throw NotFoundException when no committees found for league", async () => {
      // Arrange
      mockCommitteesService.findCommitteesByLeague.mockRejectedValue(
        new NotFoundException("No committees found for league ID 999"),
      );

      const query = { leagueId: 999 };

      // Act & Assert
      await expect(controller.getCommittees(query)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should propagate service errors", async () => {
      // Arrange
      const error = new Error("Database error");
      mockCommitteesService.findAllCommittees.mockRejectedValue(error);

      const query = {};

      // Act & Assert
      await expect(controller.getCommittees(query)).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("getCommitteeById", () => {
    it("should return committee for valid ID", async () => {
      // Arrange
      const mockCommittee: CommitteeResponseDto = {
        id: 1,
        name: "Comité Departmental de l'Ain",
        leagueId: 1,
        department: {
          id: 1,
          name: "Ain",
          code: "01",
        },
      };

      mockCommitteesService.findCommitteeById.mockResolvedValue(mockCommittee);

      // Act
      const result = await controller.getCommitteeById(1);

      // Assert
      expect(result).toEqual(mockCommittee);
      expect(service.findCommitteeById).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException for non-existent ID", async () => {
      // Arrange
      mockCommitteesService.findCommitteeById.mockRejectedValue(
        new NotFoundException("Committee with ID 999 not found"),
      );

      // Act & Assert
      await expect(controller.getCommitteeById(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should accept ID as number parameter", async () => {
      // Arrange
      const mockCommittee: CommitteeResponseDto = {
        id: 42,
        name: "Test Committee",
        leagueId: 1,
        department: { id: 1, name: "Ain", code: "01" },
      };

      mockCommitteesService.findCommitteeById.mockResolvedValue(mockCommittee);

      // Act
      await controller.getCommitteeById(42);

      // Assert
      expect(service.findCommitteeById).toHaveBeenCalledWith(42);
    });
  });

  describe("metadata", () => {
    it("should be decorated with @Controller", () => {
      const metadata = Reflect.getMetadata("path", CommitteesController);
      expect(metadata).toBe("committees");
    });
  });
});
