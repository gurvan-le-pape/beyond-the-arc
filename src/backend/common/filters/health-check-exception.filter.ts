// src/backend/common/filters/health-check-exception.filter.ts
import { attachFailureLog } from "@common/utils";
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Request, Response } from "express";

/**
 * A failed health check is a diagnosis, not an application error.
 *
 * Terminus reports one by throwing ServiceUnavailableException whose payload
 * is the health result itself — `{ status, info, error, details }`, where
 * `details` names the failing indicator and why. AllExceptionsFilter is
 * written for exceptions carrying `{ message, error: string }`, so it keeps
 * only the `error` map, drops `info` and `details`, and falls back to the
 * generic "Internal server error" message: strictly less than Terminus
 * produced. It also assigns that map into a field declared `string`.
 *
 * This filter is scoped to the health controller and takes precedence there.
 * It emits the same envelope the success path gets from TransformInterceptor,
 * so a healthy and an unhealthy poll differ only in `statusCode` and content.
 *
 * It also keeps failed polls out of Sentry. The gates are `checkHeap(300 MB)`
 * and `checkStorage(90 %)` — conditions that persist for as long as they last,
 * so every poll while one holds would be a separate captured event. The failure
 * is already a 503 on a monitored endpoint and an `error`-level log line.
 *
 * That line is the request's own completion line: like AllExceptionsFilter,
 * this filter writes none of its own, and attaches the health result to it as
 * `health` — see attachFailureLog in request-log.util.ts.
 *
 * Only ServiceUnavailableException is caught. A genuine bug in the controller
 * still falls through to AllExceptionsFilter and still reaches Sentry.
 */
@Catch(ServiceUnavailableException)
export class HealthCheckExceptionFilter implements ExceptionFilter {
  catch(exception: ServiceUnavailableException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = exception.getStatus();
    const data = exception.getResponse();

    // No exception attached: its serialized form would repeat `data` as
    // `err.response`, doubling the line for no new information. pino-http's
    // own `failed with status code 503` is accurate here — that is what
    // happened, and `health` says why.
    attachFailureLog(response, { health: data });

    response.status(statusCode).json({
      data,
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode,
    });
  }
}
