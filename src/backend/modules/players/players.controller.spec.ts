// src/backend/modules/players/players.controller.spec.ts
import type { PaginatedResponseDto } from "@common/dto/paginated-response.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import type {
  MatchHistoryDto,
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
              pool: null,
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
        teamId: undefined,
        teamNumber: undefined,
        number: undefined,
        committeeId: undefined,
        leagueId: undefined,
        category: undefined,
        gender: undefined,
        name: undefined,
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
        teamId: 456,
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
        teamId: 456,
        teamNumber: 789,
        number: 10,
        committeeId: 111,
        leagueId: 222,
        category: undefined,
        gender: undefined,
        name: undefined,
        page: 2,
        limit: 20,
      });
    });

    it("should use defaults when page and limit not provided", async () => {
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
      expect(service.findAllPlayers).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 50,
        }),
      );
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
          pool: null,
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
      const mockHistory: MatchHistoryDto[] = [
        {
          id: 1,
          date: new Date("2024-02-05"),
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
          homeTeamScore: 85,
          awayTeamScore: 72,
          player: {
            player: {
              id: 1,
              name: "Player 1",
              number: 10,
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
      ];

      mockPlayersService.findPlayerMatchHistory.mockResolvedValue(mockHistory);

      // Act
      const result = await controller.getPlayerMatchHistory(1);

      // Assert
      expect(result).toEqual(mockHistory);
      expect(service.findPlayerMatchHistory).toHaveBeenCalledWith(1);
    });

    it("should return empty array when no matches found", async () => {
      // Arrange
      mockPlayersService.findPlayerMatchHistory.mockResolvedValue([]);

      // Act
      const result = await controller.getPlayerMatchHistory(1);

      // Assert
      expect(result).toEqual([]);
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
