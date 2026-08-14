// src/backend/common/filters/health-check-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

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
 * Only ServiceUnavailableException is caught. A genuine bug in the controller
 * still falls through to AllExceptionsFilter and still reaches Sentry.
 */
/**
 * The log message for every failed poll this filter records.
 *
 * Constant for the same reason `AllExceptionsFilter`'s is: `msg` is what Loki
 * groups on, so everything that varies per request — method, url, statusCode,
 * the health result — is a field on the log object instead. This used to
 * interpolate all three into the message, which made `msg` unique per route
 * and left "which health check is failing, and how often" unanswerable by
 * grouping, while the same three values sat in fields on the same line.
 */
const LOG_MESSAGE = "health check failed";

@Catch(ServiceUnavailableException)
export class HealthCheckExceptionFilter implements ExceptionFilter {
  constructor(
    @InjectPinoLogger(HealthCheckExceptionFilter.name)
    private readonly logger: PinoLogger,
  ) {}

  catch(exception: ServiceUnavailableException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = exception.getStatus();
    const data = exception.getResponse();

    // No request id is added here on purpose — the same reason
    // AllExceptionsFilter gives. nestjs-pino binds the id from genReqId to the
    // request's logger, so this line already carries it as `req.id`; a second
    // name for the same value (this used to set `traceId`) meant a Loki query
    // on one name found the failure and missed the request record.
    this.logger.error(
      {
        method: request.method,
        url: request.url,
        statusCode,
        health: data,
      },
      LOG_MESSAGE,
    );

    response.status(statusCode).json({
      data,
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode,
    });
  }
}
