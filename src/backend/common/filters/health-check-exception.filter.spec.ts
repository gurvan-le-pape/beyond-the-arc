// src/backend/common/filters/health-check-exception.filter.spec.ts
import { ServiceUnavailableException } from "@nestjs/common";
import * as Sentry from "@sentry/nestjs";

import { HealthCheckExceptionFilter } from "./health-check-exception.filter";

jest.mock("@sentry/nestjs", () => ({
  captureException: jest.fn(),
}));

function makeHost(url = "/api/health") {
  const mockResponse: {
    status: jest.Mock;
    json: jest.Mock;
    locals: Record<string, unknown>;
    err?: unknown;
  } = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    locals: {},
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

  beforeEach(() => {
    jest.clearAllMocks();
    filter = new HealthCheckExceptionFilter();
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

  // The filter writes no line of its own: pino-http's completion line for the
  // 503 is the record, at `error` from the status, and gains these.
  it("attaches the health result to the request's own log line", () => {
    const host = makeHost();
    filter.catch(
      new ServiceUnavailableException(TERMINUS_PAYLOAD),
      host as any,
    );

    expect(host.response.locals.failureLog).toEqual({
      health: TERMINUS_PAYLOAD,
    });
  });

  // Serialized, the exception would repeat the health result as
  // `err.response` on the same line.
  it("attaches no exception — the health result is the whole story", () => {
    const host = makeHost();
    filter.catch(
      new ServiceUnavailableException(TERMINUS_PAYLOAD),
      host as any,
    );

    expect(host.response.err).toBeUndefined();
  });

  it("does not give the request id a second name", () => {
    // pino-http already puts the id on the line as `req.id` (`makeHost` sets
    // one). A `traceId` field would be the same value under a second name, so
    // a Loki query on either would miss the other.
    const host = makeHost();
    filter.catch(
      new ServiceUnavailableException(TERMINUS_PAYLOAD),
      host as any,
    );

    expect(host.response.locals.failureLog).not.toHaveProperty("traceId");
  });
});
