// src/backend/modules/organizations/clubs/clubs.controller.ts
import { ApiPaginatedResponse } from "@common/decorators";
import { ApiErrorResponseDto } from "@common/dto";
import { CACHE_TTL, PaginatedResponseDto } from "@common/index";
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
import {
  GetClubsQueryDto,
  GetClubStatsByDepartmentQueryDto,
} from "./dto/clubs.query.dto";
import {
  ClubBasicResponseDto,
  ClubDetailedResponseDto,
  ClubStatsByDepartmentDto,
  ClubStatsByRegionDto,
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
   * Retrieve club statistics grouped by region (league).
   *
   * This endpoint is CACHED because regional statistics change rarely.
   * Cache TTL: 10 minutes (600 seconds)
   *
   * @returns Array of club statistics by region
   *
   * @example
   * GET /clubs/stats/by-region
   * Response (after TransformInterceptor):
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "code": "84",
   *       "name": "League Auvergne-Rhône-Alpes",
   *       "clubCount": 42
   *     }
   *   ],
   *   "meta": { "count": 1 },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/clubs/stats/by-region",
   *   "statusCode": 200
   * }
   */
  @Get("stats/by-region")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.STATIC_DATA })) // Cache for 10 minutes
  @ApiOperation({
    summary: "Get club statistics by region",
    description:
      "Retrieves club counts aggregated by league. Results are cached for 10 minutes.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of club statistics by region",
    type: [ClubStatsByRegionDto],
    schema: {
      example: {
        data: [
          {
            id: 1,
            code: "84",
            name: "League Auvergne-Rhône-Alpes",
            clubCount: 42,
          },
        ],
        meta: { count: 1 },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/clubs/stats/by-region",
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ApiErrorResponseDto,
  })
  async getClubStatsByRegion(): Promise<ClubStatsByRegionDto[]> {
    return this.clubsService.getClubCountsByRegion();
  }

  /**
   * Retrieve club statistics grouped by department (committee).
   *
   * Optionally filter by league ID.
   * Cached for 5 minutes as department stats change occasionally.
   *
   * @param query - Query parameters with optional leagueId
   * @returns Array of club statistics by department
   *
   * @example
   * GET /clubs/stats/by-department?leagueId=1
   * Response (after TransformInterceptor):
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "name": "Comité de l'Ain",
   *       "department": {
   *         "id": 1,
   *         "name": "Ain",
   *         "code": "01"
   *       },
   *       "leagueId": 1,
   *       "clubCount": 15
   *     }
   *   ],
   *   "meta": { "count": 1 },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/clubs/stats/by-department",
   *   "statusCode": 200
   * }
   */
  @Get("stats/by-department")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA })) // Cache for 5 minutes
  @ApiOperation({
    summary: "Get club statistics by department",
    description:
      "Retrieves club counts aggregated by committee. Optionally filter by league. Results are cached for 5 minutes.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of club statistics by department",
    type: [ClubStatsByDepartmentDto],
    schema: {
      example: {
        data: [
          {
            id: 1,
            name: "Comité de l'Ain",
            department: {
              id: 1,
              name: "Ain",
              code: "01",
            },
            leagueId: 1,
            clubCount: 15,
          },
        ],
        meta: { count: 1 },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/clubs/stats/by-department?leagueId=1",
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid query parameters",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 400,
      message: ["League regionale ID must be a valid number string"],
      error: "Bad Request",
      path: "/api/clubs/stats/by-department?leagueId=abc",
      timestamp: "2024-02-05T10:00:00Z",
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ApiErrorResponseDto,
  })
  async getClubStatsByDepartment(
    @Query() query: GetClubStatsByDepartmentQueryDto,
  ): Promise<ClubStatsByDepartmentDto[]> {
    return this.clubsService.getClubCountsByDepartment(query.leagueId);
  }

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
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Flat list of all clubs",
    type: [ClubBasicResponseDto],
    schema: {
      example: {
        data: [
          {
            id: 1,
            name: "AS Monaco Basket",
            city: "Monaco",
            zipCode: "98000",
            latitude: 43.7384,
            longitude: 7.4246,
            email: "contact@club.com",
            phone: "0123456789",
            website: "https://club.com",
            committeeId: 1,
            leagueId: 1,
          },
        ],
        meta: { count: 1 },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/clubs/all",
        statusCode: 200,
      },
    },
  })
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
  @ApiPaginatedResponse(
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
    return this.clubsService.findClubsByFilters({
      level: query.level,
      committeeId: query.committeeId,
      leagueId: query.leagueId,
      category: query.category,
      gender: query.gender,
      search: query.search,
      page: query.page,
      limit: query.limit,
    });
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
   * Response (after TransformInterceptor):
   * {
   *   "data": {
   *     "id": 1,
   *     "name": "AS Monaco Basket",
   *     "city": "Monaco",
   *     "zipCode": "98000",
   *     "address": "1 Avenue des Papalins",
   *     "phone": "0123456789",
   *     "email": "contact@club.com",
   *     "website": "https://club.com",
   *     "teams": [...]
   *   },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/clubs/1",
   *   "statusCode": 200
   * }
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Club successfully retrieved",
    type: ClubDetailedResponseDto,
    schema: {
      example: {
        data: {
          id: 1,
          name: "AS Monaco Basket",
          city: "Monaco",
          zipCode: "98000",
          address: "1 Avenue des Papalins",
          phone: "0123456789",
          email: "contact@club.com",
          website: "https://club.com",
          teams: [],
        },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/clubs/1",
        statusCode: 200,
      },
    },
  })
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
    example: {
      statusCode: 400,
      message: "Validation failed (numeric string is expected)",
      error: "Bad Request",
      path: "/api/clubs/abc",
      timestamp: "2024-02-05T10:00:00Z",
    },
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
