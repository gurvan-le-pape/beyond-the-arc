// src/backend/modules/health/health.module.ts
import { Module } from "@nestjs/common";
import { TerminusModule } from "@nestjs/terminus";
import { PrismaModule } from "prisma/prisma.module";

import { HealthController } from "./health.controller";

@Module({
  imports: [
    // `logger: false`: Terminus otherwise writes its own "Health Check has
    // failed!" line for every failed poll, beside the request's completion
    // line that already carries the full result as `health` (see
    // HealthCheckExceptionFilter). One failed poll, one line.
    TerminusModule.forRoot({ logger: false }),
    PrismaModule,
  ],
  controllers: [HealthController],
})
export class HealthModule {}
