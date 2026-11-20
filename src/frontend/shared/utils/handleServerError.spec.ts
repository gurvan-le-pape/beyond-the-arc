// src/frontend/shared/utils/handleServerError.spec.ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/types";

import { handleServerError } from "./handleServerError";
import { logger } from "./logger";

vi.mock("./logger", () => ({ logger: { error: vi.fn() } }));

function apiError(statusCode: number, requestId?: string) {
  return new ApiError({
    statusCode,
    message: "failed",
    error: "Error",
    requestId,
  });
}

describe("handleServerError", () => {
  beforeEach(() => {
    vi.mocked(logger.error).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("turns a backend 404 into the not-found boundary, without logging it", () => {
    expect(() => handleServerError(apiError(404))).toThrow(
      expect.objectContaining({ digest: "NEXT_HTTP_ERROR_FALLBACK;404" }),
    );
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("logs anything else once, with the request id inline, and rethrows it", () => {
    const error = apiError(500, "req-42");

    expect(() => handleServerError(error)).toThrow(error);
    expect(logger.error).toHaveBeenCalledExactlyOnceWith(
      error,
      "Server fetch failed x-request-id=req-42",
    );
  });

  it("logs a failure with no response without an id", () => {
    const error = new TypeError("fetch failed");

    expect(() => handleServerError(error)).toThrow(error);
    expect(logger.error).toHaveBeenCalledWith(error, "Server fetch failed");
  });
});
