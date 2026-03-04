// src/backend/modules/organizations/committees/committees.controller.ts
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

import { CommitteesService } from "./committees.service";
import { GetCommitteesQueryDto } from "./dto/committees.query.dto";
import { CommitteeResponseDto } from "./dto/committees.response.dto";

/**
 * Controller handling committee-related endpoints.
 * Provides access to departmental committees and their information.
 *
 * Global interceptors (applied in main.ts):
 * - LoggingInterceptor: Logs all requests/responses
 * - TransformInterceptor: Wraps responses in standard format
 *
 * Route-specific interceptors:
 * - CacheInterceptor: Applied to list endpoints
 */
@ApiTags("committees")
@Controller("committees")
export class CommitteesController {
  constructor(private readonly committeesService: CommitteesService) {}

  /**
   * Retrieve committees, optionally filtered by league.
   *
   * Moderate caching (5 minutes) because committees lists change
   * occasionally but not frequently.
   *
   * @param query - Query parameters containing optional leagueId
   * @returns Array of committees matching the criteria
   *
   * @example
   * GET /committees?leagueId=1
   * Response (after TransformInterceptor):
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "name": "Comité Departmental de l'Ain",
   *       "leagueId": 1,
   *       "department": {
   *         "id": 1,
   *         "name": "Ain",
   *         "code": "01"
   *       }
   *     }
   *   ],
   *   "meta": { "count": 1 },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/committees?leagueId=1",
   *   "statusCode": 200
   * }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA })) // Cache for 5 minutes
  @ApiOperation({
    summary: "Get committees (departmental committees)",
    description:
      "Retrieves committees, optionally filtered by league ID. If no filter is provided, returns all departmental committees. Results are cached for 5 minutes.",
  })
  @ApiQuery({
    name: "leagueId",
    required: false,
    type: Number,
    description: "Optional league ID to filter committees",
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of committees successfully retrieved",
    type: [CommitteeResponseDto],
    schema: {
      example: {
        data: [
          {
            id: 1,
            name: "Comité Departmental de l'Ain",
            leagueId: 1,
            department: {
              id: 1,
              name: "Ain",
              code: "01",
            },
          },
          {
            id: 2,
            name: "Comité Departmental de l'Aisne",
            leagueId: 1,
            department: {
              id: 2,
              name: "Aisne",
              code: "02",
            },
          },
        ],
        meta: { count: 2 },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/committees?leagueId=1",
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
        message: ["leagueId must be a valid number string"],
        error: "BadRequestException",
        path: "/committees?leagueId=abc",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "No committees found for given league",
    schema: {
      example: {
        statusCode: 404,
        message: "No committees found for league ID 999",
        error: "NotFoundException",
        path: "/committees?leagueId=999",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  async getCommittees(
    @Query() query: GetCommitteesQueryDto,
  ): Promise<CommitteeResponseDto[]> {
    if (query.leagueId !== undefined) {
      return this.committeesService.findCommitteesByLeague(query.leagueId);
    }

    return this.committeesService.findAllCommittees();
  }

  /**
   * Retrieve a single committee by its ID.
   *
   * No caching on this endpoint to ensure fresh data.
   *
   * @param id - The committee ID
   * @returns The committee details
   *
   * @example
   * GET /committees/1
   * Response (after TransformInterceptor):
   * {
   *   "data": {
   *     "id": 1,
   *     "name": "Comité Departmental de l'Ain",
   *     "leagueId": 1,
   *     "department": {
   *       "id": 1,
   *       "name": "Ain",
   *       "code": "01"
   *     }
   *   },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/committees/1",
   *   "statusCode": 200
   * }
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get committee by ID",
    description: "Retrieves detailed information about a specific committee",
  })
  @ApiParam({
    name: "id",
    description: "Committee ID",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Committee successfully retrieved",
    type: CommitteeResponseDto,
    schema: {
      example: {
        data: {
          id: 1,
          name: "Comité Departmental de l'Ain",
          leagueId: 1,
          department: {
            id: 1,
            name: "Ain",
            code: "01",
          },
        },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/committees/1",
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Committee not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Committee with ID 999 not found",
        error: "NotFoundException",
        path: "/committees/999",
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
        path: "/committees/abc",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  async getCommitteeById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<CommitteeResponseDto> {
    return this.committeesService.findCommitteeById(id);
  }
}
