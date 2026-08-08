// src/backend/app.module.ts
import { randomUUID } from "node:crypto";

import { CommonModule } from "@common/common.module";
import { CACHE_TTL } from "@common/constants";
import { MetricsController } from "@common/controllers/metrics.controller";
import { HttpMetricsInterceptor } from "@common/interceptors";
import { StatsModule } from "@modules/stats/stats.module";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { SentryModule } from "@sentry/nestjs/setup";
import {
  makeCounterProvider,
  makeHistogramProvider,
  PrometheusModule,
} from "@willsoto/nestjs-prometheus";
import {
  ChampionshipsModule,
  ClubsModule,
  CommitteesModule,
  HealthModule,
  LeaderboardsModule,
  LeaguesModule,
  MatchesModule,
  PlayersModule,
  PoolsModule,
  TeamsModule,
} from "modules";
import { LoggerModule } from "nestjs-pino";
import { PrismaModule } from "prisma/prisma.module";

import { AllExceptionsFilter, TransformInterceptor } from "./common";

@Module({
  imports: [
    SentryModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === "production" ? "info" : "debug",
        transport:
          process.env.NODE_ENV === "production"
            ? undefined
            : { target: "pino-pretty", options: { colorize: true } },
        redact: ["req.headers.authorization", "req.headers.cookie"],
        // Emit the level as its label ("warn") rather than pino's numeric code
        // (40). Loki's level detection only recognises a level *string*, so
        // with the numeric default every backend line arrives as
        // detected_level="unknown": the log panel renders them uncoloured and
        // `| json | level="error"` matches nothing (`level=50` is required).
        // pino-pretty is unaffected — it renders and colours both forms
        // identically.
        formatters: { level: (label) => ({ level: label }) },
        autoLogging: true,
        genReqId: (req) =>
          (req.headers["x-request-id"] as string) ?? randomUUID(),
      },
    }),
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
      path: "/metrics",
      controller: MetricsController,
    }),
    CacheModule.register({
      isGlobal: true, // Makes it available everywhere
      ttl: CACHE_TTL.MODERATE_DATA, // Default TTL in seconds (5 minutes)
      max: 100, // Maximum number of items in cache
    }),
    ClubsModule,
    CommonModule,
    CommitteesModule,
    LeaguesModule,
    ChampionshipsModule,
    LeaderboardsModule,
    PoolsModule,
    MatchesModule,
    PlayersModule,
    TeamsModule,
    StatsModule,
    PrismaModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    { provide: APP_INTERCEPTOR, useClass: HttpMetricsInterceptor },
    makeCounterProvider({
      name: "http_requests_total",
      help: "Total HTTP requests",
      labelNames: ["method", "route", "status_code"],
    }),
    makeHistogramProvider({
      name: "http_request_duration_seconds",
      help: "HTTP request duration in seconds",
      labelNames: ["method", "route", "status_code"],
      buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    }),
  ],
})
export class AppModule {}
