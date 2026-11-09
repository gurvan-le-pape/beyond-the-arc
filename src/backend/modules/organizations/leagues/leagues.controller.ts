// src/backend/modules/organizations/leagues/leagues.controller.ts
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
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { LeagueResponseDto } from "./dto/leagues.response.dto";
import { LeaguesService } from "./leagues.service";

/**
 * Controller handling league-related endpoints.
 * Provides access to regional leagues information.
 */
@ApiTags("leagues")
@Controller("leagues")
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  /**
   * Retrieve all regional leagues.
   *
   * This endpoint is CACHED because leagues rarely change.
   *
   * @returns Array of league objects with id and name
   *
   * @example
   * GET /leagues
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.STATIC_DATA }))
  @ApiOperation({
    summary: "Get all regional leagues",
    description:
      "Retrieves a list of all regional leagues. Results are cached for 10 minutes as this data rarely changes.",
  })
  @ApiEnvelopeList(
    LeagueResponseDto,
    "List of regional leagues successfully retrieved",
  )
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Internal server error",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 500,
      message: "Internal server error",
      error: "Internal Server Error",
      path: "/api/leagues",
      timestamp: "2024-02-05T10:00:00Z",
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
  @ApiEnvelope(LeagueResponseDto, "League successfully retrieved")
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "League not found",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 404,
      message: "League with ID 999 not found",
      error: "Not Found",
      path: "/api/leagues/999",
      timestamp: "2024-02-05T10:00:00Z",
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getLeagueById(
    @Param("id", ParseEntityIdPipe) id: number,
  ): Promise<LeagueResponseDto> {
    return this.leaguesService.findLeagueById(id);
  }
}
