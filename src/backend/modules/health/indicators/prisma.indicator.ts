// src/backend/modules/health/indicators/prisma.indicator.ts
import { Injectable } from "@nestjs/common";
import type { HealthIndicatorResult } from "@nestjs/terminus";
import { PrismaService } from "prisma/prisma.service";

/**
 * Health indicator for Prisma database connection.
 * Performs a simple query to verify database connectivity.
 */
@Injectable()
export class PrismaHealthIndicator {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Checks if the database is reachable and responsive.
   * Executes a lightweight query (SELECT 1) to verify connectivity.
   *
   * @param key - The key for the health check result (e.g., 'database')
   * @returns Health check result
   * @throws Error if database is unreachable
   */
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Simple query to check database connectivity
      // This is very lightweight and doesn't lock tables
      await this.prismaService.$queryRaw`SELECT 1`;

      return {
        [key]: {
          status: "up",
          message: "Database connection is healthy",
        },
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown database error";

      throw new Error(`Database check failed: ${errorMessage}`);
    }
  }
}
