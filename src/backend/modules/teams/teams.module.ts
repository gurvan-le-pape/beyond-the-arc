// src/backend/modules/teams/teams.module.ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";

import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";

/**
 * Teams module providing endpoints for team data.
 *
 * Features:
 * - Team listing with extensive filtering
 * - Team details by ID with players and recent matches
 * - Team match history with player statistics
 * - Pagination support
 * - Dynamic filter values (when no filters applied)
 *
 * Architecture:
 * - Global interceptors/filters are registered in main.ts, NOT here
 * - CacheInterceptor: Per-route caching (applied in controller with @UseInterceptors)
 */
@Module({
  imports: [PrismaModule],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService], // Export service for use in other modules
})
export class TeamsModule {}
