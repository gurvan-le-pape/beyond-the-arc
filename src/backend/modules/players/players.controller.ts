// src/backend/modules/players/players.controller.ts
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

import { GetPlayersQueryDto } from "./dto/players.query.dto";
import { MatchHistoryDto, PlayerResponseDto } from "./dto/players.response.dto";
import { PlayersService } from "./players.service";

/**
 * Controller handling player-related endpoints.
 * Provides access to player data, filtering, and match history.
 *
 * Global interceptors (applied in main.ts):
 * - LoggingInterceptor: Logs all requests/responses
 * - TransformInterceptor: Wraps responses in standard format
 *
 * Route-specific interceptors:
 * - CacheInterceptor: Applied to list endpoint (moderate caching)
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
   * Response (after TransformInterceptor):
   * {
   *   "data": {
   *     "items": [...],
   *     "total": 150,
   *     "page": 1,
   *     "limit": 20,
   *     "totalPages": 8
   *   },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/players",
   *   "statusCode": 200
   * }
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA }))
  @ApiOperation({
    summary: "Get all players with filters",
    description:
      "Retrieves a paginated list of players with optional filtering by level, club, team, category, gender, and more. Results are cached for 5 minutes.",
  })
  @ApiQuery({
    name: "level",
    required: false,
    enum: ["regional", "departmental"],
    description: "Competition level",
    example: "regional",
  })
  @ApiQuery({
    name: "clubId",
    required: false,
    type: Number,
    description: "Filter by club ID",
    example: 1,
  })
  @ApiQuery({
    name: "teamId",
    required: false,
    type: Number,
    description: "Filter by team ID",
    example: 1,
  })
  @ApiQuery({
    name: "teamNumber",
    required: false,
    type: Number,
    description: "Filter by team number",
    example: 1,
  })
  @ApiQuery({
    name: "number",
    required: false,
    type: Number,
    description: "Filter by player jersey number",
    example: 10,
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
    name: "name",
    required: false,
    type: String,
    description: "Search by player name (case-insensitive)",
    example: "John",
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
    description: "List of players successfully retrieved",
    schema: {
      example: {
        data: {
          items: [
            {
              id: 1,
              name: "John Doe",
              number: 10,
              teamId: 1,
              team: {
                id: 1,
                number: 1,
                clubId: 1,
                category: "U18",
                gender: "M",
                club: {
                  id: 1,
                  name: "Club Example",
                  committee: {
                    id: 1,
                    name: "Committee Example",
                    league: {
                      id: 1,
                      name: "League Example",
                    },
                  },
                },
                pool: {
                  id: 1,
                  name: "Pool A",
                  championship: {
                    id: 1,
                    name: "Championship Régional U18",
                    level: "regional",
                    division: "Régionale 1",
                  },
                },
              },
            },
          ],
          total: 150,
          page: 1,
          limit: 50,
          totalPages: 3,
        },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/players",
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
          'level must be either "regional" or "departmental"',
          "clubId must be a valid number",
        ],
        error: "BadRequestException",
        path: "/players?level=invalid&clubId=abc",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  async getPlayers(
    @Query() query: GetPlayersQueryDto,
  ): Promise<PaginatedResponseDto<PlayerResponseDto>> {
    return this.playersService.findAllPlayers({
      level: query.level,
      clubId: query.clubId,
      teamId: query.teamId,
      teamNumber: query.teamNumber,
      number: query.number,
      committeeId: query.committeeId,
      leagueId: query.leagueId,
      category: query.category,
      gender: query.gender,
      name: query.name,
      page: query.page ?? 1,
      limit: query.limit ?? 50,
    });
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
   * Response (after TransformInterceptor):
   * {
   *   "data": {
   *     "id": 123,
   *     "name": "John Doe",
   *     "number": 10,
   *     "teamId": 1,
   *     "team": { ... }
   *   },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/players/123",
   *   "statusCode": 200
   * }
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Player successfully retrieved",
    type: PlayerResponseDto,
    schema: {
      example: {
        data: {
          id: 1,
          name: "John Doe",
          number: 10,
          teamId: 1,
          team: {
            id: 1,
            number: 1,
            clubId: 1,
            category: "U18",
            gender: "M",
            club: {
              id: 1,
              name: "Club Example",
              committee: {
                id: 1,
                name: "Committee Example",
                league: {
                  id: 1,
                  name: "League Example",
                },
              },
            },
            pool: {
              id: 1,
              name: "Pool A",
              championship: {
                id: 1,
                name: "Championship Régional U18",
                level: "regional",
                division: "Régionale 1",
              },
            },
          },
        },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/players/1",
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Player not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Player with ID 999 not found",
        error: "NotFoundException",
        path: "/players/999",
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
        path: "/players/abc",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  async getPlayerById(
    @Param("id", ParseIntPipe) id: number,
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
   * Response (after TransformInterceptor):
   * {
   *   "data": [
   *     {
   *       "id": 1,
   *       "date": "2024-02-05T19:00:00Z",
   *       "homeTeam": { ... },
   *       "awayTeam": { ... },
   *       "homeTeamScore": 85,
   *       "awayTeamScore": 72,
   *       "player": {
   *         "player": { "id": 123, "name": "John Doe", ... },
   *         "stats": { "points": 15, "rebounds": { ... }, ... }
   *       }
   *     }
   *   ],
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/players/123/matches",
   *   "statusCode": 200
   * }
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Match history successfully retrieved",
    type: [MatchHistoryDto],
    schema: {
      example: {
        data: [
          {
            id: 1,
            date: "2024-02-05T19:00:00Z",
            homeTeam: {
              id: 1,
              number: 1,
              club: { id: 1, name: "Club A" },
            },
            awayTeam: {
              id: 2,
              number: 1,
              club: { id: 2, name: "Club B" },
            },
            homeTeamScore: 85,
            awayTeamScore: 72,
            player: {
              player: {
                id: 1,
                name: "John Doe",
                number: 10,
                teamId: 1,
              },
              stats: {
                points: 15,
                fouls: 2,
                threePointsMade: 2,
                threePointsAttempted: 5,
                rebounds: {
                  total: 8,
                  offensive: 3,
                  defensive: 5,
                },
                assists: 7,
                steals: 2,
                blocks: 1,
                turnovers: 3,
                playtimeIntervals: [
                  [0, 600],
                  [1200, 2400],
                ],
              },
            },
          },
        ],
        timestamp: "2024-02-05T10:00:00Z",
        path: "/players/1/matches",
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Player not found",
    schema: {
      example: {
        statusCode: 404,
        message: "Player with ID 999 not found",
        error: "NotFoundException",
        path: "/players/999/matches",
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
        path: "/players/abc/matches",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  async getPlayerMatchHistory(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<MatchHistoryDto[]> {
    return this.playersService.findPlayerMatchHistory(id);
  }
}
