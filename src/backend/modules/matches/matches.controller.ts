// src/backend/modules/matches/matches.controller.ts
import { CACHE_TTL } from "@common/constants/cache-ttls";
import { PaginatedResponseDto } from "@common/dto/paginated-response.dto";
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

import { GetMatchesQueryDto } from "./dto/matches.query.dto";
import {
  MatchDetailResponseDto,
  MatchEventDto,
  MatchPlayerStatsResponseDto,
} from "./dto/matches.response.dto";
import { MatchesService } from "./matches.service";

/**
 * Controller handling match-related endpoints.
 * Provides access to match data, player statistics, and match events.
 *
 * Global interceptors (applied in main.ts):
 * - LoggingInterceptor: Logs all requests/responses
 * - TransformInterceptor: Wraps responses in standard format
 *
 * Route-specific interceptors:
 * - CacheInterceptor: Applied to list endpoint (moderate caching)
 */
@ApiTags("matches")
@Controller("matches")
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  /**
   * Retrieve all matches with optional filters and pagination.
   *
   * This endpoint supports extensive filtering by level, division, category,
   * gender, pool, championship, matchday, date, and club name search.
   *
   * Moderate caching (5 minutes) because match data changes occasionally.
   *
   * @param query - Query parameters for filtering and pagination
   * @returns Paginated list of matches
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA }))
  @ApiOperation({
    summary: "Get all matches with filters",
    description:
      "Retrieves a paginated list of matches with optional filtering by level, division, category, gender, and more. Results are cached for 5 minutes.",
  })
  @ApiQuery({
    name: "level",
    required: false,
    enum: ["regional", "departmental"],
    description: "Competition level",
    example: "regional",
  })
  @ApiQuery({
    name: "division",
    required: false,
    type: Number,
    description: "Filter by division",
    example: 1,
  })
  @ApiQuery({
    name: "committeeId",
    required: false,
    type: Number,
    description: "Filter by committee ID (for departmental level)",
    example: 1,
  })
  @ApiQuery({
    name: "leagueId",
    required: false,
    type: Number,
    description: "Filter by league ID (for regional level)",
    example: 1,
  })
  @ApiQuery({
    name: "category",
    required: false,
    type: String,
    description: "Filter by age category",
    example: "U18",
  })
  @ApiQuery({
    name: "gender",
    required: false,
    type: String,
    description: "Filter by gender",
    example: "M",
  })
  @ApiQuery({
    name: "poolId",
    required: false,
    type: Number,
    description: "Filter by pool ID",
    example: 1,
  })
  @ApiQuery({
    name: "championshipId",
    required: false,
    type: Number,
    description: "Filter by championship ID",
    example: 1,
  })
  @ApiQuery({
    name: "matchday",
    required: false,
    type: Number,
    description: "Filter by matchday number",
    example: 1,
  })
  @ApiQuery({
    name: "date",
    required: false,
    type: String,
    description: "Filter by date (YYYY-MM-DD)",
    example: "2024-02-05",
  })
  @ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search by club name (case-insensitive)",
    example: "Paris",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 50, max: 100)",
    example: 50,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of matches successfully retrieved",
    type: PaginatedResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid query parameters",
  })
  async getMatches(
    @Query() query: GetMatchesQueryDto,
  ): Promise<PaginatedResponseDto<MatchDetailResponseDto>> {
    return this.matchesService.findAllMatches({
      level: query.level,
      division: query.division,
      committeeId: query.committeeId,
      leagueId: query.leagueId,
      category: query.category,
      gender: query.gender,
      poolId: query.poolId,
      championshipId: query.championshipId,
      matchday: query.matchday,
      date: query.date,
      search: query.search,
      page: query.page ?? 1,
      limit: query.limit ?? 50,
    });
  }

  /**
   * Retrieve a single match by ID with full details.
   *
   * No caching because match details (like events) may change frequently.
   *
   * @param matchId - The match ID
   * @returns Match with full details including events
   */
  @Get(":matchId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get match by ID",
    description:
      "Retrieves detailed information about a specific match including teams, pool, and events",
  })
  @ApiParam({
    name: "matchId",
    description: "Match ID",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Match successfully retrieved",
    type: MatchDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Match not found",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
  })
  async getMatchById(
    @Param("matchId", ParseIntPipe) matchId: number,
  ): Promise<MatchDetailResponseDto> {
    return this.matchesService.findMatchById(matchId);
  }

  /**
   * Retrieve player statistics for a specific match.
   *
   * No caching because player stats may be updated after the match.
   *
   * @param matchId - The match ID
   * @returns Player statistics grouped by team
   */
  @Get(":matchId/player-stats")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get player stats for a match",
    description:
      "Retrieves all player statistics for a specific match, grouped by team",
  })
  @ApiParam({
    name: "matchId",
    description: "Match ID",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Player stats successfully retrieved",
    type: MatchPlayerStatsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Match not found",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
  })
  async getPlayerMatchStats(
    @Param("matchId", ParseIntPipe) matchId: number,
  ): Promise<MatchPlayerStatsResponseDto> {
    return this.matchesService.findPlayerMatchStatsByMatchId(matchId);
  }

  /**
   * Retrieve match events for a specific match.
   *
   * No caching because events may be added/updated after the match.
   *
   * @param matchId - The match ID
   * @returns Array of match events ordered by timestamp
   */
  @Get(":matchId/events")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get match events by match ID",
    description:
      "Retrieves all events (shots, fouls, etc.) for a specific match, ordered by timestamp",
  })
  @ApiParam({
    name: "matchId",
    description: "Match ID",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Match events successfully retrieved",
    type: [MatchEventDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
  })
  async getMatchEvents(
    @Param("matchId", ParseIntPipe) matchId: number,
  ): Promise<MatchEventDto[]> {
    return this.matchesService.findMatchEventsByMatchId(matchId);
  }

  /**
   * Retrieve all shot events for a team across all matches.
   *
   * No caching because new matches may be added.
   *
   * @param teamId - The team ID
   * @returns Array of shot events with locations
   */
  @Get("team/:teamId/events")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get shot events by team ID",
    description:
      "Retrieves all shot events with locations for a specific team across all their matches",
  })
  @ApiParam({
    name: "teamId",
    description: "Team ID",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Shot events successfully retrieved",
    type: [MatchEventDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
  })
  async getMatchEventsByTeamId(
    @Param("teamId", ParseIntPipe) teamId: number,
  ): Promise<MatchEventDto[]> {
    return this.matchesService.findMatchEventsByTeamId(teamId);
  }

  /**
   * Retrieve all shot events for a player across all matches.
   *
   * No caching because new matches may be added.
   *
   * @param playerId - The player ID
   * @returns Array of shot events with locations
   */
  @Get("player/:playerId/events")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get shot events by player ID",
    description:
      "Retrieves all shot events with locations for a specific player across all their matches",
  })
  @ApiParam({
    name: "playerId",
    description: "Player ID",
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Shot events successfully retrieved",
    type: [MatchEventDto],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
  })
  async getMatchEventsByPlayerId(
    @Param("playerId", ParseIntPipe) playerId: number,
  ): Promise<MatchEventDto[]> {
    return this.matchesService.findMatchEventsByPlayerId(playerId);
  }
}
