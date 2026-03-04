// src/backend/modules/competitions/pools/pools.module.ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";

import { PoolsController } from "./pools.controller";
import { PoolsService } from "./pools.service";

/**
 * Pools module providing endpoints for pool data.
 *
 * Features:
 * - Pool retrieval by championship ID
 * - Individual pool lookup
 * - Automatic sorting by letter
 *
 * Architecture:
 * - Global interceptors/filters are registered in main.ts, NOT here
 * - CacheInterceptor: Per-route caching (applied in controller with @UseInterceptors)
 */
@Module({
  imports: [PrismaModule],
  controllers: [PoolsController],
  providers: [PoolsService],
  exports: [PoolsService], // Export service for use in other modules
})
export class PoolsModule {}
