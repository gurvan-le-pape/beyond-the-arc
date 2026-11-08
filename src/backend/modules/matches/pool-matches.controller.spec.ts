// src/backend/modules/matches/pool-matches.controller.spec.ts
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";

import type { MatchDetailResponseDto } from "./dto/matches.response.dto";
import { MatchesService } from "./matches.service";
import { PoolMatchesController } from "./pool-matches.controller";

describe("PoolMatchesController", () => {
  let controller: PoolMatchesController;
  let service: MatchesService;

  const mockMatchesService = { findMatchesByPoolId: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      controllers: [PoolMatchesController],
      providers: [
        { provide: MatchesService, useValue: mockMatchesService },
        {
          provide: CACHE_MANAGER,
          useValue: { get: jest.fn(), set: jest.fn(), del: jest.fn() },
        },
        CacheDedupService,
      ],
    }).compile();

    controller = module.get<PoolMatchesController>(PoolMatchesController);
    service = module.get<MatchesService>(MatchesService);

    jest.clearAllMocks();
  });

  it("is routed under /pools", () => {
    expect(Reflect.getMetadata("path", PoolMatchesController)).toBe("pools");
  });

  describe("getMatchesByPoolId", () => {
    it("should return matches for a pool", async () => {
      const mockMatches: MatchDetailResponseDto[] = [
        {
          id: 1,
          matchday: 1,
          startsAt: new Date("2024-01-01"),
          status: "completed",
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
});
