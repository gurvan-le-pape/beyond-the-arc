// src/backend/modules/matches/team-shots.controller.ts
import { ApiEnvelopeList } from "@common/decorators";
import { ApiErrorResponseDto } from "@common/dto";
import { ParseEntityIdPipe } from "@common/pipes";
import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

import { ShotDto } from "./dto/matches.response.dto";
import { MatchesService } from "./matches.service";

/**
 * A team's shots, served under the team as `/teams/:teamId/shots`. The route
 * lives in the matches module because the matches service owns the event
 * query; only its URL sits under `teams`.
 */
@ApiTags("teams")
@Controller("teams")
export class TeamShotsController {
  constructor(private readonly matchesService: MatchesService) {}

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
  @Get(":teamId/shots")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Get a team's shots",
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
}
