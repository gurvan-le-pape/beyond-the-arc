// src/backend/modules/geography/dto/geo.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * Properties of a GeoJSON feature.
 */
export class GeoJsonPropertiesDto {
  @ApiProperty({
    description: "Internal code",
    example: "01",
    type: String,
  })
  code!: string;

  @ApiProperty({
    description: "API-compatible code",
    example: "FR-01",
    type: String,
  })
  apiCode!: string;

  @ApiProperty({
    description: "Name of the geographic entity",
    example: "Ain",
    type: String,
  })
  nom!: string;
}

/**
 * GeoJSON Geometry object.
 * Can be Polygon or MultiPolygon.
 */
export class GeoJsonGeometryDto {
  @ApiProperty({
    description: "Geometry type",
    example: "Polygon",
    enum: ["Polygon", "MultiPolygon"],
    type: String,
  })
  type!: "Polygon" | "MultiPolygon";

  @ApiProperty({
    description: "Geometry coordinates",
    example: [
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
        [0, 0],
      ],
    ],
    type: "array",
  })
  coordinates!: number[][][] | number[][][][];
}

/**
 * GeoJSON Feature object.
 */
export class GeoJsonFeatureDto {
  @ApiProperty({
    description: "GeoJSON object type",
    example: "Feature",
    type: String,
  })
  type!: "Feature";

  @ApiProperty({
    description: "Feature properties",
    type: GeoJsonPropertiesDto,
  })
  properties!: GeoJsonPropertiesDto;

  @ApiProperty({
    description: "Feature geometry",
    type: GeoJsonGeometryDto,
  })
  geometry!: GeoJsonGeometryDto;
}

/**
 * GeoJSON FeatureCollection response.
 */
export class GeoJsonFeatureCollectionDto {
  @ApiProperty({
    description: "GeoJSON object type",
    example: "FeatureCollection",
    type: String,
  })
  type!: "FeatureCollection";

  @ApiProperty({
    description: "Array of GeoJSON features",
    type: [GeoJsonFeatureDto],
  })
  features!: GeoJsonFeatureDto[];
}
