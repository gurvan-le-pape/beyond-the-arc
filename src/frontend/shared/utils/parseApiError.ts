// src/frontend/shared/utils/parseApiError.ts
import { REQUEST_ID_HEADER } from "@/shared/constants";
import type { ApiErrorResponse } from "@/shared/types";
import { ApiError } from "@/shared/types";

/**
 * Normalises anything thrown by a client-side request into an `ApiError`.
 *
 * Total over `unknown` and never throws — an axios error, a plain `Error`, a
 * string and a value of no recognised shape all produce an `ApiError`, so
 * callers branch on the result rather than guarding the call.
 *
 * **`statusCode: 0` means the request never got an HTTP response** — a network
 * failure, a timeout, or a throw from somewhere else entirely. It is a sentinel,
 * not a status: treat it as "no answer", never as a server error.
 *
 * The correlation id is read from the `x-request-id` response header, which is
 * the only place the backend puts it, so it is present only when a response
 * came back at all.
 *
 * @param err - whatever reached the catch block
 * @returns a populated `ApiError`; the message is safe to log, never to display
 */
export function parseApiError(err: unknown): ApiError {
  if (isAxiosError(err)) {
    const data = err.response?.data as Partial<ApiErrorResponse> | undefined;
    // Off the header, not the body: the backend sends the correlation id as
    // `x-request-id` and never puts it in the error envelope. Axios lower-cases
    // response header names, which is the form this constant already holds.
    const requestId = err.response?.headers?.[REQUEST_ID_HEADER];

    if (data?.statusCode) {
      return new ApiError({
        statusCode: data.statusCode,
        message: Array.isArray(data.message)
          ? data.message.join(", ")
          : (data.message ?? "Unknown error"),
        error: data.error ?? "Error",
        path: data.path,
        timestamp: data.timestamp,
        requestId,
      });
    }
    // No response at all — a network error or a timeout never reached the
    // backend, so there is no id to carry and nothing to correlate with.
    return new ApiError({
      statusCode: 0,
      message: err.message ?? "Network error",
      error: "NetworkError",
      requestId,
    });
  }

  if (err instanceof Error) {
    return new ApiError({
      statusCode: 0,
      message: err.message,
      error: err.name,
    });
  }

  if (typeof err === "string") {
    return new ApiError({ statusCode: 0, message: err, error: "Error" });
  }

  return new ApiError({
    statusCode: 0,
    message: "An unexpected error occurred",
    error: "UnknownError",
  });
}

function isAxiosError(err: unknown): err is {
  isAxiosError: true;
  response?: { data?: unknown; headers?: Record<string, string | undefined> };
  message: string;
} {
  return typeof err === "object" && err !== null && "isAxiosError" in err;
}
