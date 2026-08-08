// src/backend/common/interceptors/http-metrics.interceptor.ts
import { METRICS_PATH } from "@common/constants";
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { Counter, Histogram } from "prom-client";
import { Observable, tap } from "rxjs";

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric("http_requests_total")
    private readonly counter: Counter<string>,
    @InjectMetric("http_request_duration_seconds")
    private readonly histogram: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const route = req.route?.path ?? req.path;

    // Prometheus scrapes this service every 15s, so counting /metrics puts
    // ~5,760 synthetic requests a day into the same series real traffic lands
    // in — a volume that is independent of whether anyone is using the site.
    // It also skews latency: /metrics answers in ~2.5 ms against ~15 ms for a
    // real endpoint, so any quantile over the histogram is dragged below
    // anything a user experiences.
    if (route === METRICS_PATH || req.path === METRICS_PATH) {
      return next.handle();
    }

    const start = Date.now();

    const record = (statusCode: number): void => {
      const labels = {
        method: req.method,
        route,
        status_code: String(statusCode),
      };
      this.counter.inc(labels);
      this.histogram.observe(labels, (Date.now() - start) / 1000);
    };

    return next.handle().pipe(
      tap({
        next: () => record(context.switchToHttp().getResponse().statusCode),
        // The status must come off the error, not off the response. Nest runs
        // exception filters *after* interceptors, so at this point the filter
        // has not written a status yet and `res.statusCode` is still the
        // default 200 — recording it would file every failure as a success,
        // which looks like working instrumentation and is not.
        error: (error: unknown) =>
          record(error instanceof HttpException ? error.getStatus() : 500),
      }),
    );
  }
}
