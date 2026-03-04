// src/backend/modules/health/health.module.ts
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { PrismaModule } from "prisma/prisma.module";

import { HealthController } from "./health.controller";
import { PrismaHealthIndicator } from "./indicators/prisma.indicator";

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule],
  controllers: [HealthController],
  providers: [PrismaHealthIndicator],
})
export class HealthModule {}
