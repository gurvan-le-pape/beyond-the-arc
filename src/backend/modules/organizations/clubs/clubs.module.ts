// src/backend/modules/organizations/clubs/clubs.module.ts
import { CommonModule } from "@common/common.module";
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
 * - Global interceptors/filters (TransformInterceptor, HttpMetricsInterceptor,
 *   AllExceptionsFilter) are registered in app.module.ts, NOT here
 * - CacheInterceptor: Per-route caching (applied in controller with @UseInterceptors)
 */
@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [ClubsController],
  providers: [ClubsService],
})
export class ClubsModule {}
