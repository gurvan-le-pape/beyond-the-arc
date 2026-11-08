// src/backend/modules/matches/team-shots.controller.spec.ts
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";

import type { ShotDto } from "./dto/matches.response.dto";
import { MatchesService } from "./matches.service";
import { TeamShotsController } from "./team-shots.controller";

describe("TeamShotsController", () => {
  let controller: TeamShotsController;
  let service: MatchesService;

  const mockMatchesService = { findShotsByTeamId: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      controllers: [TeamShotsController],
      providers: [
        { provide: MatchesService, useValue: mockMatchesService },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
        },
        CacheDedupService,
      ],
    }).compile();

    controller = module.get<TeamShotsController>(TeamShotsController);
    service = module.get<MatchesService>(MatchesService);

    jest.clearAllMocks();
  });

  it("is routed under /teams", () => {
    expect(Reflect.getMetadata("path", TeamShotsController)).toBe("teams");
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
});
