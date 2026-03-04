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
export interface ApiError {
  statusCode: number;
  message: string; // Always a string (arrays are joined)
  error: string;
  path?: string;
  timestamp?: string;
}
