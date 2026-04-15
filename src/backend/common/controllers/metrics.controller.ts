// src/backend/common/controllers/metrics.controller.ts
import { SkipTransform } from "@common/interceptors";
import { Controller, Get, Res } from "@nestjs/common";
import { PrometheusController } from "@willsoto/nestjs-prometheus";

@Controller("/metrics")
@SkipTransform()
export class MetricsController extends PrometheusController {
  @Get()
  async index(@Res() response: unknown): Promise<string> {
    return super.index(response);
  }
}
