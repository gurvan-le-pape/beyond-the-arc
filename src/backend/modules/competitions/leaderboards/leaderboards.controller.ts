// src/backend/modules/competitions/leaderboards/leaderboards.controller.ts
import { CACHE_TTL } from "@common/constants";
import { ApiEnvelopeList } from "@common/decorators";
import { ApiErrorResponseDto } from "@common/dto";
import { CacheInterceptor } from "@common/interceptors";
import { ParseEntityIdPipe } from "@common/pipes";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { LeaderboardResponseDto } from "./dto/leaderboards.response.dto";
import { LeaderboardsService } from "./leaderboards.service";

/**
 * A pool's standings, served under the pool as `/pools/:poolId/leaderboard`.
 * The route lives in this module because the leaderboards service owns the
 * ranking; only its URL sits under `pools`.
 *
 * Global interceptors (registered in app.module.ts):
 * - TransformInterceptor: Wraps responses in standard format
 * - HttpMetricsInterceptor: Records the Prometheus request metrics
 *
 * Request logging is not an interceptor — nestjs-pino's autoLogging produces it.
 *
 * Route-specific interceptors:
 * - CacheInterceptor: Applied to leaderboard endpoints (standings change moderately)
 */
@ApiTags("pools")
@Controller("pools")
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  /**
   * Retrieve leaderboard entries for a specific pool.
   *
   * Moderate caching because standings can change with each match.
   *
   * @param poolId - The pool whose standings to return
   * @returns Array of leaderboard entries sorted by points and point difference
   *
   * @example
   * GET /pools/1/leaderboard
   * Response (after TransformInterceptor):
   * {
   *   "data": [
   *     {
   *       "teamId": 5,
   *       "teamNumber": 1,
   *       "clubName": "AS Monaco Basket",
   *       "points": 12,
   *       "gamesPlayed": 8,
   *       "gamesWon": 6,
   *       "gamesLost": 2,
   *       "gamesForfeited": 0,
   *       "pointsFor": 645,
   *       "pointsAgainst": 580,
   *       "pointDifference": 65
   *     }
   *   ],
   *   "meta": { "count": 10 },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/pools/1/leaderboard",
   *   "statusCode": 200
   * }
   */
  @Get(":poolId/leaderboard")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA }))
  @ApiOperation({
    summary: "Get a pool's standings",
    description:
      "Retrieves all leaderboard entries for a pool, sorted by points and point difference. An unknown pool returns an empty list. Results are cached for 5 minutes.",
  })
  @ApiParam({
    name: "poolId",
    description: "Pool ID",
    type: Number,
    example: 1,
  })
  @ApiEnvelopeList(
    LeaderboardResponseDto,
    "List of leaderboard entries successfully retrieved",
  )
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getLeaderboardsByPoolId(
    @Param("poolId", ParseEntityIdPipe) poolId: number,
  ): Promise<LeaderboardResponseDto[]> {
    return this.leaderboardsService.findLeaderboardsByPoolId(poolId);
  }
}
