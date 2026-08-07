// src/backend/modules/health/health.controller.ts
import { HealthCheckExceptionFilter } from "@common/filters";
import { Controller, Get, UseFilters } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from "@nestjs/terminus";
import { PrismaService } from "prisma/prisma.service";

/**
 * Health check endpoints for monitoring application status.
 * Used by load balancers, Kubernetes probes, and Grafana alerting.
 *
 * A failed check reports which indicator failed, so it does not go through
 * AllExceptionsFilter — see HealthCheckExceptionFilter for why.
 */
@ApiTags("health")
@Controller("health")
@UseFilters(HealthCheckExceptionFilter)
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
  ) {}

  /**
   * Full health check — database, memory heap, and disk space.
   * Returns 503 if any check fails.
   */
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: "Check application health" })
  @ApiResponse({ status: 200, description: "Application is healthy" })
  @ApiResponse({ status: 503, description: "Application is unhealthy" })
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck("database", this.prisma.client),
      () => this.memory.checkHeap("memory_heap", 300 * 1024 * 1024),
      () =>
        this.disk.checkStorage("storage", { path: "/", thresholdPercent: 0.9 }),
    ]);
  }

  /**
   * Liveness probe — confirms the process is running.
   * Always returns 200. Use for Kubernetes liveness probes.
   */
  @Get("live")
  @ApiOperation({ summary: "Liveness probe" })
  @ApiResponse({ status: 200, description: "Application is alive" })
  getLiveness() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness probe — confirms the app can serve traffic.
   * Returns 503 if the database is unreachable.
   * Use for Kubernetes readiness probes and load balancer health checks.
   */
  @Get("ready")
  @HealthCheck()
  @ApiOperation({ summary: "Readiness probe" })
  @ApiResponse({ status: 200, description: "Application is ready" })
  @ApiResponse({ status: 503, description: "Application is not ready" })
  getReadiness() {
    return this.health.check([
      () => this.prismaHealth.pingCheck("database", this.prisma.client),
    ]);
  }
}
