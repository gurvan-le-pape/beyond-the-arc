// src/backend/modules/geography/geo.module.ts
import { Module } from "@nestjs/common";
import { PrismaModule } from "prisma/prisma.module";

import { GeoController } from "./geo.controller";
import { GeoService } from "./geo.service";

/**
 * Geo module providing endpoints for geographic data.
 *
 * Features:
 * - GeoJSON representations of regions
 * - GeoJSON representations of departments
 * - PostGIS integration for geometry processing
 * - Automatic geometry normalization (MultiPolygon → Polygon)
 *
 * Architecture:
 * - Global interceptors/filters are registered in main.ts, NOT here
 * - CacheInterceptor: Per-route caching with 10-minute TTL (applied in controller with @UseInterceptors)
 */
@Module({
  imports: [PrismaModule],
  controllers: [GeoController],
  providers: [GeoService],
  exports: [GeoService], // Export service for use in other modules
})
export class GeoModule {}
