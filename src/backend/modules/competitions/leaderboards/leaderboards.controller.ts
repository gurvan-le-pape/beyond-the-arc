// src/backend/modules/competitions/leaderboards/leaderboards.controller.ts
import { CACHE_TTL } from "@common/constants";
import { ApiEnvelope, ApiEnvelopeList } from "@common/decorators";
import { ApiErrorResponseDto } from "@common/dto";
import { CacheInterceptor } from "@common/interceptors";
import { ParseEntityIdPipe } from "@common/pipes";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { GetLeaderboardsQueryDto } from "./dto/leaderboards.query.dto";
import { LeaderboardResponseDto } from "./dto/leaderboards.response.dto";
import { LeaderboardsService } from "./leaderboards.service";

/**
 * Controller handling leaderboard-related endpoints.
 * Provides access to pool standings and rankings.
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
@ApiTags("leaderboards")
@Controller("leaderboards")
export class LeaderboardsController {
  constructor(private readonly leaderboardsService: LeaderboardsService) {}

  /**
   * Retrieve leaderboard entries for a specific pool.
   *
   * Moderate caching (5 minutes) because standings can change with each match.
   *
   * @param query - Query parameters containing poolId
   * @returns Array of leaderboard entries sorted by points and point difference
   *
   * @example
   * GET /leaderboards?poolId=1
   * Response (after TransformInterceptor):
   * {
   *   "data": [
   *     {
   *       "id": 1,
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
   *   "path": "/leaderboards?poolId=1",
   *   "statusCode": 200
   * }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA })) // Cache for 5 minutes
  @ApiOperation({
    summary: "Get leaderboards by pool ID",
    description:
      "Retrieves all leaderboard entries for a specific pool, sorted by points and point difference. Results are cached for 5 minutes.",
  })
  @ApiEnvelopeList(
    LeaderboardResponseDto,
    "List of leaderboard entries successfully retrieved",
  )
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid query parameters",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 400,
      message: ["poolId must be a valid number string"],
      error: "Bad Request",
      path: "/api/leaderboards?poolId=abc",
      timestamp: "2024-02-05T10:00:00Z",
    },
  })
  async getLeaderboardsByPoolId(
    @Query() query: GetLeaderboardsQueryDto,
  ): Promise<LeaderboardResponseDto[]> {
    return this.leaderboardsService.findLeaderboardsByPoolId(query.poolId);
  }

  /**
   * Retrieve a single leaderboard entry by its ID.
   *
   * No caching on this endpoint because it's rarely used
   * and the data may change frequently.
   *
   * @param id - The leaderboard entry ID
   * @returns The leaderboard entry details
   *
   * @example
   * GET /leaderboards/123
   * Response (after TransformInterceptor):
   * {
   *   "data": {
   *     "id": 123,
   *     "teamId": 5,
   *     "teamNumber": 1,
   *     "clubName": "AS Monaco Basket",
   *     "points": 12,
   *     "gamesPlayed": 8,
   *     "gamesWon": 6,
   *     "gamesLost": 2,
   *     "gamesForfeited": 0,
   *     "pointsFor": 645,
   *     "pointsAgainst": 580,
   *     "pointDifference": 65
   *   },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/leaderboards/123",
   *   "statusCode": 200
   * }
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get leaderboard entry by ID",
    description:
      "Retrieves detailed information about a specific leaderboard entry",
  })
  @ApiParam({
    name: "id",
    description: "Leaderboard entry ID",
    type: Number,
    example: 1,
  })
  @ApiEnvelope(
    LeaderboardResponseDto,
    "Leaderboard entry successfully retrieved",
  )
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Leaderboard entry not found",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 404,
      message: "Leaderboard entry with ID 999 not found",
      error: "Not Found",
      path: "/api/leaderboards/999",
      timestamp: "2024-02-05T10:00:00Z",
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getLeaderboardById(
    @Param("id", ParseEntityIdPipe) id: number,
  ): Promise<LeaderboardResponseDto> {
    return this.leaderboardsService.findLeaderboardById(id);
  }
}
