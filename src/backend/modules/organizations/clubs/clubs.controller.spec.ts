// src/backend/modules/organizations/clubs/clubs.controller.spec.ts
/**
 * clubs.controller.spec.ts
 * Unit tests for ClubsController.
 *
 * Tests API endpoints and error handling.
 * Uses NestJS TestingModule and mocks ClubsService.
 */

import { Category } from "@common/constants/categories";
import { CompetitionLevel } from "@common/constants/competition-levels";
import { Gender } from "@common/constants/genders";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

import { ClubsController } from "./clubs.controller";
import { ClubsService } from "./clubs.service";
import {
  GetClubsQueryDto,
  GetClubStatsByDepartmentQueryDto,
} from "./dto/clubs.query.dto";
import type {
  ClubBasicResponseDto,
  ClubDetailedResponseDto,
  ClubStatsByDepartmentDto,
  ClubStatsByRegionDto,
} from "./dto/clubs.response.dto";

describe("ClubsController", () => {
  let controller: ClubsController;
  let service: ClubsService;

  const mockClubsService = {
    getClubCountsByRegion: jest.fn(),
    getClubCountsByDepartment: jest.fn(),
    findClubsByFilters: jest.fn(),
    findClubById: jest.fn(),
    getAllDepartments: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubsController],
      providers: [
        {
          provide: ClubsService,
          useValue: mockClubsService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    controller = module.get<ClubsController>(ClubsController);
    service = module.get<ClubsService>(ClubsService);

    jest.clearAllMocks();
  });

  describe("getClubStatsByRegion", () => {
    it("should return club stats by region", async () => {
      const mockStats: ClubStatsByRegionDto[] = [
        {
          id: 1,
          code: "84",
          name: "League Auvergne-Rhône-Alpes",
          clubCount: 42,
        },
        {
          id: 2,
          code: "75",
          name: "League Île-de-France",
          clubCount: 38,
        },
      ];

      mockClubsService.getClubCountsByRegion.mockResolvedValue(mockStats);

      const result = await controller.getClubStatsByRegion();

      expect(result).toEqual(mockStats);
      expect(mockClubsService.getClubCountsByRegion).toHaveBeenCalledTimes(1);
      expect(mockClubsService.getClubCountsByRegion).toHaveBeenCalledWith();
    });

    it("should handle empty results", async () => {
      mockClubsService.getClubCountsByRegion.mockResolvedValue([]);

      const result = await controller.getClubStatsByRegion();

      expect(result).toEqual([]);
      expect(mockClubsService.getClubCountsByRegion).toHaveBeenCalledTimes(1);
    });

    it("should propagate service errors", async () => {
      const error = new Error("Database error");
      mockClubsService.getClubCountsByRegion.mockRejectedValue(error);

      await expect(controller.getClubStatsByRegion()).rejects.toThrow(error);
    });
  });

  describe("getClubStatsByDepartment", () => {
    it("should return club stats by department without filter", async () => {
      const mockStats: ClubStatsByDepartmentDto[] = [
        {
          id: 1,
          name: "Comité de l'Ain",
          department: {
            id: 1,
            name: "Ain",
            code: "01",
          },
          leagueId: 1,
          clubCount: 15,
        },
      ];

      mockClubsService.getClubCountsByDepartment.mockResolvedValue(mockStats);

      const dto: GetClubStatsByDepartmentQueryDto = {};
      const result = await controller.getClubStatsByDepartment(dto);

      expect(result).toEqual(mockStats);
      expect(mockClubsService.getClubCountsByDepartment).toHaveBeenCalledTimes(
        1,
      );
      expect(mockClubsService.getClubCountsByDepartment).toHaveBeenCalledWith(
        undefined,
      );
    });

    it("should return club stats by department with leagueId filter", async () => {
      const mockStats: ClubStatsByDepartmentDto[] = [
        {
          id: 2,
          name: "Comité du Rhône",
          department: {
            id: 2,
            name: "Rhône",
            code: "69",
          },
          leagueId: 1,
          clubCount: 25,
        },
      ];

      mockClubsService.getClubCountsByDepartment.mockResolvedValue(mockStats);

      const dto: GetClubStatsByDepartmentQueryDto = { leagueId: 1 };
      const result = await controller.getClubStatsByDepartment(dto);

      expect(result).toEqual(mockStats);
      expect(mockClubsService.getClubCountsByDepartment).toHaveBeenCalledTimes(
        1,
      );
      expect(mockClubsService.getClubCountsByDepartment).toHaveBeenCalledWith(
        1,
      );
    });

    it("should handle empty results", async () => {
      mockClubsService.getClubCountsByDepartment.mockResolvedValue([]);

      const dto: GetClubStatsByDepartmentQueryDto = {};
      const result = await controller.getClubStatsByDepartment(dto);

      expect(result).toEqual([]);
    });
  });

  describe("getClubs", () => {
    it("should return clubs with all filters", async () => {
      const mockClubs: ClubBasicResponseDto[] = [
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
          leagueId: 2,
        },
      ];

      mockClubsService.findClubsByFilters.mockResolvedValue(mockClubs);

      const dto: GetClubsQueryDto = {
        level: CompetitionLevel.REGIONAL,
        committeeId: 1,
        leagueId: 2,
        category: Category.U18,
        gender: Gender.MALE,
      };

      const result = await controller.getClubs(dto);

      expect(result).toEqual(mockClubs);
      expect(mockClubsService.findClubsByFilters).toHaveBeenCalledTimes(1);
      expect(mockClubsService.findClubsByFilters).toHaveBeenCalledWith({
        level: CompetitionLevel.REGIONAL,
        committeeId: 1,
        leagueId: 2,
        category: Category.U18,
        gender: Gender.MALE,
      });
    });

    it("should handle partial filters", async () => {
      mockClubsService.findClubsByFilters.mockResolvedValue([]);

      const dto: GetClubsQueryDto = {
        category: Category.U18,
      };

      await controller.getClubs(dto);

      expect(mockClubsService.findClubsByFilters).toHaveBeenCalledWith({
        level: undefined,
        committeeId: undefined,
        leagueId: undefined,
        category: Category.U18,
        gender: undefined,
      });
    });

    it("should handle no filters", async () => {
      mockClubsService.findClubsByFilters.mockResolvedValue([]);

      const dto: GetClubsQueryDto = {};

      const result = await controller.getClubs(dto);

      expect(result).toEqual([]);
      expect(mockClubsService.findClubsByFilters).toHaveBeenCalledWith({
        level: undefined,
        committeeId: undefined,
        leagueId: undefined,
        category: undefined,
        gender: undefined,
      });
    });

    it("should return empty array when no clubs match", async () => {
      mockClubsService.findClubsByFilters.mockResolvedValue([]);

      const dto: GetClubsQueryDto = {
        level: CompetitionLevel.DEPARTMENTAL,
      };

      const result = await controller.getClubs(dto);

      expect(result).toEqual([]);
    });
  });

  describe("getClubById", () => {
    it("should return club by id with detailed information", async () => {
      const mockClub: ClubDetailedResponseDto = {
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
                division: 1,
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

      mockClubsService.findClubById.mockResolvedValue(mockClub);

      const result = await controller.getClubById(1);

      expect(result).toEqual(mockClub);
      expect(mockClubsService.findClubById).toHaveBeenCalledTimes(1);
      expect(mockClubsService.findClubById).toHaveBeenCalledWith(1);
    });

    it("should handle club with no teams", async () => {
      const mockClub: ClubDetailedResponseDto = {
        id: 2,
        name: "Club Sans Équipe",
        city: "Paris",
        zipCode: "75001",
        address: null,
        phone: null,
        email: null,
        website: null,
        teams: [],
      };

      mockClubsService.findClubById.mockResolvedValue(mockClub);

      const result = await controller.getClubById(2);

      expect(result).toEqual(mockClub);
      expect(result.teams).toHaveLength(0);
    });

    it("should propagate NotFoundException from service", async () => {
      const error = new Error("Club with ID 999 not found");
      mockClubsService.findClubById.mockRejectedValue(error);

      await expect(controller.getClubById(999)).rejects.toThrow(error);
      expect(mockClubsService.findClubById).toHaveBeenCalledWith(999);
    });
  });

  describe("GetClubsQueryDto validation", () => {
    it("should validate a correct DTO with all fields", async () => {
      const dto = plainToInstance(GetClubsQueryDto, {
        level: CompetitionLevel.REGIONAL,
        committeeId: "1",
        leagueId: "2",
        category: Category.U18,
        gender: Gender.MALE,
      });

      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it("should validate a correct DTO with partial fields", async () => {
      const dto = plainToInstance(GetClubsQueryDto, {
        category: Category.U18,
      });

      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it("should validate an empty DTO (all fields optional)", async () => {
      const dto = plainToInstance(GetClubsQueryDto, {});

      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it("should fail for invalid competition level", async () => {
      const dto = plainToInstance(GetClubsQueryDto, {
        level: "invalid_level",
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("level");
      expect(errors[0].constraints).toHaveProperty("isEnum");
    });

    it("should fail for non-numeric committeeId", async () => {
      const dto = plainToInstance(GetClubsQueryDto, {
        committeeId: "abc",
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("committeeId");
      expect(errors[0].constraints).toHaveProperty("isNumber");
    });

    it("should fail for non-numeric leagueId", async () => {
      const dto = plainToInstance(GetClubsQueryDto, {
        leagueId: "xyz",
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("leagueId");
      expect(errors[0].constraints).toHaveProperty("isNumber");
    });

    it("should fail for invalid category", async () => {
      const dto = plainToInstance(GetClubsQueryDto, {
        category: "InvalidCategory",
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("category");
      expect(errors[0].constraints).toHaveProperty("isEnum");
    });

    it("should fail for invalid gender", async () => {
      const dto = plainToInstance(GetClubsQueryDto, {
        gender: "InvalidGender",
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("gender");
      expect(errors[0].constraints).toHaveProperty("isEnum");
    });
  });

  describe("GetClubStatsByDepartmentQueryDto validation", () => {
    it("should validate a correct DTO with leagueId", async () => {
      const dto = plainToInstance(GetClubStatsByDepartmentQueryDto, {
        leagueId: "1",
      });

      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it("should validate an empty DTO", async () => {
      const dto = plainToInstance(GetClubStatsByDepartmentQueryDto, {});

      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });

    it("should fail for non-numeric leagueId", async () => {
      const dto = plainToInstance(GetClubStatsByDepartmentQueryDto, {
        leagueId: "abc",
      });

      const errors = await validate(dto);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe("leagueId");
      expect(errors[0].constraints).toHaveProperty("isNumber");
    });

    it("should accept numeric strings", async () => {
      const dto = plainToInstance(GetClubStatsByDepartmentQueryDto, {
        leagueId: "7",
      });

      const errors = await validate(dto);

      expect(errors.length).toBe(0);
    });
  });
});
