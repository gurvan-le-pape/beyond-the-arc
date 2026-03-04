// src/backend/modules/competitions/leaderboards/leaderboards.controller.spec.ts
// leaderboards.controller.spec.ts
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";

import type { LeaderboardResponseDto } from "./dto/leaderboards.response.dto";
import { LeaderboardsController } from "./leaderboards.controller";
import { LeaderboardsService } from "./leaderboards.service";

describe("LeaderboardsController", () => {
  let controller: LeaderboardsController;
  let service: LeaderboardsService;

  const mockLeaderboard: LeaderboardResponseDto = {
    id: 1,
    teamId: 5,
    teamNumber: 1,
    clubName: "AS Monaco Basket",
    points: 12,
    gamesPlayed: 8,
    gamesWon: 6,
    gamesLost: 2,
    gamesForfeited: 0,
    pointsFor: 645,
    pointsAgainst: 580,
    pointDifference: 65,
  };

  const mockLeaderboardsService = {
    findLeaderboardsByPoolId: jest.fn(),
    findLeaderboardById: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    reset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeaderboardsController],
      providers: [
        {
          provide: LeaderboardsService,
          useValue: mockLeaderboardsService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    controller = module.get<LeaderboardsController>(LeaderboardsController);
    service = module.get<LeaderboardsService>(LeaderboardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getLeaderboardsByPoolId", () => {
    it("should return leaderboard entries for a valid pool ID", async () => {
      const mockLeaderboards = [mockLeaderboard];

      mockLeaderboardsService.findLeaderboardsByPoolId.mockResolvedValue(
        mockLeaderboards,
      );

      const result = await controller.getLeaderboardsByPoolId({ poolId: 1 });

      expect(result).toEqual(mockLeaderboards);
      expect(service.findLeaderboardsByPoolId).toHaveBeenCalledWith(1);
      expect(service.findLeaderboardsByPoolId).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException when no leaderboards found", async () => {
      mockLeaderboardsService.findLeaderboardsByPoolId.mockRejectedValue(
        new NotFoundException("No leaderboard entries found for pool ID 999"),
      );

      await expect(
        controller.getLeaderboardsByPoolId({ poolId: 999 }),
      ).rejects.toThrow(NotFoundException);
      expect(service.findLeaderboardsByPoolId).toHaveBeenCalledWith(999);
    });
  });

  describe("getLeaderboardById", () => {
    it("should return a leaderboard entry for a valid ID", async () => {
      const id = 1;

      mockLeaderboardsService.findLeaderboardById.mockResolvedValue(
        mockLeaderboard,
      );

      const result = await controller.getLeaderboardById(id);

      expect(result).toEqual(mockLeaderboard);
      expect(service.findLeaderboardById).toHaveBeenCalledWith(id);
      expect(service.findLeaderboardById).toHaveBeenCalledTimes(1);
    });

    it("should throw NotFoundException for non-existent ID", async () => {
      const id = 999;

      mockLeaderboardsService.findLeaderboardById.mockRejectedValue(
        new NotFoundException("Leaderboard entry with ID 999 not found"),
      );

      await expect(controller.getLeaderboardById(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findLeaderboardById).toHaveBeenCalledWith(id);
    });
  });
});
