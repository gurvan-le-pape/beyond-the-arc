// src/backend/modules/players/players.controller.spec.ts
import type { PaginatedResponseDto } from "@common/dto";
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";

import type {
  PlayerMatchHistoryResponseDto,
  PlayerResponseDto,
} from "./dto/players.response.dto";
import { PlayersController } from "./players.controller";
import { PlayersService } from "./players.service";

/**
 * Unit tests for PlayersController.
 *
 * Tests cover:
 * - Request handling
 * - Response formatting
 * - Error propagation
 * - Validation
 */
describe("PlayersController", () => {
  let controller: PlayersController;
  let service: PlayersService;

  // Mock service
  const mockPlayersService = {
    findAllPlayers: jest.fn(),
    findPlayerById: jest.fn(),
    findPlayerMatchHistory: jest.fn(),
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
      imports: [LoggerModule.forRoot()],
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayersService,
          useValue: mockPlayersService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        CacheDedupService,
      ],
    }).compile();

    controller = module.get<PlayersController>(PlayersController);
    service = module.get<PlayersService>(PlayersService);

    jest.clearAllMocks();
  });

  describe("getPlayers", () => {
    it("should return paginated players list", async () => {
      // Arrange
      const mockResponse: PaginatedResponseDto<PlayerResponseDto> = {
        items: [
          {
            id: 1,
            name: "Player 1",
            number: 10,
            position: "PG",
            heightCm: 185,
            weightKg: 80,
            birthdate: "2000-06-15",
            teamId: 1,
            team: {
              id: 1,
              number: 1,
              clubId: 1,
              category: "U18",
              gender: "male",
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
              pool: {
                id: 1,
                letter: "A",
                championship: { id: 1, level: "departmental", division: 1 },
              },
            },
          },
        ],
        total: 1,
        page: 1,
        limit: 50,
        totalPages: 1,
      };

      mockPlayersService.findAllPlayers.mockResolvedValue(mockResponse);

      const query = {
        level: "regional" as any,
        clubId: 1,
        page: 1,
        limit: 50,
      };

      // Act
      const result = await controller.getPlayers(query);

      // Assert
      expect(result).toEqual(mockResponse);
      expect(service.findAllPlayers).toHaveBeenCalledWith({
        level: "regional",
        clubId: 1,
        teamNumber: undefined,
        number: undefined,
        committeeId: undefined,
        leagueId: undefined,
        category: undefined,
        gender: undefined,
        search: undefined,
        page: 1,
        limit: 50,
      });
    });

    it("should pass numeric parameters to service", async () => {
      // Arrange
      const mockResponse: PaginatedResponseDto<PlayerResponseDto> = {
        items: [],
        total: 0,
        page: 2,
        limit: 20,
        totalPages: 0,
      };

      mockPlayersService.findAllPlayers.mockResolvedValue(mockResponse);

      const query = {
        clubId: 123,
        teamNumber: 789,
        number: 10,
        committeeId: 111,
        leagueId: 222,
        page: 2,
        limit: 20,
      };

      // Act
      await controller.getPlayers(query);

      // Assert
      expect(service.findAllPlayers).toHaveBeenCalledWith({
        level: undefined,
        clubId: 123,
        teamNumber: 789,
        number: 10,
        committeeId: 111,
        leagueId: 222,
        category: undefined,
        gender: undefined,
        search: undefined,
        page: 2,
        limit: 20,
      });
    });

    it("should pass an empty query through when no params are provided", async () => {
      // Arrange
      const mockResponse: PaginatedResponseDto<PlayerResponseDto> = {
        items: [],
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
      };

      mockPlayersService.findAllPlayers.mockResolvedValue(mockResponse);

      // Act
      await controller.getPlayers({});

      // Assert
      expect(service.findAllPlayers).toHaveBeenCalledWith({});
    });

    it("should propagate service errors", async () => {
      // Arrange
      const error = new Error("Database error");
      mockPlayersService.findAllPlayers.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.getPlayers({})).rejects.toThrow("Database error");
    });
  });

  describe("getPlayerById", () => {
    it("should return player for valid ID", async () => {
      // Arrange
      const mockPlayer: PlayerResponseDto = {
        id: 1,
        name: "Player 1",
        number: 10,
        position: "PG",
        heightCm: 185,
        weightKg: 80,
        birthdate: "2000-06-15",
        teamId: 1,
        team: {
          id: 1,
          number: 1,
          clubId: 1,
          category: "U18",
          gender: "male",
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
          pool: {
            id: 1,
            letter: "A",
            championship: { id: 1, level: "departmental", division: 1 },
          },
        },
      };

      mockPlayersService.findPlayerById.mockResolvedValue(mockPlayer);

      // Act
      const result = await controller.getPlayerById(1);

      // Assert
      expect(result).toEqual(mockPlayer);
      expect(service.findPlayerById).toHaveBeenCalledWith(1);
    });

    it("should throw NotFoundException for non-existent ID", async () => {
      // Arrange
      mockPlayersService.findPlayerById.mockRejectedValue(
        new NotFoundException("Player with ID 999 not found"),
      );

      // Act & Assert
      await expect(controller.getPlayerById(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should accept ID as number parameter", async () => {
      // Arrange
      const mockPlayer: PlayerResponseDto = {
        id: 42,
        name: "Test Player",
        number: 7,
        position: "C",
        heightCm: 210,
        weightKg: 110,
        birthdate: "1998-03-22",
        teamId: 1,
        team: {} as any,
      };

      mockPlayersService.findPlayerById.mockResolvedValue(mockPlayer);

      // Act
      await controller.getPlayerById(42);

      // Assert
      expect(service.findPlayerById).toHaveBeenCalledWith(42);
    });
  });

  describe("getPlayerMatchHistory", () => {
    it("should return match history for valid player ID", async () => {
      // Arrange
      const mockHistory: PlayerMatchHistoryResponseDto = {
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
            player: {
              player: {
                id: 1,
                name: "Player 1",
                number: 10,
                position: "PG",
                teamId: 1,
              },
              stats: {
                points: 15,
                fouls: 2,
                threePointsMade: 2,
                threePointsAttempted: 5,
                twoPointsIntMade: 3,
                twoPointsIntAttempted: 6,
                twoPointsExtMade: 1,
                twoPointsExtAttempted: 3,
                freeThrowsMade: 4,
                freeThrowsAttempted: 5,
                assists: 7,
                turnovers: 3,
                rebounds: {
                  total: 8,
                  offensive: 3,
                  defensive: 5,
                },
                steals: 2,
                blocks: 1,
                playtimeIntervals: [[0, 600]],
              },
            },
          },
        ],
        career: {
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
        },
      };

      mockPlayersService.findPlayerMatchHistory.mockResolvedValue(mockHistory);

      // Act
      const result = await controller.getPlayerMatchHistory(1);

      // Assert
      expect(result).toEqual(mockHistory);
      expect(service.findPlayerMatchHistory).toHaveBeenCalledWith(1);
    });

    it("should return an empty history with zeroed career stats", async () => {
      // Arrange
      const emptyHistory: PlayerMatchHistoryResponseDto = {
        matches: [],
        career: {
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
        },
      };
      mockPlayersService.findPlayerMatchHistory.mockResolvedValue(emptyHistory);

      // Act
      const result = await controller.getPlayerMatchHistory(1);

      // Assert
      expect(result).toEqual(emptyHistory);
    });

    it("should throw NotFoundException for non-existent player", async () => {
      // Arrange
      mockPlayersService.findPlayerMatchHistory.mockRejectedValue(
        new NotFoundException("Player with ID 999 not found"),
      );

      // Act & Assert
      await expect(controller.getPlayerMatchHistory(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("metadata", () => {
    it("should be decorated with @Controller", () => {
      const metadata = Reflect.getMetadata("path", PlayersController);
      expect(metadata).toBe("players");
    });
  });
});
