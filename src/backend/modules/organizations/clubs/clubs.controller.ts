// src/backend/modules/organizations/clubs/clubs.controller.ts
import { CACHE_TTL } from "@common/constants";
import {
  ApiEnvelope,
  ApiEnvelopeList,
  ApiEnvelopePage,
} from "@common/decorators";
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

import { ClubsService } from "./clubs.service";
import { GetClubsQueryDto } from "./dto/clubs.query.dto";
import {
  ClubBasicResponseDto,
  ClubDetailedResponseDto,
} from "./dto/clubs.response.dto";

/**
 * Controller handling club-related endpoints.
 * Provides access to club statistics, filtering, and detailed information.
 *
 * Global interceptors (registered in app.module.ts):
 * - TransformInterceptor: Wraps responses in standard format
 * - HttpMetricsInterceptor: Records the Prometheus request metrics
 *
 * Request logging is not an interceptor — nestjs-pino's autoLogging produces it.
 *
 * Route-specific interceptors:
 * - CacheInterceptor: Applied to static/slow-changing endpoints
 */
@ApiTags("clubs")
@Controller("clubs")
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  /**
   * Retrieve all clubs without any filtering.
   * Used for map initialization where all club coordinates are needed at once.
   *
   * Cached for 5 minutes as club data changes occasionally.
   *
   * @returns Flat array of all clubs
   *
   * @example
   * GET /clubs/all
   */
  @Get("all")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA }))
  @ApiOperation({
    summary: "Get all clubs without filtering",
    description:
      "Retrieves all clubs without any filtering or pagination. Intended for map initialization where all club coordinates are needed at once. Results are cached for 5 minutes.",
  })
  @ApiEnvelopeList(ClubBasicResponseDto, "Flat list of all clubs")
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ApiErrorResponseDto,
  })
  async getAllClubs(): Promise<ClubBasicResponseDto[]> {
    return this.clubsService.findAllClubs();
  }

  /**
   * Retrieve clubs with optional filtering and pagination.
   *
   * Supports filtering by competition level, committee, league, category, gender,
   * and name search. Results are paginated (default: page 1, limit 50).
   * Cached for 3 minutes as club lists change occasionally.
   *
   * @param query - Query parameters for filtering and pagination
   * @returns Paginated list of clubs matching the filters
   *
   * @example
   * GET /clubs?level=regional&leagueId=1&category=U18&gender=male&page=1&limit=50
   * GET /clubs?search=monaco&committeeId=1
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA })) // Cache for 5 minutes
  @ApiOperation({
    summary: "Get clubs with filters and pagination",
    description:
      "Retrieves clubs filtered by competition level, committee, league, category, gender, and name search. Supports pagination via page and limit parameters. Results are cached for 3 minutes.",
  })
  @ApiEnvelopePage(
    ClubBasicResponseDto,
    "Paginated list of clubs matching the filters",
  )
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid query parameters",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 400,
      message: [
        "Level must be one of: regional, departmental",
        "committeeId must be a number",
        "page must not be less than 1",
      ],
      error: "Bad Request",
      path: "/api/clubs?level=invalid&committeeId=abc",
      timestamp: "2024-02-05T10:00:00Z",
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ApiErrorResponseDto,
  })
  async getClubs(
    @Query() query: GetClubsQueryDto,
  ): Promise<PaginatedResponseDto<ClubBasicResponseDto>> {
    return this.clubsService.findClubsByFilters(query);
  }

  /**
   * Retrieve a single club by its ID with detailed information.
   *
   * No caching on this endpoint because club details may change.
   * Includes full team information with pool, championship, and leaderboard data.
   *
   * @param id - The club ID
   * @returns Detailed club information
   *
   * @example
   * GET /clubs/1
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get club by ID",
    description:
      "Retrieves detailed information about a specific club including all teams, pools, and leaderboard data",
  })
  @ApiParam({
    name: "id",
    description: "Club ID",
    type: Number,
    example: 1,
  })
  @ApiEnvelope(ClubDetailedResponseDto, "Club successfully retrieved")
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Club not found",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 404,
      message: "Club with ID 999 not found",
      error: "Not Found",
      path: "/api/clubs/999",
      timestamp: "2024-02-05T10:00:00Z",
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ApiErrorResponseDto,
  })
  async getClubById(
    @Param("id", ParseEntityIdPipe) id: number,
  ): Promise<ClubDetailedResponseDto> {
    return this.clubsService.findClubById(id);
  }
}
