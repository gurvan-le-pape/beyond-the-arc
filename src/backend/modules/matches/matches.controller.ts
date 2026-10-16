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
  ShotDto,
} from "./dto/matches.response.dto";
import { MatchesService } from "./matches.service";

/**
 * Controller handling match-related endpoints.
 * Provides access to match data, player statistics, and match events.
 *
 * Global interceptors (registered in app.module.ts):
 * - TransformInterceptor: Wraps responses in standard format
 * - HttpMetricsInterceptor: Records the Prometheus request metrics
 *
 * Request logging is not an interceptor — nestjs-pino's autoLogging produces it.
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
  @ApiEnvelopePage(MatchResponseDto, "List of matches successfully retrieved")
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid query parameters",
    type: ApiErrorResponseDto,
  })
  async getMatches(
    @Query() query: GetMatchesQueryDto,
  ): Promise<PaginatedResponseDto<MatchResponseDto>> {
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
      page: query.page,
      limit: query.limit,
    });
  }

  @Get("pool/:poolId")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA }))
  @ApiOperation({
    summary: "Get matches by pool ID",
    description:
      "Retrieves all matches for a specific pool without pagination, ordered by date ascending.",
  })
  @ApiParam({
    name: "poolId",
    description: "Pool ID",
    type: Number,
    example: 1,
  })
  // No 404 documented, because none is sent. This is a list endpoint: an
  // unknown pool id returns 200 with an empty array, the same as a pool that
  // exists and has no matches — verified on prod, `pool/999999999` →
  // `{"data":[],"meta":{"count":0},…}`. The 404 declared here was a response
  // that could never occur, which is the `api-contract 4` defect class: a
  // documented value a client could branch on and never reach.
  @ApiEnvelopeList(MatchResponseDto, "Matches successfully retrieved")
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getMatchesByPoolId(
    @Param("poolId", ParseEntityIdPipe) poolId: number,
  ): Promise<MatchResponseDto[]> {
    return this.matchesService.findMatchesByPoolId(poolId);
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

  /**
   * Retrieve every shot a team took, for its season shot chart.
   *
   * Uncached, for size rather than freshness — a finished match's shots never
   * change. A team takes ~50 shots a game, so a full season is ~1,100 shots,
   * ~60 KB serialized: above the ~50 KB per-entry body CACHE_MAX_ENTRIES was
   * sized against, and keyed by one of 60,168 teams, all reachable
   * unauthenticated. See `common/constants/cache-max-entries.ts`.
   *
   * @param teamId - The team ID
   * @returns The team's shots, location and type
   */
  @Get("team/:teamId/shots")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get shots by team ID",
    description:
      "Retrieves every shot a specific team took, with its location and event type, across all their matches, blocked attempts included. Shots its players blocked or fouled are excluded.",
  })
  @ApiParam({
    name: "teamId",
    description: "Team ID",
    type: Number,
    example: 1,
  })
  @ApiEnvelopeList(ShotDto, "Shots successfully retrieved")
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getShotsByTeamId(
    @Param("teamId", ParseEntityIdPipe) teamId: number,
  ): Promise<ShotDto[]> {
    return this.matchesService.findShotsByTeamId(teamId);
  }

  /**
   * Retrieve every shot a player took, for their season shot chart.
   *
   * Moderate caching (5 minutes): a finished match's shots never change, so the
   * only staleness is a just-generated match reaching the chart up to 5 minutes
   * late. A player's season is a few hundred shots at ~55 bytes each, well
   * within the per-entry body CACHE_MAX_ENTRIES was sized against.
   *
   * @param playerId - The player ID
   * @returns The player's shots, location and type
   */
  @Get("player/:playerId/shots")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA }))
  @ApiOperation({
    summary: "Get shots by player ID",
    description:
      "Retrieves every shot a specific player took, with its location and event type, across all their matches, blocked attempts included. Shots the player only assisted on are excluded. Results are cached for 5 minutes.",
  })
  @ApiParam({
    name: "playerId",
    description: "Player ID",
    type: Number,
    example: 1,
  })
  @ApiEnvelopeList(ShotDto, "Shots successfully retrieved")
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getShotsByPlayerId(
    @Param("playerId", ParseEntityIdPipe) playerId: number,
  ): Promise<ShotDto[]> {
    return this.matchesService.findShotsByPlayerId(playerId);
  }
}
