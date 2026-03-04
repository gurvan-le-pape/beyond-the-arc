// src/backend/modules/players/players.module.ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";

import { PlayersController } from "./players.controller";
import { PlayersService } from "./players.service";

/**
 * Players module providing endpoints for player data.
 *
 * Features:
 * - Player listing with extensive filtering
 * - Player details by ID
 * - Player match history with statistics
 * - Pagination support
 * - Dynamic filter values (when no filters applied)
 *
 * Architecture:
 * - Global interceptors/filters are registered in main.ts, NOT here
 * - CacheInterceptor: Per-route caching (applied in controller with @UseInterceptors)
 */
@Module({
  imports: [PrismaModule],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService], // Export service for use in other modules
})
export class PlayersModule {}
