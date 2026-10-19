// src/backend/modules/matches/matches.controller.spec.ts
import type { Category, CompetitionLevel, Gender } from "@common/constants";
import type { PaginatedResponseDto } from "@common/dto";
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";

import type {
  MatchDetailResponseDto,
  MatchEventDto,
  MatchPlayerStatsResponseDto,
  ShotDto,
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
    findMatchesByPoolId: jest.fn(),
    findPlayerMatchStatsByMatchId: jest.fn(),
    findMatchEventsByMatchId: jest.fn(),
    findShotsByTeamId: jest.fn(),
    findShotsByPlayerId: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
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
        CacheDedupService,
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
            startsAt: new Date("2024-01-01"),
            homeTeamScore: 3,
            awayTeamScore: 2,
            forfeit: false,
            overtime: false,
            pool: {} as any,
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
        committeeId: 7,
        leagueId: 8,
        category: "U18" as Category,
        gender: "female" as Gender,
        poolId: 9,
        championshipId: 10,
        matchday: 11,
        date: "2026-02-06",
        search: "croix",
        page: 1,
        limit: 10,
      };

      const result = await controller.getMatches(query);

      expect(result).toBe(mockResponse);
      // The full mapped object, as players/teams/clubs/championships already
      // assert. Every one of these 13 fields is a filter a caller can set, and
      // dropping one from the controller is silent otherwise: the endpoint just
      // ignores that filter.
      expect(service.findAllMatches).toHaveBeenCalledWith({
        level: "regional",
        division: 1,
        committeeId: 7,
        leagueId: 8,
        category: "U18",
        gender: "female",
        poolId: 9,
        championshipId: 10,
        matchday: 11,
        date: "2026-02-06",
        search: "croix",
        page: 1,
        limit: 10,
      });
    });

    it("passes every unset filter through as undefined rather than dropping it", async () => {
      mockMatchesService.findAllMatches.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });

      await controller.getMatches({ page: 1, limit: 10 });

      expect(service.findAllMatches).toHaveBeenCalledWith({
        level: undefined,
        division: undefined,
        committeeId: undefined,
        leagueId: undefined,
        category: undefined,
        gender: undefined,
        poolId: undefined,
        championshipId: undefined,
        matchday: undefined,
        date: undefined,
        search: undefined,
        page: 1,
        limit: 10,
      });
    });
  });

  describe("getMatchesByPoolId", () => {
    it("should return matches for a pool", async () => {
      const mockMatches: MatchDetailResponseDto[] = [
        {
          id: 1,
          matchday: 1,
          startsAt: new Date("2024-01-01"),
          homeTeamScore: 3,
          awayTeamScore: 2,
          forfeit: false,
          overtime: false,
          pool: {} as any,
          homeTeam: {} as any,
          awayTeam: {} as any,
          matchEvents: [],
        },
      ];

      mockMatchesService.findMatchesByPoolId.mockResolvedValue(mockMatches);

      const result = await controller.getMatchesByPoolId(1);

      expect(result).toBe(mockMatches);
      expect(service.findMatchesByPoolId).toHaveBeenCalledWith(1);
    });

    it("should return empty array when pool has no matches", async () => {
      mockMatchesService.findMatchesByPoolId.mockResolvedValue([]);

      const result = await controller.getMatchesByPoolId(1);

      expect(result).toEqual([]);
    });

    it("should propagate service errors", async () => {
      mockMatchesService.findMatchesByPoolId.mockRejectedValue(
        new NotFoundException("Pool not found"),
      );

      await expect(controller.getMatchesByPoolId(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("getMatchById", () => {
    it("should return match by id", async () => {
      const mockMatch: MatchDetailResponseDto = {
        id: 1,
        startsAt: new Date("2024-01-01"),
        matchday: 1,
        pool: {} as any,
        homeTeam: {} as any,
        awayTeam: {} as any,
        homeTeamScore: 3,
        awayTeamScore: 2,
        forfeit: false,
        overtime: false,
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
      const emptyTeamStats = {
        fieldGoals: "0/0",
        fieldGoalPercentage: null,
        threePointers: "0/0",
        threePointPercentage: null,
        freeThrows: "0/0",
        freeThrowPercentage: null,
        reboundsTotal: 0,
        reboundsOffensive: 0,
        reboundsDefensive: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        turnovers: 0,
        fouls: 0,
        pointsInPaint: 0,
      };
      const mockStats: MatchPlayerStatsResponseDto = {
        homeTeamId: 1,
        awayTeamId: 2,
        stats: [],
        homeTeamStats: emptyTeamStats,
        awayTeamStats: emptyTeamStats,
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
          eventType: "made_layup",
          period: 1,
          occurredAt: new Date("2024-02-05T19:02:00Z"),
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

  describe("getShotsByTeamId", () => {
    it("should return the team's shots", async () => {
      const mockShots: ShotDto[] = [];

      mockMatchesService.findShotsByTeamId.mockResolvedValue(mockShots);

      const result = await controller.getShotsByTeamId(1);

      expect(result).toBe(mockShots);
      expect(service.findShotsByTeamId).toHaveBeenCalledWith(1);
    });
  });

  describe("getShotsByPlayerId", () => {
    it("should return the player's shots", async () => {
      const mockShots: ShotDto[] = [];

      mockMatchesService.findShotsByPlayerId.mockResolvedValue(mockShots);

      const result = await controller.getShotsByPlayerId(1);

      expect(result).toBe(mockShots);
      expect(service.findShotsByPlayerId).toHaveBeenCalledWith(1);
    });
  });

  describe("metadata", () => {
    it("should be decorated with @Controller", () => {
      const metadata = Reflect.getMetadata("path", MatchesController);
      expect(metadata).toBe("matches");
    });
  });
});
