// src/backend/modules/organizations/clubs/clubs.module.ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";

import { ClubsController } from "./clubs.controller";
import { ClubsService } from "./clubs.service";

/**
 * Clubs module providing endpoints for club data.
 *
 * Features:
 * - Club statistics by region and department
 * - Club filtering by level, committee, league, category, gender
 * - Detailed club information with teams
 *
 * Architecture:
 * - LoggingInterceptor: Logs all requests/responses (from common/)
 * - TransformInterceptor: Wraps responses in standard format (from common/)
 * - AllExceptionsFilter: Global error handling (from common/)
 * - CacheInterceptor: Per-route caching (applied in controller with @UseInterceptors)
 */
@Module({
  imports: [PrismaModule],
  controllers: [ClubsController],
  providers: [ClubsService],
  exports: [ClubsService], // Export if needed by other modules
})
export class ClubsModule {}
