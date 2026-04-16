// src/backend/common/interceptors/http-metrics.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { InjectMetric } from "@willsoto/nestjs-prometheus";
import { Counter, Histogram } from "prom-client";
import { Observable, tap } from "rxjs";

@Injectable()
export class HttpMetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric("http_requests_total") private counter: Counter<string>,
    @InjectMetric("http_request_duration_seconds")
    private histogram: Histogram<string>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const labels = {
          method: req.method,
          route: req.route?.path ?? req.path,
          status_code: String(res.statusCode),
        };
        this.counter.inc(labels);
        this.histogram.observe(labels, (Date.now() - start) / 1000);
      }),
    );
  }
}
