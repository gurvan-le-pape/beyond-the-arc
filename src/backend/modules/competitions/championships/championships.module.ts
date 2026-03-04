// src/backend/modules/competitions/championships/championships.module.ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";

import { ChampionshipsController } from "./championships.controller";
import { ChampionshipsService } from "./championships.service";

/**
 * Championships module providing endpoints for championship data.
 *
 * Features:
 * - Division listing
 * - Championship retrieval by ID
 * - Regional championships by league
 * - Departmental championships by committee
 *
 * Notes:
 * - Global interceptors and filters (LoggingInterceptor, TransformInterceptor, AllExceptionsFilter) are registered in main.ts, not here.
 * - Per-route caching is applied in the controller using CacheInterceptor.
 */
@Module({
  imports: [PrismaModule],
  controllers: [ChampionshipsController],
  providers: [ChampionshipsService],
  exports: [ChampionshipsService], // Export service for use in other modules
})
export class ChampionshipsModule {}
