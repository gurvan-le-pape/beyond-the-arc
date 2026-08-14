// src/backend/modules/health/dto/health.response.dto.ts
import { ApiProperty } from "@nestjs/swagger";

/**
 * One indicator's verdict inside a Terminus health result.
 *
 * Terminus keys these by indicator name (`database`, `memory_heap`,
 * `storage`), so the containing maps are documented as
 * `additionalProperties` rather than as fixed fields — adding an indicator to
 * `health.controller.ts` must not require editing a DTO.
 */
export class HealthIndicatorDto {
  @ApiProperty({
    description: 'Indicator verdict — "up" or "down"',
    example: "up",
    type: String,
  })
  status!: string;
}

/**
 * The Terminus health result, as it appears **inside the envelope's `data`**.
 *
 * `@HealthCheck()` from `@nestjs/terminus` documents this object as the whole
 * response body. It is not: `TransformInterceptor` wraps the success path and
 * `HealthCheckExceptionFilter` wraps the 503, so both statuses ship it under
 * `data` alongside `timestamp`, `path` and `statusCode`. Measured on the wire
 * — `/api/health` 200 returns
 * `{ data: { status, info, error, details }, timestamp, path, statusCode }`.
 *
 * Declaring it as a DTO is what lets the envelope decorators describe these
 * three routes the same way as the other 31, instead of leaving Terminus's
 * unwrapped schema to contradict them.
 */
export class HealthCheckResultDto {
  @ApiProperty({
    description: 'Overall result — "ok" when every indicator is up',
    example: "ok",
    type: String,
  })
  status!: string;

  @ApiProperty({
    description: "Indicators that are up, keyed by indicator name",
    example: { database: { status: "up" } },
    additionalProperties: { $ref: "#/components/schemas/HealthIndicatorDto" },
    nullable: true,
  })
  info?: Record<string, HealthIndicatorDto>;

  @ApiProperty({
    description: "Indicators that are down, keyed by indicator name",
    example: {},
    additionalProperties: { $ref: "#/components/schemas/HealthIndicatorDto" },
    nullable: true,
  })
  error?: Record<string, HealthIndicatorDto>;

  @ApiProperty({
    description: "Every indicator's verdict, up or down, keyed by name",
    example: {
      database: { status: "up" },
      memory_heap: { status: "up" },
      storage: { status: "up" },
    },
    additionalProperties: { $ref: "#/components/schemas/HealthIndicatorDto" },
  })
  details!: Record<string, HealthIndicatorDto>;
}

/**
 * The liveness probe's payload — it does not run Terminus indicators, it just
 * answers that the process is up.
 *
 * `/api/health/live` had no documented response body at all: no `@HealthCheck()`
 * to supply one and a bare `@ApiResponse({ status: 200, description })` with no
 * `type`, which produces a response with a `description` and no `content`.
 */
export class LivenessResponseDto {
  @ApiProperty({
    description: 'Always "ok" — reaching the handler is the check',
    example: "ok",
    type: String,
  })
  status!: string;

  @ApiProperty({
    description:
      "When the probe answered, as an ISO 8601 UTC instant. Distinct from the envelope's own `timestamp`, though the two are produced microseconds apart.",
    example: "2026-02-05T10:00:00.000Z",
    type: String,
  })
  timestamp!: string;
}
