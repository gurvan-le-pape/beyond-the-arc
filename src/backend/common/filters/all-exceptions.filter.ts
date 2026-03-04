// src/backend/common/filters/all-exceptions.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

/**
 * Standard error response structure.
 */
interface ErrorResponse {
  /**
   * HTTP status code
   */
  statusCode: number;

  /**
   * Error message (user-friendly)
   */
  message: string | string[];

  /**
   * Error type/name
   */
  error: string;

  /**
   * Request path
   */
  path: string;

  /**
   * Timestamp of the error
   */
  timestamp: string;

  /**
   * Additional error details (only in development)
   */
  details?: unknown;
}

/**
 * Global exception filter that catches all exceptions and formats them consistently.
 *
 * Features:
 * - Consistent error response format
 * - Proper logging with stack traces
 * - Development vs production error details
 * - Handles both HTTP and unexpected exceptions
 *
 * @example
 * // Apply globally in main.ts
 * app.useGlobalFilters(new AllExceptionsFilter());
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);

    // Log the error with appropriate level
    this.logError(exception, request, errorResponse);

    // Send the response
    response.status(errorResponse.statusCode).json(errorResponse);
  }

  /**
   * Builds a standardized error response from any exception.
   *
   * @param exception - The caught exception
   * @param request - The Express request object
   * @returns Formatted error response
   */
  private buildErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = "Internal server error";
    let error = "InternalServerError";

    // Handle NestJS HTTP exceptions
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === "string") {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === "object" &&
        exceptionResponse !== null
      ) {
        message =
          (exceptionResponse as { message?: string | string[] }).message ||
          message;
        error = (exceptionResponse as { error?: string }).error || error;
      }
    }
    // Handle standard Error objects
    else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }
    // Handle unknown exceptions
    else if (typeof exception === "string") {
      message = exception;
    }

    const errorResponse: ErrorResponse = {
      statusCode,
      message,
      error,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    // Include additional details in development mode
    if (process.env.NODE_ENV === "development" && exception instanceof Error) {
      errorResponse.details = {
        stack: exception.stack,
        cause: exception.cause,
      };
    }

    return errorResponse;
  }

  /**
   * Logs the error with appropriate context and level.
   *
   * @param exception - The caught exception
   * @param request - The Express request object
   * @param errorResponse - The formatted error response
   */
  private logError(
    exception: unknown,
    request: Request,
    errorResponse: ErrorResponse,
  ): void {
    const { method, url, ip, headers } = request;
    const userAgent = headers["user-agent"] || "unknown";

    const logContext = {
      method,
      url,
      ip,
      userAgent,
      statusCode: errorResponse.statusCode,
    };

    // Log at different levels based on status code
    if (errorResponse.statusCode >= 500) {
      // Server errors - log as error with full stack
      this.logger.error(
        `${method} ${url} - ${errorResponse.statusCode} - ${errorResponse.message}`,
        exception instanceof Error ? exception.stack : String(exception),
        JSON.stringify(logContext),
      );
    } else if (errorResponse.statusCode >= 400) {
      // Client errors - log as warning
      this.logger.warn(
        `${method} ${url} - ${errorResponse.statusCode} - ${errorResponse.message}`,
        JSON.stringify(logContext),
      );
    }
  }
}
