// src/backend/modules/matches/matches.controller.spec.ts
import type { PaginatedResponseDto } from "@common/dto/paginated-response.dto";
import type { CompetitionLevel } from "@common/index";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import type {
  MatchDetailResponseDto,
  MatchEventDto,
  MatchPlayerStatsResponseDto,
} from "./dto/matches.response.dto";
import { MatchesController } from "./matches.controller";
import { MatchesService } from "./matches.service";

/**
 * Unit tests for MatchesController.
 *
 * Tests cover:
 * - Request handling
 * - Response formatting
 * - Error propagation
 * - Validation
 */
describe("MatchesController", () => {
  let controller: MatchesController;
  let service: MatchesService;

  const mockMatchesService = {
    findAllMatches: jest.fn(),
    findMatchById: jest.fn(),
    findPlayerMatchStatsByMatchId: jest.fn(),
    findMatchEventsByMatchId: jest.fn(),
    findMatchEventsByTeamId: jest.fn(),
    findMatchEventsByPlayerId: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        {
          provide: MatchesService,
          useValue: mockMatchesService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
    service = module.get<MatchesService>(MatchesService);

    jest.clearAllMocks();
  });

  describe("getMatches", () => {
    it("should return all matches", async () => {
      const mockResponse: PaginatedResponseDto<MatchDetailResponseDto> = {
        items: [
          {
            id: 1,
            matchday: 1,
            date: new Date("2024-01-01"),
            homeTeamScore: 3,
            awayTeamScore: 2,
            forfeit: false,
            pool: null,
            homeTeam: {} as any,
            awayTeam: {} as any,
            matchEvents: [],
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockMatchesService.findAllMatches.mockResolvedValue(mockResponse);

      const query = {
        level: "regional" as CompetitionLevel,
        division: 1,
        page: 1,
        limit: 10,
      };

      const result = await controller.getMatches(query);

      expect(result).toBe(mockResponse);
      expect(service.findAllMatches).toHaveBeenCalled();
    });
  });

  describe("getMatchById", () => {
    it("should return match by id", async () => {
      const mockMatch: MatchDetailResponseDto = {
        id: 1,
        date: new Date("2024-01-01"),
        matchday: 1,
        pool: null,
        homeTeam: {} as any,
        awayTeam: {} as any,
        homeTeamScore: 3,
        awayTeamScore: 2,
        forfeit: false,
        matchEvents: [],
      };

      mockMatchesService.findMatchById.mockResolvedValue(mockMatch);

      const result = await controller.getMatchById(1);

      expect(result).toBe(mockMatch);
      expect(service.findMatchById).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException for non-existent match", async () => {
      mockMatchesService.findMatchById.mockRejectedValue(
        new NotFoundException("Match with ID 999 not found"),
      );

      await expect(controller.getMatchById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("getPlayerMatchStats", () => {
    it("should return player match stats", async () => {
      const mockStats: MatchPlayerStatsResponseDto = {
        homeTeamId: 1,
        awayTeamId: 2,
        stats: [],
      };

      mockMatchesService.findPlayerMatchStatsByMatchId.mockResolvedValue(
        mockStats,
      );

      const result = await controller.getPlayerMatchStats(1);

      expect(result).toBe(mockStats);
      expect(service.findPlayerMatchStatsByMatchId).toHaveBeenCalledWith(1);
    });
  });

  describe("getMatchEvents", () => {
    it("should return match events", async () => {
      const mockEvents: MatchEventDto[] = [
        {
          id: 1,
          eventType: "shot_made",
          timestamp: new Date("2024-02-05T19:02:00Z"),
          description: null,
          players: [],
          shotLocation: null,
        },
      ];

      mockMatchesService.findMatchEventsByMatchId.mockResolvedValue(mockEvents);

      const result = await controller.getMatchEvents(1);

      expect(result).toBe(mockEvents);
      expect(service.findMatchEventsByMatchId).toHaveBeenCalledWith(1);
    });
  });

  describe("getMatchEventsByTeamId", () => {
    it("should return match events for team", async () => {
      const mockEvents: MatchEventDto[] = [];

      mockMatchesService.findMatchEventsByTeamId.mockResolvedValue(mockEvents);

      const result = await controller.getMatchEventsByTeamId(1);

      expect(result).toBe(mockEvents);
      expect(service.findMatchEventsByTeamId).toHaveBeenCalledWith(1);
    });
  });

  describe("getMatchEventsByPlayerId", () => {
    it("should return match events for player", async () => {
      const mockEvents: MatchEventDto[] = [];

      mockMatchesService.findMatchEventsByPlayerId.mockResolvedValue(
        mockEvents,
      );

      const result = await controller.getMatchEventsByPlayerId(1);

      expect(result).toBe(mockEvents);
      expect(service.findMatchEventsByPlayerId).toHaveBeenCalledWith(1);
    });
  });

  describe("metadata", () => {
    it("should be decorated with @Controller", () => {
      const metadata = Reflect.getMetadata("path", MatchesController);
      expect(metadata).toBe("matches");
    });
  });
});
