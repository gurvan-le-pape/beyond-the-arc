// src/backend/modules/competitions/pools/pools.controller.ts
import { CACHE_TTL } from "@common/constants";
import { ApiEnvelopeList } from "@common/decorators";
import { CacheInterceptor } from "@common/interceptors";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { RecentPoolResponseDto } from "./dto/pools.response.dto";
import { PoolsService } from "./pools.service";

/**
 * Controller handling pool-related endpoints.
 * Serves the pools that played the most recent round. A championship's own
 * pools come with it, from GET /championships/:id.
 *
 * Global interceptors (registered in app.module.ts):
 * - TransformInterceptor: Wraps responses in standard format
 * - HttpMetricsInterceptor: Records the Prometheus request metrics
 *
 * Request logging is not an interceptor — nestjs-pino's autoLogging produces it.
 *
 * Route-specific interceptors:
 * - CacheInterceptor: Applied to the recent pools endpoint (short caching)
 */
@ApiTags("pools")
@Controller("pools")
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) {}

  /**
   * Retrieve the pools that played the most recent completed round.
   *
   * Short caching (1 minute): the answer moves whenever the scheduler
   * completes a new round.
   *
   * @returns Up to 10 pools with the matchday they played, most prominent first
   */
  @Get("recent")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.DYNAMIC_DATA }))
  @ApiOperation({
    summary: "Get pools that played the most recent round",
    description:
      "Retrieves up to 10 pools with a completed match at the latest tip-off instant, ordered by level (national, regional, departmental), then category (Seniors, then U21 down to U11), then division, then pool ID. Returns an empty array before any match is completed. Results are cached for 1 minute.",
  })
  @ApiEnvelopeList(
    RecentPoolResponseDto,
    "List of recent pools successfully retrieved (may be empty)",
  )
  async getRecentPools(): Promise<RecentPoolResponseDto[]> {
    return this.poolsService.findRecentPools();
  }
}
