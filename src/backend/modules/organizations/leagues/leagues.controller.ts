// src/backend/modules/organizations/leagues/leagues.controller.ts
import { CACHE_TTL } from "@common/constants/cache-ttls";
import { CacheInterceptor } from "@common/interceptors/cache.interceptor";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { LeagueResponseDto } from "./dto/leagues.response.dto";
import { LeaguesService } from "./leagues.service";

/**
 * Controller handling league-related endpoints.
 * Provides access to regional leagues information.
 *
 * Global interceptors (applied in main.ts):
 * - LoggingInterceptor: Logs all requests/responses
 * - TransformInterceptor: Wraps responses in standard format
 *
 * Route-specific interceptors:
 * - CacheInterceptor: Applied to static/slow-changing endpoints
 */
@ApiTags("leagues")
@Controller("leagues")
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  /**
   * Retrieve all regional leagues.
   *
   * This endpoint is CACHED because leagues rarely change.
   * Cache TTL: 10 minutes (600 seconds)
   *
   * @returns Array of league objects with id and name
   *
   * @example
   * GET /leagues
   * Response (after TransformInterceptor):
   * {
   *   "data": [
   *     { "id": 1, "name": "League Auvergne-Rhône-Alpes" },
   *     { "id": 2, "name": "League Bourgogne-Franche-Comté" }
   *   ],
   *   "meta": { "count": 2 },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/leagues",
   *   "statusCode": 200
   * }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.STATIC_DATA })) // Cache for 10 minutes
  @ApiOperation({
    summary: "Get all regional leagues",
    description:
      "Retrieves a list of all regional leagues. Results are cached for 10 minutes as this data rarely changes.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of regional leagues successfully retrieved",
    type: [LeagueResponseDto],
    schema: {
      example: {
        data: [
          { id: 1, name: "League Auvergne-Rhône-Alpes" },
          { id: 2, name: "League Bourgogne-Franche-Comté" },
          { id: 3, name: "League Bretagne" },
        ],
        meta: { count: 3 },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/leagues",
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    schema: {
      example: {
        statusCode: 500,
        message: "Internal server error",
        error: "InternalServerErrorException",
        path: "/leagues",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  async getAllLeagues(): Promise<LeagueResponseDto[]> {
    return this.leaguesService.findAllLeagues();
  }

  /**
   * Retrieve a single league by its ID.
   *
   * No caching on this endpoint to ensure fresh data.
   *
   * @param id - The league ID
   * @returns The league details
   *
   * @example
   * GET /leagues/1
   * Response (after TransformInterceptor):
   * {
   *   "data": {
   *     "id": 1,
   *     "name": "League Auvergne-Rhône-Alpes"
   *   },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/leagues/1",
   *   "statusCode": 200
   * }
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get league by ID",
    description:
      "Retrieves detailed information about a specific regional league",
  })
  @ApiParam({
    name: "id",
    description: "League regionale ID",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "League successfully retrieved",
    type: LeagueResponseDto,
    schema: {
      example: {
        data: {
          id: 1,
          name: "League Auvergne-Rhône-Alpes",
        },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/leagues/1",
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "League not found",
    schema: {
      example: {
        statusCode: 404,
        message: "League with ID 999 not found",
        error: "NotFoundException",
        path: "/leagues/999",
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
        path: "/leagues/abc",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  async getLeagueById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<LeagueResponseDto> {
    return this.leaguesService.findLeagueById(id);
  }
}
