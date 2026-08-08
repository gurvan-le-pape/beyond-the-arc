// src/backend/common/filters/all-exceptions.filter.spec.ts
import { HttpException, HttpStatus } from "@nestjs/common";
import * as Sentry from "@sentry/nestjs";

import { AllExceptionsFilter } from "./all-exceptions.filter";

jest.mock("@sentry/nestjs", () => ({
  captureException: jest.fn(),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeLogger() {
  return {
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
  };
}

function makeHost(url = "/test", method = "GET") {
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const mockRequest = {
    url,
    method,
    ip: "127.0.0.1",
    id: "test-trace-id",
    headers: { "user-agent": "jest" },
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

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe("AllExceptionsFilter", () => {
  let filter: AllExceptionsFilter;
  let logger: ReturnType<typeof makeLogger>;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    logger = makeLogger();

    filter = new AllExceptionsFilter(logger as any);
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  // -------------------------------------------------------------------------
  // HttpException handling
  // -------------------------------------------------------------------------

  describe("HttpException", () => {
    it("uses the exception status code", () => {
      const host = makeHost();
      filter.catch(
        new HttpException("Not found", HttpStatus.NOT_FOUND),
        host as never,
      );
      expect(host.response.status).toHaveBeenCalledWith(404);
    });

    it("derives PascalCase error name from status when response has no error field", () => {
      const host = makeHost();
      filter.catch(new HttpException("gone", HttpStatus.GONE), host as never);
      const body = host.response.json.mock.calls[0][0];
      expect(body.error).toBe("Gone");
    });

    it("uses the explicit error field from the response object when present", () => {
      const host = makeHost();
      filter.catch(
        new HttpException(
          { message: "oops", error: "CustomError" },
          HttpStatus.BAD_REQUEST,
        ),
        host as never,
      );
      const body = host.response.json.mock.calls[0][0];
      expect(body.error).toBe("CustomError");
    });

    it("handles array messages from ValidationPipe", () => {
      const host = makeHost();
      filter.catch(
        new HttpException(
          {
            message: ["name must not be empty", "email must be an email"],
            error: "Bad Request",
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        ),
        host as never,
      );
      const body = host.response.json.mock.calls[0][0];
      expect(body.message).toEqual([
        "name must not be empty",
        "email must be an email",
      ]);
    });

    it("warns (not errors) for 4xx responses", () => {
      const host = makeHost();
      filter.catch(
        new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED),
        host as never,
      );
      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.error).not.toHaveBeenCalled();
    });

    it("errors for 5xx HttpException", () => {
      const host = makeHost();
      filter.catch(
        new HttpException("Gateway timeout", HttpStatus.GATEWAY_TIMEOUT),
        host as never,
      );
      expect(logger.error).toHaveBeenCalledTimes(1);
      expect(logger.warn).not.toHaveBeenCalled();
    });

    it("logs a constant message and puts the request detail in fields", () => {
      const host = makeHost();
      filter.catch(
        new HttpException("Player with ID 999999999 not found", 404),
        host as never,
      );

      // The msg is what Loki groups on, so it must be identical for every
      // request. Two 404s for different ids must produce the same string.
      expect(logger.warn.mock.calls[0][1]).toBe("request failed");

      const loggedContext = logger.warn.mock.calls[0][0];
      expect(loggedContext).toMatchObject({
        method: "GET",
        statusCode: 404,
        message: "Player with ID 999999999 not found",
      });
    });
  });

  // -------------------------------------------------------------------------
  // Generic Error handling
  // -------------------------------------------------------------------------

  describe("generic Error", () => {
    it("returns 500 for an unhandled Error", () => {
      const host = makeHost();
      filter.catch(new Error("boom"), host as never);
      expect(host.response.status).toHaveBeenCalledWith(500);
    });

    it("sanitizes the message and error name in production", () => {
      process.env.NODE_ENV = "production";
      const host = makeHost();
      filter.catch(
        new Error("connection to db-internal:5432 refused"),
        host as never,
      );
      const body = host.response.json.mock.calls[0][0];
      expect(body.message).toBe("Internal server error");
      expect(body.error).toBe("InternalServerError");
    });

    it("keeps the real message and error name in development", () => {
      process.env.NODE_ENV = "development";
      const host = makeHost();
      filter.catch(new Error("something broke"), host as never);
      const body = host.response.json.mock.calls[0][0];
      expect(body.message).toBe("something broke");
      expect(body.error).toBe("Error");
    });

    it("logs the real message even when the response is sanitized", () => {
      process.env.NODE_ENV = "production";
      const host = makeHost();
      filter.catch(new Error("secret internal detail"), host as never);
      // Carried as a field now, not interpolated into msg — the client must not
      // see it, the logs must.
      const loggedContext = logger.error.mock.calls[0][0];
      expect(loggedContext.message).toBe("secret internal detail");
      expect(logger.error.mock.calls[0][1]).toBe("request failed");
    });
  });

  // -------------------------------------------------------------------------
  // String exception handling
  // -------------------------------------------------------------------------

  describe("string exception", () => {
    it("returns 500 and a generic message in production", () => {
      process.env.NODE_ENV = "production";
      const host = makeHost();
      filter.catch("raw string error", host as never);
      const body = host.response.json.mock.calls[0][0];
      expect(body.statusCode).toBe(500);
      expect(body.message).toBe("Internal server error");
    });

    it("uses the string as the message in development", () => {
      process.env.NODE_ENV = "development";
      const host = makeHost();
      filter.catch("raw string error", host as never);
      const body = host.response.json.mock.calls[0][0];
      expect(body.message).toBe("raw string error");
    });
  });

  // -------------------------------------------------------------------------
  // Sentry capture policy
  // -------------------------------------------------------------------------

  describe("Sentry capture", () => {
    it("does not capture 4xx HttpExceptions", () => {
      const host = makeHost();
      filter.catch(
        new HttpException("Not found", HttpStatus.NOT_FOUND),
        host as never,
      );
      expect(Sentry.captureException).not.toHaveBeenCalled();
    });

    it("captures 5xx HttpExceptions", () => {
      const host = makeHost();
      const exception = new HttpException(
        "Gateway timeout",
        HttpStatus.GATEWAY_TIMEOUT,
      );
      filter.catch(exception, host as never);
      expect(Sentry.captureException).toHaveBeenCalledWith(exception);
    });

    it("captures unexpected errors", () => {
      const host = makeHost();
      const exception = new Error("boom");
      filter.catch(exception, host as never);
      expect(Sentry.captureException).toHaveBeenCalledWith(exception);
    });
  });

  // -------------------------------------------------------------------------
  // Programmer error distinction
  // -------------------------------------------------------------------------

  describe("programmer errors", () => {
    const programmerErrors = [
      ["TypeError", new TypeError("Cannot read property 'x' of undefined")],
      ["RangeError", new RangeError("Index out of range")],
      ["ReferenceError", new ReferenceError("foo is not defined")],
    ] as const;

    it.each(programmerErrors)(
      "%s is logged with programmerError: true",
      (_, exception) => {
        const host = makeHost();
        filter.catch(exception, host as never);
        expect(logger.error).toHaveBeenCalledTimes(1);
        const loggedContext = logger.error.mock.calls[0][0];
        expect(loggedContext.programmerError).toBe(true);
      },
    );

    it.each(programmerErrors)(
      "%s is logged under the constant message, with the detail in fields",
      (_, exception) => {
        const host = makeHost();
        filter.catch(exception, host as never);
        // The message must not vary per request — see LOG_MESSAGE. What
        // distinguishes a programmer error is the field, not a msg prefix.
        expect(logger.error.mock.calls[0][1]).toBe("request failed");
        expect(logger.error.mock.calls[0][0].programmerError).toBe(true);
      },
    );

    it("does NOT mark a plain Error as a programmer error", () => {
      const host = makeHost();
      filter.catch(new Error("db timeout"), host as never);
      expect(logger.error).toHaveBeenCalledTimes(1);
      const loggedContext = logger.error.mock.calls[0][0];
      expect(loggedContext.programmerError).toBeUndefined();
    });

    it("does NOT mark a 5xx HttpException as a programmer error", () => {
      const host = makeHost();
      filter.catch(
        new HttpException(
          "service unavailable",
          HttpStatus.SERVICE_UNAVAILABLE,
        ),
        host as never,
      );
      const loggedContext = logger.error.mock.calls[0][0];
      expect(loggedContext.programmerError).toBeUndefined();
    });

    it("does NOT mark SyntaxError as a programmer error (may originate from user input via JSON.parse)", () => {
      const host = makeHost();
      filter.catch(
        new SyntaxError("Unexpected token u in JSON"),
        host as never,
      );
      expect(logger.error).toHaveBeenCalledTimes(1);
      const loggedContext = logger.error.mock.calls[0][0];
      expect(loggedContext.programmerError).toBeUndefined();
    });

    it("does not add a second name for the request id", () => {
      const host = makeHost();
      filter.catch(new Error("boom"), host as never);
      const loggedContext = logger.error.mock.calls[0][0];
      // nestjs-pino already binds the id to the request's logger as `req.id`.
      // A `traceId` field here would be the same value under a second name, so
      // a Loki query on either one would miss half the request's lines.
      expect(loggedContext.traceId).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // Dev-only details (cause leakage guard)
  // -------------------------------------------------------------------------

  describe("dev details", () => {
    it("omits details in production", () => {
      process.env.NODE_ENV = "production";
      const host = makeHost();
      filter.catch(new Error("prod error"), host as never);
      const body = host.response.json.mock.calls[0][0];
      expect(body.details).toBeUndefined();
    });

    it("includes stack in development", () => {
      process.env.NODE_ENV = "development";
      const host = makeHost();
      filter.catch(new Error("dev error"), host as never);
      const body = host.response.json.mock.calls[0][0];
      expect(body.details?.stack).toBeDefined();
    });

    it("exposes only the cause message, not the raw cause object", () => {
      process.env.NODE_ENV = "development";
      const cause = new Error(
        "db query: SELECT * FROM users WHERE token='abc'",
      );
      const err = new Error("wrapped", { cause });
      const host = makeHost();
      filter.catch(err, host as never);
      const body = host.response.json.mock.calls[0][0];
      // Should be just the message string — not the full Error object
      expect(typeof body.details?.cause).toBe("string");
      expect(body.details?.cause).toBe(cause.message);
    });

    it("sets cause to undefined when exception.cause is not an Error", () => {
      process.env.NODE_ENV = "development";
      // Simulate a non-Error cause (e.g. a plain object or string)
      const err = new Error("oops");
      (err as Error & { cause: unknown }).cause = { raw: "object" };
      const host = makeHost();
      filter.catch(err, host as never);
      const body = host.response.json.mock.calls[0][0];
      expect(body.details?.cause).toBeUndefined();
    });
  });

  // -------------------------------------------------------------------------
  // httpStatusToErrorName (via public surface: response body)
  // -------------------------------------------------------------------------

  describe("httpStatusToErrorName", () => {
    const cases: [number, string][] = [
      [200, "Ok"],
      [400, "BadRequest"],
      [401, "Unauthorized"],
      [403, "Forbidden"],
      [404, "NotFound"],
      [409, "Conflict"],
      [422, "UnprocessableEntity"],
      [500, "InternalServerError"],
      [502, "BadGateway"],
      [503, "ServiceUnavailable"],
      [504, "GatewayTimeout"],
    ];

    it.each(cases)("status %i → error name %s", (statusCode, expectedError) => {
      const host = makeHost();
      filter.catch(new HttpException("x", statusCode), host as never);
      const body = host.response.json.mock.calls[0][0];
      expect(body.error).toBe(expectedError);
    });
  });

  // -------------------------------------------------------------------------
  // Response shape
  // -------------------------------------------------------------------------

  describe("response shape", () => {
    it("always includes statusCode, message, error, path, and timestamp", () => {
      const host = makeHost("/api/items");
      filter.catch(new HttpException("Not Found", 404), host as never);
      const body = host.response.json.mock.calls[0][0];
      expect(body).toMatchObject({
        statusCode: 404,
        message: "Not Found",
        error: "NotFound",
        path: "/api/items",
        timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
      });
    });
  });
});
