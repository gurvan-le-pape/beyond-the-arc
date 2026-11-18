// src/backend/common/filters/all-exceptions.filter.ts
import { ApiErrorResponseDto } from "@common/dto";
import { attachFailureLog } from "@common/utils";
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import * as Sentry from "@sentry/nestjs";
import { Request, Response } from "express";

interface DevErrorDetails {
  stack: string | undefined;
  // Narrowed to a safe string rather than the raw `cause`, which may contain
  // DB queries, tokens, or internal objects that must not be exposed.
  cause: string | undefined;
}

/**
 * What this filter sends: the documented contract plus a development-only
 * extra.
 *
 * Extending `ApiErrorResponseDto` rather than restating its five fields is
 * what keeps the emitted body and the published one the same object — a field
 * added to the DTO stops compiling here until it is actually sent, and a field
 * dropped here stops compiling too. They were separate declarations before,
 * and the drift was live: the DTO's ancestor in the OpenAPI examples claimed
 * `error: "NotFoundException"` while this filter has always derived the name
 * from the status.
 *
 * `details` is not on the DTO on purpose — it is added only when
 * `NODE_ENV === "development"`, so it is not part of the deployed contract.
 */
interface ErrorResponse extends ApiErrorResponseDto {
  details?: DevErrorDetails;
}

/**
 * Programmer errors: exceptions that indicate a bug in application code, not
 * an expected operational failure. Their 5xx log line carries
 * `programmerError: true`, the only field that separates them from an
 * operational 5xx such as a database timeout.
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

    this.attachLog(exception, response, errorResponse);

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

      const parsed = this.parseHttpExceptionResponse(exception);
      message = parsed.message ?? message;
      error = parsed.error ?? error;
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
   * Pulls `message` and `error` out of an HttpException's payload, which Nest
   * lets be either a string or an object.
   *
   * `error` is adopted only when it really is a string. Not every payload
   * follows Nest's `{ message, error }` shape — Terminus's health result puts
   * an indicator *map* there — and assigning one into a field declared
   * `string` makes the type a lie at runtime and ships a body no client can
   * parse against the contract. Health checks have their own filter
   * (HealthCheckExceptionFilter); this guard is what keeps any other
   * non-conforming payload from doing the same thing silently.
   *
   * Returns `undefined` for a field the payload does not supply, so the
   * caller keeps its own default.
   */
  private parseHttpExceptionResponse(exception: HttpException): {
    message?: string | string[];
    error?: string;
  } {
    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === "string") {
      return { message: exceptionResponse };
    }
    if (typeof exceptionResponse !== "object" || exceptionResponse === null) {
      return {};
    }

    const { message, error } = exceptionResponse as {
      message?: string | string[];
      error?: unknown;
    };

    return {
      message,
      error: typeof error === "string" ? error : undefined,
    };
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

  /**
   * Hands this failure's fields to the request's own completion line rather
   * than writing a line of its own.
   *
   * pino-http already logs every request — method, url, status, response time,
   * `req.id` — so a line from here as well would record each failure twice.
   * What only this filter knows is added to that line instead:
   *
   * - `message`, the exception's message. Never interpolated into `msg`, which
   *   has to stay a constant to be groupable: every 404 from a bot scanning ids
   *   would otherwise be its own message string.
   * - for a 5xx, the exception itself, as `err` with its stack — replacing the
   *   `failed with status code 500` error pino-http invents when it has none —
   *   and `programmerError: true` when it is a bug (see
   *   {@link PROGRAMMER_ERROR_TYPES}).
   *
   * `programmerError` is read at **query time**, not by an alert. Nothing
   * routes on it: every Grafana rule queries Prometheus, and Promtail attaches
   * no pipeline stage, so it is not a Loki label. It does not need to be one —
   * `| json` parses the line and filters on any field, label or not:
   *
   *   {service="backend"} | json | programmerError="true"
   *
   * That query is written down in docs/observability.md § "Separating bugs
   * from operational failures"; keep the two in step if this field is renamed.
   *
   * No `ip`: Express is not configured with `trust proxy`, so behind Cloudflare
   * and Nginx `request.ip` is the Docker gateway, identical on every line, and
   * would silently become a visitor's address the day that setting changed.
   */
  private attachLog(
    exception: unknown,
    response: Response,
    errorResponse: ErrorResponse,
  ): void {
    const message = this.toLogMessage(exception, errorResponse);

    if (errorResponse.statusCode < 500) {
      attachFailureLog(response, { message });
      return;
    }

    attachFailureLog(
      response,
      isProgrammerError(exception)
        ? { message, programmerError: true }
        : { message },
      exception,
    );
  }
}
