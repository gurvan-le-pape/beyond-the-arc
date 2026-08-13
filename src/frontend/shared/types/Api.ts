// src/frontend/shared/types/Api.ts
/**
 * Standard API error response from backend.
 * Matches the format returned by AllExceptionsFilter.
 */
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[]; // Array for validation errors
  error: string; // e.g., "NotFoundException"
  path: string;
  timestamp: string;
}

/**
 * Standard API success response from backend.
 * Matches the format returned by TransformInterceptor.
 */
export interface ApiResponse<T> {
  data: T;
  meta?: {
    count?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  timestamp: string;
  path: string;
  statusCode: number;
}

/**
 * Simplified error object after interceptor processing.
 * Array messages are joined into a single string.
 */
export class ApiError extends Error {
  statusCode: number;
  error: string;
  path?: string;
  timestamp?: string;
  /**
   * The backend's `x-request-id` for the failed call, read off the response
   * header rather than the body — it is not part of the error envelope above.
   *
   * It is the same value the backend logs as `req.id`, so it is what joins a
   * frontend failure to the backend line that caused it:
   * `{service="backend"} | json | req_id="…"`. Absent when the request never
   * reached the backend (a network error or a timeout has no response, and so
   * no id).
   */
  requestId?: string;

  constructor(params: {
    statusCode: number;
    message: string;
    error: string;
    path?: string;
    timestamp?: string;
    requestId?: string;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.statusCode = params.statusCode;
    this.error = params.error;
    this.path = params.path;
    this.timestamp = params.timestamp;
    this.requestId = params.requestId;
  }
}
