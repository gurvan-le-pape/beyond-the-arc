// src/frontend/shared/utils/parseApiError.ts
import { REQUEST_ID_HEADER } from "@/shared/constants";
import type { ApiErrorResponse } from "@/shared/types";
import { ApiError } from "@/shared/types";

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
