// src/backend/common/filters/all-exceptions.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import * as Sentry from "@sentry/nestjs";
import { Request, Response } from "express";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";

interface DevErrorDetails {
  stack: string | undefined;
  // Narrowed to a safe string rather than the raw `cause`, which may contain
  // DB queries, tokens, or internal objects that must not be exposed.
  cause: string | undefined;
}

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  path: string;
  timestamp: string;
  details?: DevErrorDetails;
}

/**
 * Programmer errors: exceptions that indicate a bug in application code, not
 * an expected operational failure. These are logged at `error` level even when
 * they surface as 5xx responses, and should ideally trigger a separate alert
 * path (e.g. PagerDuty, Sentry) rather than being treated as ordinary runtime
 * errors.
 *
 * This set is intentionally conservative. Add to it only when you are certain
 * that the exception type unambiguously indicates a programming mistake:
 *   - TypeError: property access on undefined/null, wrong argument type
 *   - RangeError: out-of-bounds array index, invalid numeric argument
 *   - ReferenceError: access to an undeclared variable (transpiled code)
 *
 * Do NOT add application-level error classes here — those are operational.
 */
const PROGRAMMER_ERROR_TYPES = new Set<Function>([
  TypeError,
  RangeError,
  ReferenceError,
]);

function isProgrammerError(exception: unknown): boolean {
  return (
    exception instanceof Error &&
    PROGRAMMER_ERROR_TYPES.has(exception.constructor)
  );
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    // Named logger so filter logs are scoped to this class in Loki/Datadog,
    // rather than sharing the root logger context with every other component.
    @InjectPinoLogger(AllExceptionsFilter.name)
    private readonly logger: PinoLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);

    // Only actionable failures go to Sentry. Capturing everything (the old
    // @SentryExceptionCaptured decorator) meant every bot probing a 404 on
    // this public API burned quota and diluted alerting.
    if (errorResponse.statusCode >= 500) {
      Sentry.captureException(exception);
    }

    this.logError(exception, request, errorResponse);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = "Internal server error";
    // Default covers the `string` exception case and any unknown throw type.
    // HttpException and Error branches overwrite this with a more specific value.
    let error = this.httpStatusToErrorName(HttpStatus.INTERNAL_SERVER_ERROR);

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      // Fall back to the status-derived name; may be overridden below if the
      // response object carries an explicit `error` field.
      error = this.httpStatusToErrorName(statusCode);

      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        message =
          (exceptionResponse as { message?: string | string[] }).message ??
          message;
        error = (exceptionResponse as { error?: string }).error ?? error;
      }
    } else if (process.env.NODE_ENV === "development") {
      // Unexpected errors (Prisma failures, TypeErrors, string throws) keep
      // their real message in development only. In production both the name
      // and the message can reveal internals (driver errors carry query
      // fragments; even "PrismaClientKnownRequestError" is information) —
      // clients get the generic 500 while the full exception goes to the
      // logs and Sentry.
      if (exception instanceof Error) {
        error = exception.name;
        message = exception.message;
      } else if (typeof exception === "string") {
        message = exception;
      }
    }

    const errorResponse: ErrorResponse = {
      statusCode,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === "development" && exception instanceof Error) {
      errorResponse.details = {
        stack: exception.stack,
        // Only expose the cause message, never the raw object — it may contain
        // DB queries, tokens, or internal state.
        cause:
          exception.cause instanceof Error
            ? exception.cause.message
            : undefined,
      };
    }

    return errorResponse;
  }

  /**
   * Converts an HTTP status code to a PascalCase error name string.
   * e.g. 404 → "NotFound", 422 → "UnprocessableEntity"
   *
   * Implementation note: TypeScript numeric enums are bidirectionally mapped
   * at runtime, so `HttpStatus[404]` yields `"NOT_FOUND"`. This is a
   * well-specified TypeScript behaviour (§8.4), not an implementation detail
   * we stumbled into — but it does mean this breaks if NestJS ever migrates
   * HttpStatus away from a numeric enum. A runtime guard (`typeof key ===
   * "string"`) is already present via the `key` narrowing below.
   */
  private httpStatusToErrorName(statusCode: number): string {
    const key = HttpStatus[statusCode] as string | undefined;
    if (!key) return "UnknownError";

    // HttpStatus enum keys are UPPER_SNAKE_CASE; convert to PascalCase.
    return key
      .toLowerCase()
      .replaceAll(/_([a-z])/g, (_, char: string) => char.toUpperCase())
      .replace(/^[a-z]/, (char) => char.toUpperCase());
  }

  /**
   * Builds the human-readable log line message.
   *
   * For unexpected errors the *response* message is sanitized in production,
   * so logs use the real exception message — the client must not see it, the
   * logs must. Array messages (ValidationPipe) are joined because logging an
   * array directly produces "[object Array]" in some Pino transports.
   */
  private toLogMessage(
    exception: unknown,
    errorResponse: ErrorResponse,
  ): string {
    if (!(exception instanceof HttpException) && exception instanceof Error) {
      return exception.message;
    }
    if (Array.isArray(errorResponse.message)) {
      return errorResponse.message.join(", ");
    }
    return errorResponse.message;
  }

  private logError(
    exception: unknown,
    request: Request,
    errorResponse: ErrorResponse,
  ): void {
    const { method, url, ip, headers } = request;

    const message = this.toLogMessage(exception, errorResponse);

    // traceId is set by pinoHttp's genReqId and attached via customProps.
    // It correlates this error log with all other logs in the same request
    // chain, which is essential for reconstructing request history in Loki.
    const logContext = {
      method,
      url,
      ip,
      traceId: request.id ?? null,
      userAgent: headers["user-agent"] ?? "unknown",
      statusCode: errorResponse.statusCode,
    };

    if (errorResponse.statusCode >= 500) {
      if (isProgrammerError(exception)) {
        // Programmer errors (TypeError, RangeError, etc.) indicate a bug in
        // application code. Log them with a distinct `programmerError: true`
        // field so alert rules and dashboards can route them separately from
        // expected operational failures (e.g. DB timeouts, third-party 5xx).
        //
        // NOTE: this flag is only valuable if your alerting layer (Pino
        // transport, log shipper, or APM) explicitly routes on it. Document
        // the routing rule in docs/ops/runbook.md so it isn't stripped as
        // dead metadata in a future cleanup.
        this.logger.error(
          { err: exception, ...logContext, programmerError: true },
          `[PROGRAMMER ERROR] ${method} ${url} - ${errorResponse.statusCode} - ${message}`,
        );
      } else {
        this.logger.error(
          { err: exception, ...logContext },
          `${method} ${url} - ${errorResponse.statusCode} - ${message}`,
        );
      }
    } else if (errorResponse.statusCode >= 400) {
      this.logger.warn(
        logContext,
        `${method} ${url} - ${errorResponse.statusCode} - ${message}`,
      );
    }
    // Intentionally not logging 1xx/2xx/3xx — those are success/redirect
    // paths and should never reach this filter under normal circumstances.
  }
}
