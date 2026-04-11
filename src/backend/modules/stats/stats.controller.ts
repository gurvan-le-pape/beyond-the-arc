// src/backend/modules/stats/stats.controller.ts
import { CACHE_TTL } from "@common/constants/cache-ttls";
import { CacheInterceptor } from "@common/interceptors/cache.interceptor";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { StatsResponseDto } from "./dto/stats.response.dto";
import { StatsService } from "./stats.service";

/**
 * Controller exposing platform-wide statistics.
 * Cached at DYNAMIC_DATA (60s) since match counts change frequently
 * during weekends while remaining cheap to recompute.
 */
@ApiTags("stats")
@Controller("stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  /**
   * Retrieve platform-wide entity counts.
   *
   * Cached for 60 seconds — matches change frequently on weekends
   * but the query is cheap enough to recompute often.
   *
   * @returns Counts for clubs, teams, players, matches, leagues, committees
   *
   * @example
   * GET /stats
   * Response:
   * {
   *   "data": {
   *     "clubs": 840,
   *     "teams": 3200,
   *     "players": 12400,
   *     "matches": 48000,
   *     "leagues": 26,
   *     "committees": 95
   *   },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/stats",
   *   "statusCode": 200
   * }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.DYNAMIC_DATA }))
  @ApiOperation({
    summary: "Get platform statistics",
    description: "Returns platform-wide entity counts. Cached for 60 seconds.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Statistics successfully retrieved",
    type: StatsResponseDto,
    schema: {
      example: {
        data: {
          clubs: 840,
          teams: 3200,
          players: 12400,
          matches: 48000,
          leagues: 26,
          committees: 95,
        },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/stats",
        statusCode: 200,
      },
    },
  })
  async getStats(): Promise<StatsResponseDto> {
    return this.statsService.getStats();
  }
}
