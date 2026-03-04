// src/backend/modules/competitions/leaderboards/leaderboards.module.ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";

import { LeaderboardsController } from "./leaderboards.controller";
import { LeaderboardsService } from "./leaderboards.service";

/**
 * Leaderboards module providing endpoints for pool standings and rankings.
 *
 * Features:
 * - Leaderboard retrieval by pool ID
 * - Individual leaderboard entry lookup
 * - Automatic sorting by points and point difference
 *
 * Architecture:
 * - Global interceptors/filters are registered in main.ts, NOT here
 * - CacheInterceptor: Per-route caching (applied in controller with @UseInterceptors)
 */
@Module({
  imports: [PrismaModule],
  controllers: [LeaderboardsController],
  providers: [LeaderboardsService],
  exports: [LeaderboardsService], // Export service for use in other modules
})
export class LeaderboardsModule {}
