// src/backend/modules/health/health.controller.ts
import { ApiEnvelope } from "@common/decorators";
import { HealthCheckExceptionFilter } from "@common/filters";
import { Controller, Get, HttpStatus, UseFilters } from "@nestjs/common";
import { ApiExtraModels, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  DiskHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from "@nestjs/terminus";
import { PrismaService } from "prisma/prisma.service";

import {
  HealthCheckResultDto,
  HealthIndicatorDto,
  LivenessResponseDto,
} from "./dto/health.response.dto";

/**
 * Health check endpoints for monitoring application status.
 * Used by load balancers, Kubernetes probes, and Grafana alerting.
 *
 * A failed check reports which indicator failed, so it does not go through
 * AllExceptionsFilter — see HealthCheckExceptionFilter for why.
 *
 * `@HealthCheck()` is passed `swaggerDocumentation: false`. Left on, it
 * registers its own 200 and 503 schemas describing the bare
 * `{ status, info, error, details }` object as the whole response body — true
 * before this API had an envelope, not true since, and it silently outranked
 * the `@ApiEnvelope` declarations below it (decorators apply bottom-up, so the
 * *higher* one writes its status key last and wins). Turning its documentation
 * off removes the conflict instead of winning it by ordering, which no reader
 * would see and any reordering would undo.
 *
 * `noCache: true` is passed explicitly because it must be: the option object
 * replaces Terminus's defaults wholesale rather than merging with them, so
 * passing only `swaggerDocumentation` would leave `noCache` undefined and drop
 * the `Cache-Control: no-cache, no-store, must-revalidate` header these two
 * routes send today.
 */
@ApiTags("health")
@Controller("health")
@UseFilters(HealthCheckExceptionFilter)
// `HealthCheckResultDto` names `HealthIndicatorDto` from inside an
// `additionalProperties`, which is a hand-written `$ref` rather than a `type:`
// the plugin can follow — so nothing else registers it and the reference
// dangles. `openapi-typescript` treats an unresolvable `$ref` as fatal and
// fails `npm run typegen`, which is why this is not cosmetic.
@ApiExtraModels(HealthIndicatorDto)
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
  @HealthCheck({ noCache: true, swaggerDocumentation: false })
  @ApiOperation({ summary: "Check application health" })
  @ApiEnvelope(HealthCheckResultDto, "Application is healthy")
  @ApiEnvelope(
    HealthCheckResultDto,
    "Application is unhealthy — `data.error` names the failing indicators",
    HttpStatus.SERVICE_UNAVAILABLE,
  )
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
  @ApiEnvelope(LivenessResponseDto, "Application is alive")
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
  @HealthCheck({ noCache: true, swaggerDocumentation: false })
  @ApiOperation({ summary: "Readiness probe" })
  @ApiEnvelope(HealthCheckResultDto, "Application is ready")
  @ApiEnvelope(
    HealthCheckResultDto,
    "Application is not ready — the database is unreachable",
    HttpStatus.SERVICE_UNAVAILABLE,
  )
  getReadiness() {
    return this.health.check([
      () => this.prismaHealth.pingCheck("database", this.prisma.client),
    ]);
  }
}
