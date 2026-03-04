// src/backend/modules/geography/geo.controller.ts
import { CACHE_TTL } from "@common/constants/cache-ttls";
import { CacheInterceptor } from "@common/interceptors/cache.interceptor";
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { GeoJsonFeatureCollectionDto } from "./dto/geo.response.dto";
import { GeoService } from "./geo.service";

/**
 * Controller handling geographic data endpoints.
 * Provides GeoJSON representations of regions and departments.
 *
 * Global interceptors (applied in main.ts):
 * - LoggingInterceptor: Logs all requests/responses
 * - TransformInterceptor: Wraps responses in standard format
 *
 * Route-specific interceptors:
 * - CacheInterceptor: Heavy caching (10 minutes) - geographic boundaries rarely change
 */
@ApiTags("geo")
@Controller("geo")
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  /**
   * Retrieve all regions as GeoJSON.
   *
   * Heavy caching (10 minutes) because geographic boundaries are static
   * and this data is expensive to compute with PostGIS.
   *
   * @returns GeoJSON FeatureCollection of all regions
   *
   * @example
   * GET /geo/regions
   * Response (after TransformInterceptor):
   * {
   *   "data": {
   *     "type": "FeatureCollection",
   *     "features": [
   *       {
   *         "type": "Feature",
   *         "properties": {
   *           "code": "01",
   *           "apiCode": "FR-01",
   *           "nom": "Ain"
   *         },
   *         "geometry": {
   *           "type": "Polygon",
   *           "coordinates": [...]
   *         }
   *       }
   *     ]
   *   },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/geo/regions",
   *   "statusCode": 200
   * }
   */
  @Get("regions")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.STATIC_DATA })) // Cache for 10 minutes
  @ApiOperation({
    summary: "Get regions as GeoJSON",
    description:
      "Retrieves all regions with their geographic boundaries as a GeoJSON FeatureCollection. Results are cached for 10 minutes.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "GeoJSON FeatureCollection of regions",
    type: GeoJsonFeatureCollectionDto,
    schema: {
      example: {
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                code: "84",
                apiCode: "FR-ARA",
                nom: "Auvergne-Rhône-Alpes",
              },
              geometry: {
                type: "MultiPolygon",
                coordinates: [
                  [
                    [
                      [4.5, 45.5],
                      [5.5, 45.5],
                      [5.5, 46.5],
                      [4.5, 46.5],
                      [4.5, 45.5],
                    ],
                  ],
                ],
              },
            },
          ],
        },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/geo/regions",
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Failed to fetch regions GeoJSON",
    schema: {
      example: {
        statusCode: 500,
        message: "Failed to fetch regions GeoJSON",
        error: "InternalServerErrorException",
        path: "/geo/regions",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  async getRegionsGeoJson(): Promise<GeoJsonFeatureCollectionDto> {
    return this.geoService.getRegionsGeoJson();
  }

  /**
   * Retrieve all departments as GeoJSON.
   *
   * Heavy caching (10 minutes) because geographic boundaries are static
   * and this data is expensive to compute with PostGIS.
   *
   * @returns GeoJSON FeatureCollection of all departments
   *
   * @example
   * GET /geo/departments
   * Response (after TransformInterceptor):
   * {
   *   "data": {
   *     "type": "FeatureCollection",
   *     "features": [
   *       {
   *         "type": "Feature",
   *         "properties": {
   *           "code": "01",
   *           "apiCode": "FR-01",
   *           "nom": "Ain"
   *         },
   *         "geometry": {
   *           "type": "Polygon",
   *           "coordinates": [...]
   *         }
   *       }
   *     ]
   *   },
   *   "timestamp": "2024-02-05T10:00:00Z",
   *   "path": "/geo/departments",
   *   "statusCode": 200
   * }
   */
  @Get("departments")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(CacheInterceptor({ ttl: CACHE_TTL.STATIC_DATA })) // Cache for 10 minutes
  @ApiOperation({
    summary: "Get departments as GeoJSON",
    description:
      "Retrieves all departments with their geographic boundaries as a GeoJSON FeatureCollection. Results are cached for 10 minutes.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "GeoJSON FeatureCollection of departments",
    type: GeoJsonFeatureCollectionDto,
    schema: {
      example: {
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                code: "01",
                apiCode: "FR-01",
                nom: "Ain",
              },
              geometry: {
                type: "Polygon",
                coordinates: [
                  [
                    [4.5, 45.5],
                    [5.5, 45.5],
                    [5.5, 46.5],
                    [4.5, 46.5],
                    [4.5, 45.5],
                  ],
                ],
              },
            },
          ],
        },
        timestamp: "2024-02-05T10:00:00Z",
        path: "/geo/departments",
        statusCode: 200,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: "Failed to fetch departments GeoJSON",
    schema: {
      example: {
        statusCode: 500,
        message: "Failed to fetch departments GeoJSON",
        error: "InternalServerErrorException",
        path: "/geo/departments",
        timestamp: "2024-02-05T10:00:00Z",
      },
    },
  })
  async getDepartmentsGeoJson(): Promise<GeoJsonFeatureCollectionDto> {
    return this.geoService.getDepartmentsGeoJson();
  }
}
