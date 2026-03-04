// src/backend/modules/matches/matches.module.ts
import { AllExceptionsFilter } from "@common/filters/all-exceptions.filter";
import { LoggingInterceptor } from "@common/interceptors/logging.interceptor";
import { TransformInterceptor } from "@common/interceptors/transform.interceptor";
import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
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
