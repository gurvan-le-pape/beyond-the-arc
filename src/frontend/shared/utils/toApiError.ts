// src/frontend/shared/utils/toApiError.ts
import { REQUEST_ID_HEADER } from "@/shared/constants";
import type { ApiErrorResponse } from "@/shared/types";
import { ApiError } from "@/shared/types";

/**
 * Builds the `ApiError` for a non-2xx response from the response itself — its
 * status, the backend's error envelope when the body is one, and the
 * correlation id, which comes off the header because the backend never puts it
 * in the body. A body that is not the envelope (or not JSON) falls back to the
 * status text.
 *
 * @param response - a non-2xx response, body not yet read
 * @returns the error to throw; its message is safe to log, never to display
 */
export async function toApiError(response: Response): Promise<ApiError> {
  const body = (await response
    .json()
    .catch(() => null)) as Partial<ApiErrorResponse> | null;
  return new ApiError({
    statusCode: response.status,
    message: Array.isArray(body?.message)
      ? body.message.join(", ")
      : (body?.message ?? response.statusText),
    error: body?.error ?? response.statusText,
    path: body?.path,
    timestamp: body?.timestamp,
    requestId: response.headers.get(REQUEST_ID_HEADER) ?? undefined,
  });
}
