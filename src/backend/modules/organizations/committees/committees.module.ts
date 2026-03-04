// src/backend/modules/organizations/committees/committees.module.ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";

import { CommitteesController } from "./committees.controller";
import { CommitteesService } from "./committees.service";

/**
 * Committees module providing endpoints for departmental committee data.
 *
 * Features:
 * - List all departmental committees
 * - Filter committees by league
 * - Retrieve committee details by ID
 * - Includes department information
 *
 * Architecture:
 * - Global interceptors/filters are registered in main.ts, NOT here
 * - CacheInterceptor: Per-route caching (applied in controller with @UseInterceptors)
 */
@Module({
  imports: [PrismaModule],
  controllers: [CommitteesController],
  providers: [CommitteesService],
  exports: [CommitteesService], // Export service for use in other modules
})
export class CommitteesModule {}
