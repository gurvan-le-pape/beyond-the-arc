// src/backend/modules/competitions/pools/pools.controller.ts
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

import { GetPoolsByChampionshipIdQueryDto } from "./dto/pools.query.dto";
import {
  PoolResponseDto,
  RecentPoolResponseDto,
} from "./dto/pools.response.dto";
import { PoolsService } from "./pools.service";

/**
 * Controller handling pool-related endpoints.
 * Provides access to pool data by championship and by ID.
 *
 * Global interceptors (registered in app.module.ts):
 * - TransformInterceptor: Wraps responses in standard format
 * - HttpMetricsInterceptor: Records the Prometheus request metrics
 *
 * Request logging is not an interceptor — nestjs-pino's autoLogging produces it.
 *
 * Route-specific interceptors:
 * - CacheInterceptor: Applied to pool list endpoint (moderate caching)
 */
@ApiTags("pools")
@Controller("pools")
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) {}

  /**
   * Retrieve all pools for a specific championship.
   *
   * Moderate caching (5 minutes) because pools change occasionally
   * but not frequently during a season.
   *
   * @param query - Query parameters containing championshipId
   * @returns Array of pools for the championship
   *
   * @example
   * GET /pools?championshipId=1
   * Response (after TransformInterceptor):
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "letter": "A",
   *       "name": "Pool A - Seniors",
   *       "championshipId": 1
   *     },
   *     {
   *       "id": 2,
   *       "letter": "B",
   *       "name": "Pool B - Seniors",
   *       "championshipId": 1
   *     }
   *   ],
   *   "meta": { "count": 2 },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/pools?championshipId=1",
   *   "statusCode": 200
   * }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA })) // Cache for 5 minutes
  @ApiOperation({
    summary: "Get pools by championship ID",
    description:
      "Retrieves all pools for a specific championship. Results are cached for 5 minutes.",
  })
  @ApiEnvelopeList(
    PoolResponseDto,
    "List of pools successfully retrieved (may be empty)",
  )
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid query parameters",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 400,
      message: ["championshipId must be a valid number string"],
      error: "Bad Request",
      path: "/api/pools?championshipId=abc",
      timestamp: "2024-02-05T10:00:00Z",
    },
  })
  async getPoolsByChampionshipId(
    @Query() query: GetPoolsByChampionshipIdQueryDto,
  ): Promise<PoolResponseDto[]> {
    return this.poolsService.findPoolsByChampionshipId(query.championshipId);
  }

  /**
   * Retrieve the pools that played the most recent completed round.
   *
   * Short caching (1 minute): the answer moves whenever the scheduler
   * completes a new round. Declared before `:id`, which would otherwise
   * capture `recent` and reject it as an invalid id.
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

  /**
   * Retrieve a single pool by its ID.
   *
   * No caching on this endpoint because individual pool data
   * is rarely accessed and may change.
   *
   * @param id - The pool ID
   * @returns The pool details
   *
   * @example
   * GET /pools/123
   * Response (after TransformInterceptor):
   * {
   *   "data": {
   *     "id": 123,
   *     "letter": "A",
   *     "name": "Pool A - Seniors",
   *     "championshipId": 1
   *   },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/pools/123",
   *   "statusCode": 200
   * }
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get pool by ID",
    description: "Retrieves detailed information about a specific pool",
  })
  @ApiParam({
    name: "id",
    description: "Pool ID",
    type: Number,
    example: 1,
  })
  @ApiEnvelope(PoolResponseDto, "Pool successfully retrieved")
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Pool not found",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 404,
      message: "Pool with ID 999 not found",
      error: "Not Found",
      path: "/api/pools/999",
      timestamp: "2024-02-05T10:00:00Z",
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getPoolById(
    @Param("id", ParseEntityIdPipe) id: number,
  ): Promise<PoolResponseDto> {
    return this.poolsService.findPoolById(id);
  }
}
