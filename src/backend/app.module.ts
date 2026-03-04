// src/backend/app.module.ts
import { CACHE_TTL } from "@common/constants/cache-ttls";
import { CacheModule } from "@nestjs/cache-manager";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import {
  ChampionshipsModule,
  ClubsModule,
  CommitteesModule,
  GeoModule,
  LeaderboardsModule,
  LeaguesModule,
  MatchesModule,
  PlayersModule,
  PoolsModule,
  TeamsModule,
} from "modules";
import { PrismaModule } from "prisma/prisma.module";

import { RequestIdMiddleware } from "./common/middleware/request-id.middleware";

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true, // Makes it available everywhere
      ttl: CACHE_TTL.MODERATE_DATA, // Default TTL in seconds (5 minutes)
      max: 100, // Maximum number of items in cache
    }),
    ClubsModule,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes("*");
  }
}
