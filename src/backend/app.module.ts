// src/backend/app.module.ts
import { randomUUID } from "node:crypto";

import { CommonModule } from "@common/common.module";
import { CACHE_TTL } from "@common/constants/cache-ttls";
import { MetricsController } from "@common/controllers/metrics.controller";
import { StatsModule } from "@modules/stats/stats.module";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { SentryModule } from "@sentry/nestjs/setup";
import { PrometheusModule } from "@willsoto/nestjs-prometheus";
import {
  ChampionshipsModule,
  ClubsModule,
  CommitteesModule,
  GeoModule,
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
    GeoModule,
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
  ],
})
export class AppModule {}
