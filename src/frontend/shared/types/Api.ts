// src/frontend/shared/types/Api.ts
import type { components } from "./api.generated";

/**
 * The error body the backend sends, taken from the contract rather than
 * restated here.
 *
 * This used to be a hand-written interface whose comment claimed
 * `error: "NotFoundException"`. The API has always sent the HTTP status name —
 * `"Not Found"` — and nothing checked the claim, because the error body was the
 * one payload with no generated type: the two `as Partial<ApiErrorResponse>`
 * casts below and in `server-api-client.ts` were asserting against a local
 * belief. Aliasing the generated schema makes them assertions against the
 * document the backend emits.
 */
export type ApiErrorResponse = components["schemas"]["ApiErrorResponseDto"];

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
