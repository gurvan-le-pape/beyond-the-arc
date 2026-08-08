// src/backend/modules/competitions/championships/championships.controller.ts
import { CACHE_TTL, CompetitionLevel } from "@common/constants";
import { ApiPaginatedResponse } from "@common/decorators";
import { PaginatedResponseDto } from "@common/dto";
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
 * Global interceptors (registered in app.module.ts):
 * - TransformInterceptor: Wraps responses in standard format
 * - HttpMetricsInterceptor: Records the Prometheus request metrics
 *
 * Request logging is not an interceptor — nestjs-pino's autoLogging produces it.
 *
 * Route-specific interceptors:
 * - CacheInterceptor: Applied to static endpoints (divisions)
 */
@ApiTags("championships")
@Controller("championships")
export class ChampionshipsController {
  constructor(private readonly championshipService: ChampionshipsService) {}

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
    @Param("id", ParseEntityIdPipe) id: number,
  ): Promise<ChampionshipResponseDto> {
    return this.championshipService.findChampionshipById(id);
  }

  /**
   * Retrieve championships with optional filters and pagination.
   *
   * @param query - Optional filter and pagination parameters
   * @returns Paginated list of championships matching the criteria
   *
   * @example
   * // All championships, first page
   * GET /championships
   *
   * @example
   * // Regional championships for league 1, filtered by category
   * GET /championships?level=regional&id=1&category=U18&page=1&limit=20
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA }))
  @ApiOperation({
    summary: "Get championships",
    description:
      "Paginated, filtered list of championships. All parameters are optional — omitting them returns all championships across all levels.",
  })
  @ApiQuery({
    name: "level",
    required: false,
    enum: CompetitionLevel,
    description: "Competition level filter.",
    example: CompetitionLevel.REGIONAL,
  })
  @ApiQuery({
    name: "id",
    required: false,
    type: Number,
    description: "League ID (for regional) or Committee ID (for departmental).",
    example: 1,
  })
  @ApiQuery({
    name: "category",
    required: false,
    type: String,
    description: "Age category filter.",
    example: "U18",
  })
  @ApiQuery({
    name: "gender",
    required: false,
    type: String,
    description: "Gender filter.",
    example: "male",
  })
  @ApiPaginatedResponse(
    ChampionshipResponseDto,
    "Paginated list of championships successfully retrieved",
  )
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid query parameters",
    schema: {
      example: {
        statusCode: 400,
        message: ["level must be a valid enum value"],
        error: "BadRequestException",
        path: "/championships?level=invalid",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  async getChampionships(
    @Query() query: GetChampionshipsQueryDto,
  ): Promise<PaginatedResponseDto<ChampionshipResponseDto>> {
    return this.championshipService.findChampionships({
      level: query.level,
      id: query.id,
      category: query.category,
      gender: query.gender,
      page: query.page,
      limit: query.limit,
    });
  }
}
