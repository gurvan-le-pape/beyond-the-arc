// src/backend/modules/matches/matches.controller.ts
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

import { GetMatchesQueryDto } from "./dto/matches.query.dto";
import {
  MatchDetailResponseDto,
  MatchEventDto,
  MatchPlayerStatsResponseDto,
  MatchResponseDto,
} from "./dto/matches.response.dto";
import { MatchesService } from "./matches.service";

/**
 * Controller handling match-related endpoints.
 * Provides access to match data, player statistics, and match events.
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
  @ApiEnvelopePage(MatchResponseDto, "List of matches successfully retrieved")
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid query parameters",
    type: ApiErrorResponseDto,
  })
  async getMatches(
    @Query() query: GetMatchesQueryDto,
  ): Promise<PaginatedResponseDto<MatchResponseDto>> {
    return this.matchesService.findAllMatches(query);
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
  @ApiEnvelope(MatchDetailResponseDto, "Match successfully retrieved")
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Match not found",
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getMatchById(
    @Param("matchId", ParseEntityIdPipe) matchId: number,
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
  @ApiEnvelope(
    MatchPlayerStatsResponseDto,
    "Player stats successfully retrieved",
  )
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Match not found",
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getPlayerMatchStats(
    @Param("matchId", ParseEntityIdPipe) matchId: number,
  ): Promise<MatchPlayerStatsResponseDto> {
    return this.matchesService.findPlayerMatchStatsByMatchId(matchId);
  }

  /**
   * Retrieve match events for a specific match.
   *
   * Deliberately uncached: this is the live-match surface. The frontend match
   * page revalidates at 60 s precisely because the event stream moves while a
   * match is being generated, and a 5-minute cache here would serve a stale
   * scoreboard for longer than the page's own window.
   *
   * @param matchId - The match ID
   * @returns Array of match events ordered by occurredAt
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
  @ApiEnvelopeList(MatchEventDto, "Match events successfully retrieved")
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getMatchEvents(
    @Param("matchId", ParseEntityIdPipe) matchId: number,
  ): Promise<MatchEventDto[]> {
    return this.matchesService.findMatchEventsByMatchId(matchId);
  }
}
