// src/backend/modules/competitions/championships/championships.controller.ts
import { CACHE_TTL } from "@common/constants";
import { ApiEnvelope, ApiEnvelopePage } from "@common/decorators";
import { ApiErrorResponseDto, PaginatedResponseDto } from "@common/dto";
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
  constructor(private readonly championshipsService: ChampionshipsService) {}

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
  @ApiEnvelope(ChampionshipResponseDto, "Championship successfully retrieved")
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Championship not found",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 404,
      message: "Championship with ID 999 not found",
      error: "Not Found",
      path: "/api/championships/999",
      timestamp: "2024-02-05T10:00:00Z",
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getChampionshipById(
    @Param("id", ParseEntityIdPipe) id: number,
  ): Promise<ChampionshipResponseDto> {
    return this.championshipsService.findChampionshipById(id);
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
   * GET /championships?level=regional&leagueId=1&category=U18&page=1&limit=20
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA }))
  @ApiOperation({
    summary: "Get championships",
    description:
      "Paginated, filtered list of championships. All parameters are optional — omitting them returns all championships across all levels.",
  })
  @ApiEnvelopePage(
    ChampionshipResponseDto,
    "Paginated list of championships successfully retrieved",
  )
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid query parameters",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 400,
      message: ["level must be a valid enum value"],
      error: "Bad Request",
      path: "/api/championships?level=invalid",
      timestamp: "2024-02-05T10:00:00Z",
    },
  })
  async getChampionships(
    @Query() query: GetChampionshipsQueryDto,
  ): Promise<PaginatedResponseDto<ChampionshipResponseDto>> {
    return this.championshipsService.findChampionships({
      level: query.level,
      leagueId: query.leagueId,
      committeeId: query.committeeId,
      category: query.category,
      gender: query.gender,
      page: query.page,
      limit: query.limit,
    });
  }
}
