// src/frontend/shared/utils/logger.spec.ts
import * as Sentry from "@sentry/nextjs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError } from "@/shared/types";

import { logger } from "./logger";

vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

describe("logger.error", () => {
  let consoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(Sentry.captureException).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("prefixes the console line with the context and sends it to Sentry", () => {
    const error = new Error("boom");

    logger.error(error, "Server fetch failed");

    expect(consoleError).toHaveBeenCalledWith("[Server fetch failed]", error);
    expect(Sentry.captureException).toHaveBeenCalledWith(error, {
      contexts: { logger: { context: "Server fetch failed" } },
      tags: undefined,
    });
  });

  it("tags an ApiError with its request id, so Sentry and Loki find the same request", () => {
    const error = new ApiError({
      statusCode: 503,
      message: "down",
      error: "Service Unavailable",
      requestId: "req-7",
    });

    logger.error(error);

    expect(consoleError).toHaveBeenCalledWith(error);
    expect(Sentry.captureException).toHaveBeenCalledWith(error, {
      contexts: undefined,
      tags: { request_id: "req-7" },
    });
  });
});

describe("logger.warn", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes to the console only", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.mocked(Sentry.captureException).mockClear();

    logger.warn("no centroid", { id: 3 });
    logger.warn("bare");

    expect(warn).toHaveBeenNthCalledWith(1, "no centroid", { id: 3 });
    expect(warn).toHaveBeenNthCalledWith(2, "bare");
    expect(Sentry.captureException).not.toHaveBeenCalled();
  });
});
