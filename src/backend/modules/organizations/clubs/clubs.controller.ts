// src/backend/modules/organizations/clubs/clubs.controller.ts
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
 * Global interceptors (applied in module):
 * - LoggingInterceptor: Logs all requests/responses
 * - TransformInterceptor: Wraps responses in standard format
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
  @UseInterceptors(CacheInterceptor({ ttl: 600000 })) // Cache for 10 minutes
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
  @UseInterceptors(CacheInterceptor({ ttl: 300000 })) // Cache for 5 minutes
  @ApiOperation({
    summary: "Get club statistics by department",
    description:
      "Retrieves club counts aggregated by committee. Optionally filter by league. Results are cached for 5 minutes.",
  })
  @ApiQuery({
    name: "leagueId",
    required: false,
    type: Number,
    description: "Optional league ID to filter by",
    example: 1,
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
    schema: {
      example: {
        statusCode: 400,
        message: ["League regionale ID must be a valid number string"],
        error: "BadRequestException",
        path: "/clubs/stats/by-department?leagueId=abc",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async getClubStatsByDepartment(
    @Query() query: GetClubStatsByDepartmentQueryDto,
  ): Promise<ClubStatsByDepartmentDto[]> {
    return this.clubsService.getClubCountsByDepartment(query.leagueId);
  }

  /**
   * Retrieve all departments (committees) without filtering.
   *
   * This endpoint is CACHED because department data changes rarely.
   * Cache TTL: 5 minutes (300 seconds)
   *
   * @returns Array of all departments with club counts
   *
   * @example
   * GET /clubs/departments
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
   *       "region": {
   *         "id": 1
   *       },
   *       "clubCount": 15
   *     }
   *   ],
   *   "meta": { "count": 100 },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/clubs/departments",
   *   "statusCode": 200
   * }
   */
  @Get("departments")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: 300000 })) // Cache for 5 minutes
  @ApiOperation({
    summary: "Get all departments",
    description:
      "Retrieves all departments (committees) with their club counts and region information. Results are cached for 5 minutes.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of all departments",
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
            region: {
              id: 1,
            },
            clubCount: 15,
          },
        ],
        meta: { count: 100 },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/clubs/departments",
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async getAllDepartments(): Promise<ClubStatsByDepartmentDto[]> {
    return this.clubsService.getAllDepartments();
  }

  /**
   * Retrieve all clubs without any filtering.
   */
  @Get("all")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: 300000 })) // Cache for 5 minutes
  @ApiOperation({
    summary: "Get all clubs",
    description:
      "Retrieves all clubs without any filtering. Used for map initialization. Results are cached for 5 minutes.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of all clubs",
    type: [ClubBasicResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async getAllClubs(): Promise<ClubBasicResponseDto[]> {
    return this.clubsService.findClubsByFilters({});
  }

  /**
   * Retrieve clubs with optional filtering.
   *
   * Supports filtering by competition level, committee, league, category, and gender.
   * Cached for 3 minutes as club lists change occasionally.
   *
   * @param query - Query parameters for filtering
   * @returns Array of clubs matching the filters
   *
   * @example
   * GET /clubs?level=regional&committeeId=1&category=U18&gender=male
   * Response (after TransformInterceptor):
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "name": "AS Monaco Basket",
   *       "city": "Monaco",
   *       "zipCode": "98000",
   *       "latitude": 43.7384,
   *       "longitude": 7.4246,
   *       "email": "contact@club.com",
   *       "phone": "0123456789",
   *       "website": "https://club.com"
   *     }
   *   ],
   *   "meta": { "count": 1 },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/clubs",
   *   "statusCode": 200
   * }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: 180000 })) // Cache for 3 minutes
  @ApiOperation({
    summary: "Get clubs with filters",
    description:
      "Retrieves clubs filtered by competition level, committee, league, category, and gender. Results are cached for 3 minutes.",
  })
  @ApiQuery({
    name: "level",
    required: false,
    enum: ["regional", "departmental"],
    description: "Competition level",
    example: "regional",
  })
  @ApiQuery({
    name: "committeeId",
    required: false,
    type: Number,
    description: "Committee ID",
    example: 1,
  })
  @ApiQuery({
    name: "leagueId",
    required: false,
    type: Number,
    description: "League regionale ID",
    example: 1,
  })
  @ApiQuery({
    name: "category",
    required: false,
    description: "Category",
    example: "U18",
  })
  @ApiQuery({
    name: "gender",
    required: false,
    enum: ["male", "female"],
    description: "Gender",
    example: "male",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of clubs matching the filters",
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
          },
        ],
        meta: { count: 1 },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/clubs",
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
          "Level must be one of: regional, departmental",
          "Committee ID must be a valid number string",
        ],
        error: "BadRequestException",
        path: "/clubs?level=invalid&committeeId=abc",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async getClubs(
    @Query() query: GetClubsQueryDto,
  ): Promise<ClubBasicResponseDto[]> {
    return this.clubsService.findClubsByFilters({
      level: query.level,
      committeeId: query.committeeId,
      leagueId: query.leagueId,
      category: query.category,
      gender: query.gender,
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
    schema: {
      example: {
        statusCode: 404,
        message: "Club with ID 999 not found",
        error: "NotFoundException",
        path: "/clubs/999",
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
        path: "/clubs/abc",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
  })
  async getClubById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<ClubDetailedResponseDto> {
    return this.clubsService.findClubById(id);
  }
}
