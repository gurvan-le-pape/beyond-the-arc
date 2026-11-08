// src/backend/modules/matches/player-shots.controller.ts
import { CACHE_TTL } from "@common/constants";
import { ApiEnvelopeList } from "@common/decorators";
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

import { ShotDto } from "./dto/matches.response.dto";
import { MatchesService } from "./matches.service";

/**
 * A player's shots, served under the player as `/players/:playerId/shots`. The
 * route lives in the matches module because the matches service owns the event
 * query; only its URL sits under `players`.
 */
@ApiTags("players")
@Controller("players")
export class PlayerShotsController {
  constructor(private readonly matchesService: MatchesService) {}

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
  @Get(":playerId/shots")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA }))
  @ApiOperation({
    summary: "Get a player's shots",
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
