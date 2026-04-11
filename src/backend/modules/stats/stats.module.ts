// src/backend/modules/stats/stats.module.ts
import { CommonModule } from "@common/common.module";
import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";

import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";

/**
 * Stats module exposing platform-wide entity counts.
 *
 * Features:
 * - Single GET /stats endpoint returning counts for all entities
 *
 * Notes:
 * - Global interceptors (LoggingInterceptor, TransformInterceptor,
 *   AllExceptionsFilter) are registered in main.ts, not here.
 * - Per-route caching is applied in the controller using CacheInterceptor.
 */
@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
