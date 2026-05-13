// src/frontend/shared/utils/parseApiError.ts
import type { ApiErrorResponse } from "@/shared/types";
import { ApiError } from "@/shared/types";

export function parseApiError(err: unknown): ApiError {
  if (isAxiosError(err)) {
    const data = err.response?.data as Partial<ApiErrorResponse> | undefined;
    if (data?.statusCode) {
      return new ApiError({
        statusCode: data.statusCode,
        message: Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message ?? "Unknown error",
        error: data.error ?? "Error",
        path: data.path,
        timestamp: data.timestamp,
      });
    }
    return new ApiError({
      statusCode: 0,
      message: err.message ?? "Network error",
      error: "NetworkError",
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
  response?: { data?: unknown };
  message: string;
} {
  return typeof err === "object" && err !== null && "isAxiosError" in err;
}
