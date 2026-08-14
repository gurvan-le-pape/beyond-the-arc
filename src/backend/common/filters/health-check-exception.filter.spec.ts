// src/backend/common/filters/health-check-exception.filter.spec.ts
import { ServiceUnavailableException } from "@nestjs/common";
import * as Sentry from "@sentry/nestjs";

import { HealthCheckExceptionFilter } from "./health-check-exception.filter";

jest.mock("@sentry/nestjs", () => ({
  captureException: jest.fn(),
}));

function makeLogger() {
  return {
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
  };
}

function makeHost(url = "/api/health") {
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockRequest = {
    url,
    method: "GET",
    id: "test-trace-id",
  };
  return {
    switchToHttp: () => ({
      getResponse: () => mockResponse,
      getRequest: () => mockRequest,
    }),
    response: mockResponse,
    request: mockRequest,
  };
}

// The payload Terminus throws when an indicator reports down: the health
// result itself, not Nest's `{ message, error: string }` shape.
const TERMINUS_PAYLOAD = {
  status: "error",
  info: { memory_heap: { status: "up" } },
  error: { database: { status: "down", message: "connection refused" } },
  details: {
    database: { status: "down", message: "connection refused" },
    memory_heap: { status: "up" },
  },
};

describe("HealthCheckExceptionFilter", () => {
  let filter: HealthCheckExceptionFilter;
  let logger: ReturnType<typeof makeLogger>;

  beforeEach(() => {
    jest.clearAllMocks();
    logger = makeLogger();
    filter = new HealthCheckExceptionFilter(logger as any);
  });

  it("responds 503 with the full Terminus result, not a flattened body", () => {
    const host = makeHost();

    filter.catch(
      new ServiceUnavailableException(TERMINUS_PAYLOAD),
      host as any,
    );

    expect(host.response.status).toHaveBeenCalledWith(503);
    expect(host.response.json).toHaveBeenCalledWith({
      data: TERMINUS_PAYLOAD,
      timestamp: expect.any(String),
      path: "/api/health",
      statusCode: 503,
    });
  });

  it("keeps the reason a failing indicator gave", () => {
    const host = makeHost();

    filter.catch(
      new ServiceUnavailableException(TERMINUS_PAYLOAD),
      host as any,
    );

    const body = host.response.json.mock.calls[0][0];
    expect(body.data.details.database.message).toBe("connection refused");
    expect(body.data.info).toEqual(TERMINUS_PAYLOAD.info);
  });

  it("mirrors the envelope TransformInterceptor puts on a healthy check", () => {
    const host = makeHost();

    filter.catch(
      new ServiceUnavailableException(TERMINUS_PAYLOAD),
      host as any,
    );

    expect(Object.keys(host.response.json.mock.calls[0][0]).sort()).toEqual([
      "data",
      "path",
      "statusCode",
      "timestamp",
    ]);
  });

  it("does not send a failed poll to Sentry", () => {
    filter.catch(
      new ServiceUnavailableException(TERMINUS_PAYLOAD),
      makeHost() as any,
    );

    expect(Sentry.captureException).not.toHaveBeenCalled();
  });

  it("logs the failure at error level with the health result attached", () => {
    filter.catch(
      new ServiceUnavailableException(TERMINUS_PAYLOAD),
      makeHost() as any,
    );

    expect(logger.error).toHaveBeenCalledTimes(1);
    const [context, message] = logger.error.mock.calls[0];
    expect(context).toMatchObject({
      method: "GET",
      url: "/api/health",
      statusCode: 503,
      health: TERMINUS_PAYLOAD,
    });
    expect(message).toContain("health check failed");
  });

  it("logs a constant message and puts the request detail in fields", () => {
    // `msg` is what Loki groups on, so it must be identical for every poll.
    // The previous message interpolated method, url and statusCode — all three
    // already fields on the same object — which made it unique per route and
    // stopped "which health check is failing" being answerable by grouping.
    // `toContain` above passes either way; this asserts the whole string.
    filter.catch(
      new ServiceUnavailableException(TERMINUS_PAYLOAD),
      makeHost("/api/health/ready") as any,
    );

    expect(logger.error.mock.calls[0][1]).toBe("health check failed");
    expect(logger.error.mock.calls[0][0]).toMatchObject({
      url: "/api/health/ready",
    });
  });

  it("does not give the request id a second name", () => {
    // nestjs-pino already binds the id to the request's logger as `req.id`
    // (`makeHost` sets one). A `traceId` field here would be the same value
    // under a second name, so a Loki query on either would miss half the
    // request's lines — the defect #441 removed from AllExceptionsFilter,
    // which this filter carried because it was written three days earlier.
    filter.catch(
      new ServiceUnavailableException(TERMINUS_PAYLOAD),
      makeHost() as any,
    );

    expect(logger.error.mock.calls[0][0].traceId).toBeUndefined();
  });
});
