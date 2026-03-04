// src/backend/modules/competitions/pools/pools.controller.ts
import { CACHE_TTL } from "@common/constants/cache-ttls";
import { CacheInterceptor } from "@common/interceptors/cache.interceptor";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { GetPoolsByChampionshipIdQueryDto } from "./dto/pools.query.dto";
import { PoolResponseDto } from "./dto/pools.response.dto";
import { PoolsService } from "./pools.service";

/**
 * Controller handling pool-related endpoints.
 * Provides access to pool data by championship and by ID.
 *
 * Global interceptors (applied in main.ts):
 * - LoggingInterceptor: Logs all requests/responses
 * - TransformInterceptor: Wraps responses in standard format
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
  @ApiQuery({
    name: "championshipId",
    required: true,
    type: Number,
    description: "Championship ID",
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of pools successfully retrieved",
    type: [PoolResponseDto],
    schema: {
      example: {
        data: [
          {
            id: 1,
            letter: "A",
            name: "Pool A - Seniors",
            championshipId: 1,
          },
          {
            id: 2,
            letter: "B",
            name: "Pool B - Seniors",
            championshipId: 1,
          },
        ],
        meta: { count: 2 },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/pools?championshipId=1",
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid query parameters",
    schema: {
      example: {
        statusCode: 400,
        message: ["championshipId must be a valid number string"],
        error: "BadRequestException",
        path: "/pools?championshipId=abc",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "No pools found for given championship",
    schema: {
      example: {
        statusCode: 404,
        message: "No pools found for championship ID 999",
        error: "NotFoundException",
        path: "/pools?championshipId=999",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  async getPoolsByChampionshipId(
    @Query() query: GetPoolsByChampionshipIdQueryDto,
  ): Promise<PoolResponseDto[]> {
    return this.poolsService.findPoolsByChampionshipId(query.championshipId);
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Pool successfully retrieved",
    type: PoolResponseDto,
    schema: {
      example: {
        data: {
          id: 1,
          letter: "A",
          name: "Pool A - Seniors",
          championshipId: 1,
        },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/pools/1",
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Pool not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Pool with ID 999 not found",
        error: "NotFoundException",
        path: "/pools/999",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    schema: {
      example: {
        statusCode: 400,
        message: "Validation failed (numeric string is expected)",
        error: "BadRequestException",
        path: "/pools/abc",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  async getPoolById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<PoolResponseDto> {
    return this.poolsService.findPoolById(id);
  }
}
