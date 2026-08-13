// src/backend/modules/teams/teams.controller.ts
import { CACHE_TTL } from "@common/constants";
import { ApiPaginatedResponse } from "@common/decorators";
import {
  ApiErrorResponseDto,
  OrganizationScopeQueryDto,
  PaginatedResponseDto,
} from "@common/dto";
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

import { GetTeamsQueryDto } from "./dto/teams.query.dto";
import {
  FilterValuesTeamsResponseDto,
  TeamDetailResponseDto,
  TeamMatchHistoryResponseDto,
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
  @ApiPaginatedResponse(TeamResponseDto, "List of teams successfully retrieved")
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
      search: query.search,
      poolLetter: query.poolLetter,
      page: query.page,
      limit: query.limit,
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Filter values successfully retrieved",
    type: FilterValuesTeamsResponseDto,
  })
  async getTeamFilterValues(
    @Query() query: OrganizationScopeQueryDto,
  ): Promise<FilterValuesTeamsResponseDto> {
    return this.teamsService.findTeamFilterValues(query);
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
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Team not found",
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getTeamById(
    @Param("id", ParseEntityIdPipe) id: number,
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
    type: TeamMatchHistoryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Team not found",
    type: ApiErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Invalid ID format",
    type: ApiErrorResponseDto,
  })
  async getTeamMatchHistory(
    @Param("id", ParseEntityIdPipe) id: number,
  ): Promise<TeamMatchHistoryResponseDto> {
    return this.teamsService.findTeamMatchHistory(id);
  }
}
