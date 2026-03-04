// src/backend/modules/geography/geo.controller.spec.ts
import { InternalServerErrorException } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { PrismaService } from "prisma/prisma.service";

import { GeoService } from "./geo.service";

/**
 * Unit tests for GeoService.
 *
 * Tests cover:
 * - GeoJSON FeatureCollection creation
 * - Geometry normalization (MultiPolygon → Polygon)
 * - Error handling
 */
describe("GeoService", () => {
  let service: GeoService;
  let prismaService: PrismaService;

  // Mock Prisma service
  const mockPrismaService = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeoService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GeoService>(GeoService);
    prismaService = module.get<PrismaService>(PrismaService);

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe("getRegionsGeoJson", () => {
    it("should return FeatureCollection with converted geometries", async () => {
      // Arrange
      const mockResults = [
        {
          code: "84",
          name: "Auvergne-Rhône-Alpes",
          geojson_code: "FR-ARA",
          geometry: JSON.stringify({
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
          }),
        },
        {
          code: "11",
          name: "Île-de-France",
          geojson_code: "FR-IDF",
          geometry: JSON.stringify({
            type: "Polygon",
            coordinates: [
              [
                [2.0, 48.5],
                [2.5, 48.5],
                [2.5, 49.0],
                [2.0, 49.0],
                [2.0, 48.5],
              ],
            ],
          }),
        },
      ];

      mockPrismaService.$queryRaw.mockResolvedValue(mockResults);

      // Act
      const result = await service.getRegionsGeoJson();

      // Assert
      expect(result.type).toBe("FeatureCollection");
      expect(result.features).toHaveLength(2);

      // First feature: MultiPolygon with one part converted to Polygon
      expect(result.features[0].type).toBe("Feature");
      expect(result.features[0].geometry.type).toBe("Polygon");
      expect(result.features[0].properties).toEqual({
        code: "84",
        apiCode: "FR-ARA",
        nom: "Auvergne-Rhône-Alpes",
      });

      // Second feature: Polygon remains Polygon
      expect(result.features[1].geometry.type).toBe("Polygon");
      expect(result.features[1].properties).toEqual({
        code: "11",
        apiCode: "FR-IDF",
        nom: "Île-de-France",
      });
    });

    it("should throw InternalServerErrorException on database error", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockPrismaService.$queryRaw.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.getRegionsGeoJson()).rejects.toThrow(
        InternalServerErrorException,
      );

      await expect(service.getRegionsGeoJson()).rejects.toThrow(
        "Failed to fetch regions GeoJSON",
      );
    });

    it("should handle empty results", async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([]);

      // Act
      const result = await service.getRegionsGeoJson();

      // Assert
      expect(result.type).toBe("FeatureCollection");
      expect(result.features).toHaveLength(0);
    });

    it("should preserve MultiPolygon when it has multiple parts", async () => {
      // Arrange
      const mockResults = [
        {
          code: "84",
          name: "Multi-part Region",
          geojson_code: "FR-MULTI",
          geometry: JSON.stringify({
            type: "MultiPolygon",
            coordinates: [
              [
                [
                  [4.5, 45.5],
                  [5.5, 45.5],
                  [5.5, 46.5],
                  [4.5, 45.5],
                ],
              ],
              [
                [
                  [6.0, 47.0],
                  [7.0, 47.0],
                  [7.0, 48.0],
                  [6.0, 47.0],
                ],
              ],
            ],
          }),
        },
      ];

      mockPrismaService.$queryRaw.mockResolvedValue(mockResults);

      // Act
      const result = await service.getRegionsGeoJson();

      // Assert
      expect(result.features[0].geometry.type).toBe("MultiPolygon");
      expect(result.features[0].geometry.coordinates).toHaveLength(2);
    });
  });

  describe("getDepartmentsGeoJson", () => {
    it("should return FeatureCollection with converted geometries", async () => {
      // Arrange
      const mockResults = [
        {
          code: "01",
          name: "Ain",
          geojson_code: "FR-01",
          geometry: JSON.stringify({
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
          }),
        },
        {
          code: "75",
          name: "Paris",
          geojson_code: "FR-75",
          geometry: JSON.stringify({
            type: "Polygon",
            coordinates: [
              [
                [2.0, 48.5],
                [2.5, 48.5],
                [2.5, 49.0],
                [2.0, 49.0],
                [2.0, 48.5],
              ],
            ],
          }),
        },
      ];

      mockPrismaService.$queryRaw.mockResolvedValue(mockResults);

      // Act
      const result = await service.getDepartmentsGeoJson();

      // Assert
      expect(result.type).toBe("FeatureCollection");
      expect(result.features).toHaveLength(2);

      // First feature: MultiPolygon with one part converted to Polygon
      expect(result.features[0].type).toBe("Feature");
      expect(result.features[0].geometry.type).toBe("Polygon");
      expect(result.features[0].properties).toEqual({
        code: "01",
        apiCode: "FR-01",
        nom: "Ain",
      });

      // Second feature: Polygon remains Polygon
      expect(result.features[1].geometry.type).toBe("Polygon");
      expect(result.features[1].properties).toEqual({
        code: "75",
        apiCode: "FR-75",
        nom: "Paris",
      });
    });

    it("should throw InternalServerErrorException on database error", async () => {
      // Arrange
      const dbError = new Error("Database connection failed");
      mockPrismaService.$queryRaw.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.getDepartmentsGeoJson()).rejects.toThrow(
        InternalServerErrorException,
      );

      await expect(service.getDepartmentsGeoJson()).rejects.toThrow(
        "Failed to fetch departments GeoJSON",
      );
    });

    it("should handle empty results", async () => {
      // Arrange
      mockPrismaService.$queryRaw.mockResolvedValue([]);

      // Act
      const result = await service.getDepartmentsGeoJson();

      // Assert
      expect(result.type).toBe("FeatureCollection");
      expect(result.features).toHaveLength(0);
    });

    it("should correctly map properties for each feature", async () => {
      // Arrange
      const mockResults = [
        {
          code: "01",
          name: "Ain",
          geojson_code: "FR-01",
          geometry: JSON.stringify({
            type: "Polygon",
            coordinates: [
              [
                [4.5, 45.5],
                [5.5, 45.5],
                [5.5, 46.5],
                [4.5, 45.5],
              ],
            ],
          }),
        },
      ];

      mockPrismaService.$queryRaw.mockResolvedValue(mockResults);

      // Act
      const result = await service.getDepartmentsGeoJson();

      // Assert
      expect(result.features[0].properties.code).toBe("01");
      expect(result.features[0].properties.apiCode).toBe("FR-01");
      expect(result.features[0].properties.nom).toBe("Ain");
    });
  });
});
