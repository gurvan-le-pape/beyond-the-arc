// src/backend/common/interceptors/logging.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

/**
 * Interceptor that logs incoming requests and outgoing responses.
 * Useful for debugging and monitoring API usage.
 *
 * Logs:
 * - HTTP method and URL
 * - Request timestamp
 * - Response time
 * - Response status code
 * - Request ID (if RequestIdMiddleware is installed)
 *
 * @example
 * // Apply globally in main.ts
 * app.useGlobalInterceptors(new LoggingInterceptor());
 *
 * @example
 * Output:
 * [ChampionshipsController] GET /api/championships?level=regional&id=1 - 45ms - 200
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url } = request;
    const requestId = request.id; // Will be undefined if RequestIdMiddleware not installed
    const startTime = Date.now();

    // Extract controller name for better log context
    const controllerName = context.getClass().name;

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          // Include request ID if available
          const logMessage = requestId
            ? `[${requestId}] [${controllerName}] ${method} ${url} - ${duration}ms - ${statusCode}`
            : `[${controllerName}] ${method} ${url} - ${duration}ms - ${statusCode}`;

          this.logger.log(logMessage);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          // Include request ID if available
          const logMessage = requestId
            ? `[${requestId}] [${controllerName}] ${method} ${url} - ${duration}ms - ${statusCode} - ${error.message}`
            : `[${controllerName}] ${method} ${url} - ${duration}ms - ${statusCode} - ${error.message}`;

          this.logger.error(logMessage);
        },
      }),
    );
  }
}
