// src/backend/modules/health/health.controller.ts
import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from "@nestjs/terminus";

import { PrismaHealthIndicator } from "./indicators/prisma.indicator";

/**
 * Health check endpoints for monitoring application status.
 * Used by monitoring systems, load balancers, and Kubernetes.
 */
@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  /**
   * Comprehensive health check covering all critical services.
   *
   * Checks:
   * - Database connectivity (Prisma)
   * - Memory usage (heap)
   * - Disk space
   *
   * @returns Health check results
   *
   * @example
   * GET /health
   * Response:
   * {
   *   "status": "ok",
   *   "info": {
   *     "database": { "status": "up" },
   *     "memory_heap": { "status": "up" },
   *     "storage": { "status": "up" }
   *   },
   *   "error": {},
   *   "details": { ... }
   * }
   */
  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: "Check application health",
    description: "Comprehensive health check for monitoring",
  })
  @ApiResponse({
    status: 200,
    description: "Application is healthy",
  })
  @ApiResponse({
    status: 503,
    description: "Application is unhealthy",
  })
  check() {
    return this.health.check([
      // Database connectivity - CRITICAL
      () => this.prismaHealth.isHealthy("database"),

      // Memory usage - warn if heap > 300MB
      () => this.memory.checkHeap("memory_heap", 300 * 1024 * 1024),

      // Disk space - warn if > 90% full
      () =>
        this.disk.checkStorage("storage", {
          path: "/",
          thresholdPercent: 0.9,
        }),
    ]);
  }

  /**
   * Liveness probe - is the application running?
   * Returns 200 if the app is alive (even if dependencies are down).
   *
   * Use for: Kubernetes liveness probes
   *
   * @example
   * GET /health/live
   * Response: { "status": "ok", "timestamp": "2024-02-05T10:00:00Z" }
   */
  @Get("live")
  @ApiOperation({
    summary: "Liveness probe",
    description: "Simple check to verify the application is running",
  })
  @ApiResponse({
    status: 200,
    description: "Application is alive",
  })
  getLiveness() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness probe - is the application ready to serve traffic?
   * Returns 200 only if database is accessible.
   *
   * Use for: Kubernetes readiness probes, load balancer health checks
   *
   * @example
   * GET /health/ready
   * Response:
   * {
   *   "status": "ok",
   *   "info": { "database": { "status": "up" } }
   * }
   */
  @Get("ready")
  @HealthCheck()
  @ApiOperation({
    summary: "Readiness probe",
    description: "Checks if the application is ready to serve traffic",
  })
  @ApiResponse({
    status: 200,
    description: "Application is ready",
  })
  @ApiResponse({
    status: 503,
    description: "Application is not ready (dependencies down)",
  })
  getReadiness() {
    return this.health.check([
      // Only check critical dependencies
      () => this.prismaHealth.isHealthy("database"),
    ]);
  }
}
