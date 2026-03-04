// src/backend/modules/competitions/championships/championships.controller.ts
import { CACHE_TTL } from "@common/constants/cache-ttls";
import { CompetitionLevel } from "@common/constants/competition-levels";
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

import { ChampionshipsService } from "./championships.service";
import { GetChampionshipsQueryDto } from "./dto/championships.query.dto";
import { ChampionshipResponseDto } from "./dto/championships.response.dto";

/**
 * Controller handling championship-related endpoints.
 * Provides access to divisions, regional, and departmental championships.
 *
 * Global interceptors (applied in module):
 * - LoggingInterceptor: Logs all requests/responses
 * - TransformInterceptor: Wraps responses in standard format
 *
 * Route-specific interceptors:
 * - CacheInterceptor: Applied to static endpoints (divisions)
 */
@ApiTags("championships")
@Controller("championships")
export class ChampionshipsController {
  constructor(private readonly championshipService: ChampionshipsService) {}

  /**
   * Retrieve all available divisions for championships.
   *
   * This endpoint is CACHED because divisions rarely change.
   * Cache TTL: 10 minutes (600 seconds)
   *
   * @returns Array of division objects with id and name
   *
   * @example
   * GET /championships/divisions
   * Response (after TransformInterceptor):
   * {
   *   "data": [
   *     { "id": 1, "name": "Nationale 1" },
   *     { "id": 2, "name": "Nationale 2" }
   *   ],
   *   "meta": { "count": 2 },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/championships/divisions",
   *   "statusCode": 200
   * }
   */
  @Get("divisions")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.STATIC_DATA })) // Cache for 10 minutes
  @ApiOperation({
    summary: "Get all divisions",
    description:
      "Retrieves a distinct list of all available championship divisions as numbers. Results are cached for 10 minutes.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of division numbers successfully retrieved",
    schema: {
      example: {
        data: [1, 2, 3],
        meta: { count: 3 },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/championships/divisions",
        statusCode: 200,
      },
      type: "array",
      items: { type: "number" },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async getDivisions(): Promise<number[]> {
    return this.championshipService.findAllDivisions();
  }

  /**
   * Retrieve a single championship by its ID.
   *
   * No caching on this endpoint because championship details may change
   * (scores, status, etc.)
   *
   * @param id - The championship ID
   * @returns The championship details
   *
   * @example
   * GET /championships/123
   * Response (after TransformInterceptor):
   * {
   *   "data": {
   *     "id": 123,
   *     "name": "Championship Régional U18",
   *     "category": "U18",
   *     "gender": "male",
   *     "seasonYear": "2024-2025",
   *     "level": "regional",
   *     "division": "Régionale 1"
   *   },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/championships/123",
   *   "statusCode": 200
   * }
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get championship by ID",
    description: "Retrieves detailed information about a specific championship",
  })
  @ApiParam({
    name: "id",
    description: "Championship ID",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Championship successfully retrieved",
    type: ChampionshipResponseDto,
    schema: {
      example: {
        data: {
          id: 1,
          name: "Championship Régional U18 male",
          category: "U18",
          gender: "male",
          seasonYear: "2024-2025",
          level: "regional",
          division: "Régionale 1",
        },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/championships/1",
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Championship not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Championship with ID 999 not found",
        error: "NotFoundException",
        path: "/championships/999",
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
        path: "/championships/abc",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  async getChampionshipById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ChampionshipResponseDto> {
    return this.championshipService.findChampionshipById(id);
  }

  /**
   * Retrieve championships by competition level and associated ID.
   *
   * Moderate caching (5 minutes) because championships lists change
   * occasionally but not frequently.
   *
   * @param query - Query parameters containing level and id
   * @returns Array of championships matching the criteria
   *
   * @example
   * GET /championships?level=regional&id=1
   * Response (after TransformInterceptor):
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "name": "Championship Régional U18",
   *       "category": "U18",
   *       "gender": "male",
   *       "seasonYear": "2024-2025",
   *       "level": "regional",
   *       "division": "Régionale 1"
   *     },
   *     {
   *       "id": 2,
   *       "name": "Championship Régional Senior",
   *       "category": "Senior",
   *       "gender": "female",
   *       "seasonYear": "2024-2025",
   *       "level": "regional",
   *       "division": "Régionale 2"
   *     }
   *   ],
   *   "meta": { "count": 2 },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/championships?level=regional&id=1",
   *   "statusCode": 200
   * }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA })) // Cache for 5 minutes
  @ApiOperation({
    summary: "Get championships by level and ID",
    description:
      "Retrieves championships filtered by competition level (regional or departmental) and associated league/committee ID. Results are cached for 5 minutes.",
  })
  @ApiQuery({
    name: "level",
    required: true,
    enum: [CompetitionLevel.REGIONAL, CompetitionLevel.DEPARTMENTAL],
    description: "Competition level",
    example: CompetitionLevel.REGIONAL,
  })
  @ApiQuery({
    name: "id",
    required: true,
    type: Number,
    description: "League ID (for regional) or Committee ID (for departmental)",
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of championships successfully retrieved",
    type: [ChampionshipResponseDto],
    schema: {
      example: {
        data: [
          {
            id: 1,
            name: "Championship Régional U18 male",
            category: "U18",
            gender: "male",
            seasonYear: "2024-2025",
            level: "regional",
            division: "Régionale 1",
          },
          {
            id: 2,
            name: "Championship Régional Senior female",
            category: "Senior",
            gender: "female",
            seasonYear: "2024-2025",
            level: "regional",
            division: "Régionale 2",
          },
        ],
        meta: { count: 2 },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/championships?level=regional&id=1",
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
        message: [
          'level must be either "regional" or "departmental"',
          "ID must be a valid number string",
        ],
        error: "BadRequestException",
        path: "/championships?level=invalid&id=abc",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "No championships found for given criteria",
    schema: {
      oneOf: [
        {
          properties: {
            statusCode: { type: "number", example: 404 },
            message: {
              type: "string",
              example: "No regional championships found for league ID 999",
            },
            error: { type: "string", example: "NotFoundException" },
            path: {
              type: "string",
              example: "/championships?level=regional&id=999",
            },
            timestamp: { type: "string", example: "2024-02-05T10:00:00Z" },
          },
        },
        {
          properties: {
            statusCode: { type: "number", example: 404 },
            message: {
              type: "string",
              example:
                "No departmental championships found for committee ID 999",
            },
            error: { type: "string", example: "NotFoundException" },
            path: {
              type: "string",
              example: "/championships?level=departmental&id=999",
            },
            timestamp: { type: "string", example: "2024-02-05T10:00:00Z" },
          },
        },
      ],
    },
  })
  async getChampionships(@Query() query: GetChampionshipsQueryDto) {
    return this.championshipService.findChampionshipsByLevel(
      query.level,
      query.id,
    );
  }
}
