// src/backend/app.module.ts
import { randomUUID } from "node:crypto";

import { CommonModule } from "@common/common.module";
import { CACHE_TTL } from "@common/constants/cache-ttls";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";
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

import { AllExceptionsFilter } from "./common";

@Module({
  imports: [
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
    PrismaModule,
    HealthModule,
  ],
  controllers: [],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}
