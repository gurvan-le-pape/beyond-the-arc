// src/backend/modules/teams/teams.controller.ts
import { CACHE_TTL } from "@common/constants/cache-ttls";
import { PaginatedResponseDto } from "@common/dto/paginated-response.dto";
import { ParseOptionalIntPipe } from "@common/index";
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

import { GetTeamsQueryDto } from "./dto/teams.query.dto";
import {
  FilterValuesTeamsResponseDto,
  TeamDetailResponseDto,
  TeamMatchHistoryDto,
  TeamResponseDto,
} from "./dto/teams.response.dto";
import { TeamsService } from "./teams.service";

@ApiTags("teams")
@Controller("teams")
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA }))
  @ApiOperation({
    summary: "Get all teams with filters",
    description:
      "Retrieves a paginated list of teams with optional filtering. Results are cached for 5 minutes.",
  })
  @ApiQuery({ name: "clubId", required: false, type: Number })
  @ApiQuery({
    name: "level",
    required: false,
    enum: ["regional", "departmental"],
  })
  @ApiQuery({ name: "division", required: false, type: String })
  @ApiQuery({ name: "committeeId", required: false, type: Number })
  @ApiQuery({ name: "leagueId", required: false, type: Number })
  @ApiQuery({ name: "number", required: false, type: Number })
  @ApiQuery({ name: "category", required: false, type: String })
  @ApiQuery({ name: "gender", required: false, type: String })
  @ApiQuery({ name: "clubName", required: false, type: String })
  @ApiQuery({ name: "poolLetter", required: false, type: String })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "List of teams successfully retrieved",
    type: PaginatedResponseDto,
  })
  async getTeams(
    @Query() query: GetTeamsQueryDto,
  ): Promise<PaginatedResponseDto<TeamResponseDto>> {
    return this.teamsService.findAllTeams({
      clubId: query.clubId,
      level: query.level,
      division: query.division,
      committeeId: query.committeeId,
      leagueId: query.leagueId,
      number: query.number,
      category: query.category,
      gender: query.gender,
      clubName: query.clubName,
      poolLetter: query.poolLetter,
      page: query.page ?? 1,
      limit: query.limit ?? 50,
    });
  }

  @Get("filter-values")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA }))
  @ApiOperation({
    summary: "Get available filter values for teams",
    description:
      "Returns available team numbers, pool letters, and divisions. Optionally scoped to a committee or league.",
  })
  @ApiQuery({ name: "committeeId", required: false, type: Number })
  @ApiQuery({ name: "leagueId", required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Filter values successfully retrieved",
    type: FilterValuesTeamsResponseDto,
  })
  async getTeamFilterValues(
    @Query("committeeId", new ParseOptionalIntPipe()) committeeId?: number,
    @Query("leagueId", new ParseOptionalIntPipe()) leagueId?: number,
  ): Promise<FilterValuesTeamsResponseDto> {
    return this.teamsService.findTeamFilterValues({ committeeId, leagueId });
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get team by ID",
    description:
      "Retrieves detailed information about a specific team including players and recent matches",
  })
  @ApiParam({ name: "id", description: "Team ID", type: Number, example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Team successfully retrieved",
    type: TeamDetailResponseDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Team not found" })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
  })
  async getTeamById(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<TeamDetailResponseDto> {
    return this.teamsService.findTeamById(id);
  }

  @Get(":id/matches")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get team match history",
    description:
      "Retrieves all matches for a specific team with player statistics, ordered by date (most recent first)",
  })
  @ApiParam({ name: "id", description: "Team ID", type: Number, example: 1 })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Match history successfully retrieved",
    type: [TeamMatchHistoryDto],
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Team not found" })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
  })
  async getTeamMatchHistory(
    @Param("id", ParseIntPipe) id: number,
  ): Promise<TeamMatchHistoryDto[]> {
    return this.teamsService.findTeamMatchHistory(id);
  }
}
