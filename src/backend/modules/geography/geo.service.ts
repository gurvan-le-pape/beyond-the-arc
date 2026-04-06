// src/backend/modules/geography/geo.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";

import {
  GeoJsonFeatureCollectionDto,
  GeoJsonFeatureDto,
} from "./dto/geo.response.dto";

/**
 * Type representing a raw SQL query result for geographic entities.
 */
type GeoEntityQueryResult = {
  code: string;
  name: string;
  geojson_code: string;
  geometry: string; // JSON string from PostGIS ST_AsGeoJSON
};

/**
 * Service handling business logic for geographic data.
 * Fetches GeoJSON representations of regions and departments from PostGIS.
 */
@Injectable()
export class GeoService {
  private readonly logger = new Logger(GeoService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all regions as a GeoJSON FeatureCollection.
   * Results include geometry data from PostGIS.
   *
   * @returns GeoJSON FeatureCollection of regions
   */
  async getRegionsGeoJson(): Promise<GeoJsonFeatureCollectionDto> {
    const regions = await this.prisma.$queryRaw<GeoEntityQueryResult[]>`
        SELECT 
          r.code, 
          r.name, 
          rg.geojson_code, 
          ST_AsGeoJSON(rg.geometry) AS geometry
        FROM region_geometries rg
        JOIN regions r ON rg.region_id = r.id
        ORDER BY r.code ASC
      `;

    return this.mapToFeatureCollection(regions);
  }

  /**
   * Retrieves all departments as a GeoJSON FeatureCollection.
   * Results include geometry data from PostGIS.
   *
   * @returns GeoJSON FeatureCollection of departments
   */
  async getDepartmentsGeoJson(): Promise<GeoJsonFeatureCollectionDto> {
    const departments = await this.prisma.$queryRaw<GeoEntityQueryResult[]>`
        SELECT 
          d.code, 
          d.name, 
          dg.geojson_code, 
          ST_AsGeoJSON(dg.geometry) AS geometry
        FROM department_geometries dg
        JOIN departments d ON dg.department_id = d.id
        ORDER BY d.code ASC
      `;

    return this.mapToFeatureCollection(departments);
  }

  /**
   * Maps raw query results to a GeoJSON FeatureCollection.
   * Converts single-part MultiPolygons to Polygons for compatibility.
   *
   * @param entities - Array of raw query results
   * @returns GeoJSON FeatureCollection
   */
  private mapToFeatureCollection(
    entities: GeoEntityQueryResult[],
  ): GeoJsonFeatureCollectionDto {
    return {
      type: "FeatureCollection",
      features: entities.map((entity) => this.mapToFeature(entity)),
    } satisfies GeoJsonFeatureCollectionDto; // TypeScript validates this matches
  }

  /**
   * Maps a single entity to a GeoJSON Feature.
   * Handles geometry normalization (MultiPolygon → Polygon conversion).
   *
   * @param entity - Raw query result
   * @returns GeoJSON Feature
   */
  private mapToFeature(entity: GeoEntityQueryResult): GeoJsonFeatureDto {
    let geometry = JSON.parse(entity.geometry);

    // Normalize single-part MultiPolygons to Polygons
    if (geometry.type === "MultiPolygon" && geometry.coordinates.length === 1) {
      geometry = {
        type: "Polygon",
        coordinates: geometry.coordinates[0],
      };
    }

    return {
      type: "Feature",
      properties: {
        code: entity.code,
        apiCode: entity.geojson_code,
        nom: entity.name,
      },
      geometry,
    } satisfies GeoJsonFeatureDto; // TypeScript validates this matches
  }
}
