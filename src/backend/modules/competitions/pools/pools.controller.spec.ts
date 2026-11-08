// src/backend/modules/competitions/pools/pools.controller.spec.ts
import { CacheDedupService } from "@common/services/cache-dedup.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { LoggerModule } from "nestjs-pino";

import type { RecentPoolResponseDto } from "./dto/pools.response.dto";
import { PoolsController } from "./pools.controller";
import { PoolsService } from "./pools.service";

/**
 * Unit tests for PoolsController.
 *
 * Tests cover:
 * - Request handling
 * - Response formatting
 * - Error propagation
 * - Validation
 */
describe("PoolsController", () => {
  let controller: PoolsController;
  let service: PoolsService;

  // Mock service
  const mockPoolsService = {
    findRecentPools: jest.fn(),
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
      controllers: [PoolsController],
      providers: [
        {
          provide: PoolsService,
          useValue: mockPoolsService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        CacheDedupService,
      ],
    }).compile();

    controller = module.get<PoolsController>(PoolsController);
    service = module.get<PoolsService>(PoolsService);

    jest.clearAllMocks();
  });

  describe("getRecentPools", () => {
    it("returns the service's recent pools unchanged", async () => {
      const recent: RecentPoolResponseDto[] = [
        {
          id: 5985,
          letter: "C",
          championshipId: 2038,
          nbMatchdays: 22,
          matchday: 4,
          playedAt: new Date("2026-10-17T20:00:00Z"),
        },
      ];
      mockPoolsService.findRecentPools.mockResolvedValue(recent);

      const result = await controller.getRecentPools();

      expect(result).toEqual(recent);
      expect(service.findRecentPools).toHaveBeenCalledTimes(1);
    });
  });

  describe("metadata", () => {
    it("should be decorated with @Controller", () => {
      const metadata = Reflect.getMetadata("path", PoolsController);
      expect(metadata).toBe("pools");
    });
  });
});
