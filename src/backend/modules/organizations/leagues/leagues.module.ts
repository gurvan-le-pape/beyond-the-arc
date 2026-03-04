// src/backend/modules/organizations/leagues/leagues.module.ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";

import { LeaguesController } from "./leagues.controller";
import { LeaguesService } from "./leagues.service";

/**
 * Leagues module providing endpoints for regional league data.
 *
 * Features:
 * - List all regional leagues
 * - Retrieve league details by ID
 *
 * Architecture:
 * - Global interceptors/filters are registered in main.ts, NOT here
 * - CacheInterceptor: Per-route caching (applied in controller with @UseInterceptors)
 */
@Module({
  imports: [PrismaModule],
  controllers: [LeaguesController],
  providers: [LeaguesService],
  exports: [LeaguesService], // Export service for use in other modules
})
export class LeaguesModule {}
