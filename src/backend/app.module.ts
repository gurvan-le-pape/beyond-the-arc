// src/backend/app.module.ts
import { CommonModule } from "@common/common.module";
import { CACHE_MAX_ENTRIES, CACHE_TTL, METRICS_PATH } from "@common/constants";
import { MetricsController } from "@common/controllers/metrics.controller";
import { AllExceptionsFilter } from "@common/filters";
import {
  HttpMetricsInterceptor,
  TransformInterceptor,
} from "@common/interceptors";
import {
  BoundedMemoryStore,
  resolveRequestId,
  serializeRequestLog,
} from "@common/utils";
import { ChampionshipsModule } from "@modules/competitions/championships/championships.module";
import { LeaderboardsModule } from "@modules/competitions/leaderboards/leaderboards.module";
import { PoolsModule } from "@modules/competitions/pools/pools.module";
import { HealthModule } from "@modules/health/health.module";
import { MatchesModule } from "@modules/matches/matches.module";
import { ClubsModule } from "@modules/organizations/clubs/clubs.module";
import { CommitteesModule } from "@modules/organizations/committees/committees.module";
import { LeaguesModule } from "@modules/organizations/leagues/leagues.module";
import { PlayersModule } from "@modules/players/players.module";
import { StatsModule } from "@modules/stats/stats.module";
import { TeamsModule } from "@modules/teams/teams.module";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { SentryModule } from "@sentry/nestjs/setup";
import {
  makeCounterProvider,
  makeHistogramProvider,
  PrometheusModule,
} from "@willsoto/nestjs-prometheus";
import { Keyv } from "keyv";
import { LoggerModule } from "nestjs-pino";
import { PrismaModule } from "prisma/prisma.module";

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
        // An explicit header allowlist, not a redact list. pino-http's default
        // `req` serializer emits every header plus remoteAddress/remotePort,
        // which behind Cloudflare + Nginx means the visitor's IP in every line
        // for Loki's 31-day retention — see request-log.util.ts for why the
        // allowlist replaces `redact` rather than extending it.
        serializers: { req: serializeRequestLog },
        // Emit the level as its label ("warn") rather than pino's numeric code
        // (40). Loki's level detection only recognises a level *string*, so
        // with the numeric default every backend line arrives as
        // detected_level="unknown": the log panel renders them uncoloured and
        // `| json | level="error"` matches nothing (`level=50` is required).
        // pino-pretty is unaffected — it renders and colours both forms
        // identically.
        formatters: { level: (label) => ({ level: label }) },
        // Log every request except Prometheus scraping this service. Each
        // scrape emits a full request line including the header block, and at
        // a 15s interval that is a constant ~5 MB/day of Loki's 31-day
        // retention spent on the monitoring stack watching itself.
        autoLogging: {
          ignore: (req) => req.url?.split("?")[0] === METRICS_PATH,
        },
        // Also the only place the id is written back to the caller — see
        // resolveRequestId for why it hangs off genReqId rather than an
        // interceptor.
        genReqId: (req, res) => resolveRequestId(req, res),
      },
    }),
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
      path: METRICS_PATH,
      controller: MetricsController,
    }),
    CacheModule.register({
      isGlobal: true, // Makes it available everywhere
      ttl: CACHE_TTL.MODERATE_DATA, // Default TTL in milliseconds (5 minutes)
      // The ceiling has to be expressed as a store. `max` on this object is
      // silently discarded: with no `stores` supplied, @nestjs/cache-manager@3
      // forwards only ttl/refreshThreshold/nonBlocking to createCache(), which
      // then builds a `new Keyv()` over an unbounded Map. Since the cache is
      // keyed by request URL on a public unauthenticated API, that is an
      // open-ended heap. Keyv still owns TTL and expiry; the store only bounds
      // how many entries may exist at once.
      stores: [
        new Keyv({
          store: new BoundedMemoryStore(CACHE_MAX_ENTRIES),
          ttl: CACHE_TTL.MODERATE_DATA,
        }),
      ],
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
