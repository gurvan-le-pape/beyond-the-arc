// src/backend/modules/players/players.controller.ts
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

import { GetPlayersQueryDto } from "./dto/players.query.dto";
import {
  PlayerMatchHistoryResponseDto,
  PlayerResponseDto,
} from "./dto/players.response.dto";
import { PlayersService } from "./players.service";

/**
 * Controller handling player-related endpoints.
 * Provides access to player data, filtering, and match history.
 */
@ApiTags("players")
@Controller("players")
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  /**
   * Retrieve all players with optional filters and pagination.
   *
   * Moderate caching (5 minutes) because player rosters change occasionally.
   *
   * @param query - Query parameters for filtering and pagination
   * @returns Paginated list of players
   *
   * @example
   * GET /players?level=regional&leagueId=1&category=U18&page=1&limit=20
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA }))
  @ApiOperation({
    summary: "Get all players with filters",
    description:
      "Retrieves a paginated list of players with optional filtering by level, club, team, category, gender, and more. Results are cached for 5 minutes.",
  })
  @ApiEnvelopePage(PlayerResponseDto, "List of players successfully retrieved")
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid query parameters",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 400,
      message: [
        'level must be either "regional" or "departmental"',
        "clubId must be a valid number",
      ],
      error: "Bad Request",
      path: "/api/players?level=invalid&clubId=abc",
      timestamp: "2024-02-05T10:00:00Z",
    },
  })
  async getPlayers(
    @Query() query: GetPlayersQueryDto,
  ): Promise<PaginatedResponseDto<PlayerResponseDto>> {
    return this.playersService.findAllPlayers(query);
  }

  /**
   * Retrieve a single player by ID with full details.
   *
   * No caching because player details may change frequently.
   *
   * @param id - The player ID
   * @returns Player with full details including team
   *
   * @example
   * GET /players/123
   */
  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get player by ID",
    description:
      "Retrieves detailed information about a specific player including team information",
  })
  @ApiParam({
    name: "id",
    description: "Player ID",
    type: Number,
    example: 1,
  })
  @ApiEnvelope(PlayerResponseDto, "Player successfully retrieved")
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Player not found",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 404,
      message: "Player with ID 999 not found",
      error: "Not Found",
      path: "/api/players/999",
      timestamp: "2024-02-05T10:00:00Z",
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getPlayerById(
    @Param("id", ParseEntityIdPipe) id: number,
  ): Promise<PlayerResponseDto> {
    return this.playersService.findPlayerById(id);
  }

  /**
   * Retrieve match history for a specific player.
   *
   * Returns all matches the player has participated in with their statistics.
   * Ordered by date (most recent first).
   *
   * No caching because match data changes frequently.
   *
   * @param id - The player ID
   * @returns Array of match history entries
   *
   * @example
   * GET /players/123/matches
   */
  @Get(":id/matches")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get player match history",
    description:
      "Retrieves all matches for a specific player with their statistics, ordered by date (most recent first)",
  })
  @ApiParam({
    name: "id",
    description: "Player ID",
    type: Number,
    example: 1,
  })
  @ApiEnvelope(
    PlayerMatchHistoryResponseDto,
    "Match history successfully retrieved",
  )
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Player not found",
    type: ApiErrorResponseDto,
    example: {
      statusCode: 404,
      message: "Player with ID 999 not found",
      error: "Not Found",
      path: "/api/players/999/matches",
      timestamp: "2024-02-05T10:00:00Z",
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getPlayerMatchHistory(
    @Param("id", ParseEntityIdPipe) id: number,
  ): Promise<PlayerMatchHistoryResponseDto> {
    return this.playersService.findPlayerMatchHistory(id);
  }
}
