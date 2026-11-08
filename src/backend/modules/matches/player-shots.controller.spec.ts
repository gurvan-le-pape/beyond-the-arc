// src/backend/modules/matches/player-shots.controller.spec.ts
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";

import type { ShotDto } from "./dto/matches.response.dto";
import { MatchesService } from "./matches.service";
import { PlayerShotsController } from "./player-shots.controller";

describe("PlayerShotsController", () => {
  let controller: PlayerShotsController;
  let service: MatchesService;

  const mockMatchesService = { findShotsByPlayerId: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      controllers: [PlayerShotsController],
      providers: [
        { provide: MatchesService, useValue: mockMatchesService },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
        },
        CacheDedupService,
      ],
    }).compile();

    controller = module.get<PlayerShotsController>(PlayerShotsController);
    service = module.get<MatchesService>(MatchesService);

    jest.clearAllMocks();
  });

  it("is routed under /players", () => {
    expect(Reflect.getMetadata("path", PlayerShotsController)).toBe("players");
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
});
