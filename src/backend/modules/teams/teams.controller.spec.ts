// src/backend/modules/teams/teams.controller.spec.ts
import type { PaginatedResponseDto } from "@common/dto";
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";

import type {
  FilterValuesTeamsResponseDto,
  TeamDetailResponseDto,
  TeamMatchHistoryResponseDto,
  TeamResponseDto,
} from "./dto/teams.response.dto";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";

describe("TeamsController", () => {
  let controller: TeamsController;
  let service: TeamsService;

  const mockTeamsService = {
    findAllTeams: jest.fn(),
    findTeamFilterValues: jest.fn(),
    findTeamById: jest.fn(),
    findTeamMatchHistory: jest.fn(),
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
      controllers: [TeamsController],
      providers: [
        {
          provide: TeamsService,
          useValue: mockTeamsService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        CacheDedupService,
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
    service = module.get<TeamsService>(TeamsService);

    jest.clearAllMocks();
  });

  describe("getTeams", () => {
    it("should return paginated teams list", async () => {
      // Arrange
      const mockResponse: PaginatedResponseDto<TeamResponseDto> = {
        items: [
          {
            id: 1,
            number: 1,
            clubId: 1,
            seasonYear: "2025-2026",
            category: "U18",
            gender: "male",
            poolId: 1,
            club: {
              id: 1,
              name: "Club 1",
              committee: {
                id: 1,
                name: "Committee 1",
                league: {
                  id: 1,
                  name: "League 1",
                },
              },
            },
            pool: null,
            _count: { players: 12 },
          },
        ],
        total: 1,
        page: 1,
        limit: 50,
        totalPages: 1,
      };

      mockTeamsService.findAllTeams.mockResolvedValue(mockResponse);

      const query = {
        clubId: 1,
        level: "regional" as any,
        page: 1,
        limit: 50,
      };

      // Act
      const result = await controller.getTeams(query);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(service.findAllTeams).toHaveBeenCalledWith({
        clubId: 1,
        level: "regional",
        division: undefined,
        committeeId: undefined,
        leagueId: undefined,
        number: undefined,
        category: undefined,
        gender: undefined,
        search: undefined,
        poolLetter: undefined,
        page: 1,
        limit: 50,
      });
    });

    it("should pass numeric parameters to service", async () => {
      // Arrange
      const mockResponse: PaginatedResponseDto<TeamResponseDto> = {
        items: [],
        total: 0,
        page: 2,
        limit: 20,
        totalPages: 0,
      };

      mockTeamsService.findAllTeams.mockResolvedValue(mockResponse);

      const query = {
        clubId: 123,
        committeeId: 456,
        leagueId: 789,
        number: 10,
        page: 2,
        limit: 20,
      };

      // Act
      await controller.getTeams(query);

      // Assert
      expect(service.findAllTeams).toHaveBeenCalledWith({
        clubId: 123,
        level: undefined,
        division: undefined,
        committeeId: 456,
        leagueId: 789,
        number: 10,
        category: undefined,
        gender: undefined,
        search: undefined,
        poolLetter: undefined,
        page: 2,
        limit: 20,
      });
    });

    it("should pass an empty query through when no params are provided", async () => {
      // Arrange
      const mockResponse: PaginatedResponseDto<TeamResponseDto> = {
        items: [],
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
      };

      mockTeamsService.findAllTeams.mockResolvedValue(mockResponse);

      // Act
      await controller.getTeams({});

      // Assert
      expect(service.findAllTeams).toHaveBeenCalledWith({});
    });

    it("should propagate service errors", async () => {
      // Arrange
      const error = new Error("Database error");
      mockTeamsService.findAllTeams.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getTeams({})).rejects.toThrow("Database error");
    });
  });

  describe("getTeamFilterValues", () => {
    it("should return available filter values", async () => {
      // Arrange
      const mockFilterValues: FilterValuesTeamsResponseDto = {
        numbers: [1, 2, 3],
        poolLetters: ["A", "B"],
        divisions: [1, 2],
      };

      mockTeamsService.findTeamFilterValues.mockResolvedValue(mockFilterValues);

      // Act
      const result = await controller.getTeamFilterValues({});

      // Assert
      expect(result).toEqual(mockFilterValues);
      expect(service.findTeamFilterValues).toHaveBeenCalled();
    });

    it("should propagate service errors", async () => {
      // Arrange
      mockTeamsService.findTeamFilterValues.mockRejectedValue(
        new Error("Database error"),
      );

      // Act & Assert
      await expect(controller.getTeamFilterValues({})).rejects.toThrow(
        "Database error",
      );
    });
  });

  describe("getTeamById", () => {
    it("should return team for valid ID", async () => {
      // Arrange
      const mockTeam: TeamDetailResponseDto = {
        id: 1,
        number: 1,
        clubId: 1,
        seasonYear: "2025-2026",
        category: "U18",
        gender: "male",
        poolId: 1,
        club: {
          id: 1,
          name: "Club 1",
          committee: {
            id: 1,
            name: "Committee 1",
            league: {
              id: 1,
              name: "League 1",
            },
          },
        },
        pool: null,
        _count: { players: 12 },
        players: [],
      };

      mockTeamsService.findTeamById.mockResolvedValue(mockTeam);

      // Act
      const result = await controller.getTeamById(1);

      // Assert
      expect(result).toEqual(mockTeam);
      expect(service.findTeamById).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException for non-existent ID", async () => {
      // Arrange
      mockTeamsService.findTeamById.mockRejectedValue(
        new NotFoundException("Team with ID 999 not found"),
      );

      // Act & Assert
      await expect(controller.getTeamById(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should accept ID as number parameter", async () => {
      // Arrange
      const mockTeam: TeamDetailResponseDto = {
        id: 42,
        number: 1,
        clubId: 1,
        seasonYear: "2025-2026",
        category: "U11",
        gender: "male",
        poolId: null,
        club: {} as any,
        pool: null,
        _count: { players: 0 },
        players: [],
      };

      mockTeamsService.findTeamById.mockResolvedValue(mockTeam);

      // Act
      await controller.getTeamById(42);

      // Assert
      expect(service.findTeamById).toHaveBeenCalledWith(42);
    });
  });

  describe("getTeamMatchHistory", () => {
    it("should return match history for valid team ID", async () => {
      // Arrange
      const mockHistory: TeamMatchHistoryResponseDto = {
        matches: [
          {
            id: 1,
            startsAt: new Date("2024-02-05"),
            homeTeam: {
              id: 1,
              number: 1,
              club: { id: 1, name: "Club A" },
            },
            awayTeam: {
              id: 2,
              number: 1,
              club: { id: 2, name: "Club B" },
            },
            status: "completed",
            homeTeamScore: 85,
            awayTeamScore: 72,
          },
        ],
        seasonStats: {
          gamesPlayed: 1,
          points: 15,
          rebounds: 8,
          assists: 7,
          steals: 2,
          blocks: 1,
          turnovers: 3,
          fouls: 2,
          pointsPerGame: 15,
          reboundsPerGame: 8,
          assistsPerGame: 7,
          stealsPerGame: 2,
          blocksPerGame: 1,
          turnoversPerGame: 3,
          foulsPerGame: 2,
          players: 1,
        },
      };

      mockTeamsService.findTeamMatchHistory.mockResolvedValue(mockHistory);

      // Act
      const result = await controller.getTeamMatchHistory(1);

      // Assert
      expect(result).toEqual(mockHistory);
      expect(service.findTeamMatchHistory).toHaveBeenCalledWith(1);
    });

    it("should return an empty history with zeroed season stats", async () => {
      // Arrange
      const emptyHistory: TeamMatchHistoryResponseDto = {
        matches: [],
        seasonStats: {
          gamesPlayed: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          turnovers: 0,
          fouls: 0,
          pointsPerGame: 0,
          reboundsPerGame: 0,
          assistsPerGame: 0,
          stealsPerGame: 0,
          blocksPerGame: 0,
          turnoversPerGame: 0,
          foulsPerGame: 0,
          players: 0,
        },
      };
      mockTeamsService.findTeamMatchHistory.mockResolvedValue(emptyHistory);

      // Act
      const result = await controller.getTeamMatchHistory(1);

      // Assert
      expect(result).toEqual(emptyHistory);
    });

    it("should throw NotFoundException for non-existent team", async () => {
      // Arrange
      mockTeamsService.findTeamMatchHistory.mockRejectedValue(
        new NotFoundException("Team with ID 999 not found"),
      );

      // Act & Assert
      await expect(controller.getTeamMatchHistory(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("metadata", () => {
    it("should be decorated with @Controller", () => {
      const metadata = Reflect.getMetadata("path", TeamsController);
      expect(metadata).toBe("teams");
    });
  });
});
