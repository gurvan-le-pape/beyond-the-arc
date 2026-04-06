// src/backend/modules/matches/matches.module.ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";

import { MatchesController } from "./matches.controller";
import { MatchesService } from "./matches.service";

/**
 * Matches module providing endpoints for match data.
 *
 * Features:
 * - Match listing with extensive filtering
 * - Match details by ID with events
 * - Player statistics per match
 * - Match events (shots, fouls, etc.)
 * - Team-specific shot events
 * - Player-specific shot events
 * - Pagination support
 *
 * Architecture:
 * - LoggingInterceptor: Logs all requests/responses (from common/)
 * - TransformInterceptor: Wraps responses in standard format (from common/)
 * - AllExceptionsFilter: Global error handling (from common/)
 * - CacheInterceptor: Per-route caching (applied in controller with @UseInterceptors)
 */
@Module({
  imports: [PrismaModule],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService], // Export service for use in other modules
})
export class MatchesModule {}
