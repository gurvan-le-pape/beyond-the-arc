// src/backend/modules/matches/pool-matches.controller.ts
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

import { MatchResponseDto } from "./dto/matches.response.dto";
import { MatchesService } from "./matches.service";

/**
 * A pool's matches, served under the pool as `/pools/:poolId/matches`. The
 * route lives in the matches module because the matches service owns the
 * query; only its URL sits under `pools`. The paginated, filterable list stays
 * `/matches?poolId=`.
 */
@ApiTags("pools")
@Controller("pools")
export class PoolMatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get(":poolId/matches")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.MODERATE_DATA }))
  @ApiOperation({
    summary: "Get a pool's matches",
    description:
      "Retrieves all matches of a pool without pagination, ordered by date ascending. An unknown pool returns an empty list.",
  })
  @ApiParam({
    name: "poolId",
    description: "Pool ID",
    type: Number,
    example: 1,
  })
  // No 404 is documented because none is sent: this is a list endpoint, so an
  // unknown pool id returns 200 with an empty array, the same as a pool that
  // exists and has no matches.
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
}
