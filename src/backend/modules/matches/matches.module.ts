// src/backend/modules/matches/matches.module.ts
import { CommonModule } from "@common/common.module";
import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";

import { MatchesController } from "./matches.controller";
import { MatchesService } from "./matches.service";
import { PoolMatchesController } from "./pool-matches.controller";

/**
 * Matches module providing endpoints for match data.
 *
 * Features:
 * - Match listing with extensive filtering
 * - Match details by ID with events
 * - A pool's matches, unpaginated, at /pools/:poolId/matches
 * - Player statistics per match
 * - Match events (shots, fouls, etc.)
 * - Team-specific shot events
 * - Player-specific shot events
 * - Pagination support
 *
 * Architecture:
 * - Global interceptors/filters (TransformInterceptor, HttpMetricsInterceptor,
 *   AllExceptionsFilter) are registered in app.module.ts, NOT here
 * - CacheInterceptor: Per-route caching (applied in controller with @UseInterceptors)
 */
@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [MatchesController, PoolMatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
