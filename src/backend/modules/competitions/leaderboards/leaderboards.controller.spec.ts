// src/backend/modules/competitions/leaderboards/leaderboards.controller.spec.ts
// leaderboards.controller.spec.ts
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";

import type { LeaderboardResponseDto } from "./dto/leaderboards.response.dto";
import { LeaderboardsController } from "./leaderboards.controller";
import { LeaderboardsService } from "./leaderboards.service";

describe("LeaderboardsController", () => {
  let controller: LeaderboardsController;
  let service: LeaderboardsService;

  const mockLeaderboard: LeaderboardResponseDto = {
    teamId: 5,
    rank: 1,
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
    form: [
      { matchId: 11, result: "W" },
      { matchId: 12, result: "L" },
    ],
  };

  const mockLeaderboardsService = {
    findLeaderboardsByPoolId: jest.fn(),
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
        CacheDedupService,
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

      const result = await controller.getLeaderboardsByPoolId(1);

      expect(result).toEqual(mockLeaderboards);
      expect(service.findLeaderboardsByPoolId).toHaveBeenCalledWith(1);
      expect(service.findLeaderboardsByPoolId).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when no leaderboards found", async () => {
      mockLeaderboardsService.findLeaderboardsByPoolId.mockResolvedValue([]);

      await expect(controller.getLeaderboardsByPoolId(999)).resolves.toEqual(
        [],
      );
      expect(service.findLeaderboardsByPoolId).toHaveBeenCalledWith(999);
    });
  });
});
