// src/backend/common/interceptors/logging.interceptor.spec.ts
import type { CallHandler, ExecutionContext } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { of, throwError } from "rxjs";

import { LoggingInterceptor } from "./logging.interceptor";

describe("LoggingInterceptor", () => {
  let interceptor: LoggingInterceptor;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: Partial<CallHandler>;
  let mockRequest: Record<string, unknown>;
  let mockResponse: Record<string, unknown>;

  beforeEach(() => {
    interceptor = new LoggingInterceptor();
    jest.spyOn(Logger.prototype, "log").mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);

    mockRequest = { method: "GET", url: "/api/test" };
    mockResponse = { statusCode: 200 };

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
      getClass: jest.fn().mockReturnValue({ name: "TestController" }),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("successful requests", () => {
    it("should log request without request ID", (done) => {
      mockCallHandler = { handle: jest.fn().mockReturnValue(of({})) };

      interceptor
        .intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .subscribe({
          complete: () => {
            expect(Logger.prototype.log).toHaveBeenCalledWith(
              expect.stringContaining("[TestController] GET /api/test"),
            );
            done();
          },
        });
    });

    it("should log request with request ID when available", (done) => {
      mockRequest.id = "my-request-id";
      mockCallHandler = { handle: jest.fn().mockReturnValue(of({})) };

      interceptor
        .intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .subscribe({
          complete: () => {
            expect(Logger.prototype.log).toHaveBeenCalledWith(
              expect.stringContaining("[my-request-id]"),
            );
            done();
          },
        });
    });

    it("should include status code in log", (done) => {
      mockCallHandler = { handle: jest.fn().mockReturnValue(of({})) };

      interceptor
        .intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .subscribe({
          complete: () => {
            expect(Logger.prototype.log).toHaveBeenCalledWith(
              expect.stringContaining("200"),
            );
            done();
          },
        });
    });
  });

  describe("failed requests", () => {
    it("should log error without request ID", (done) => {
      const error = { message: "Not found", status: 404 };
      mockCallHandler = {
        handle: jest.fn().mockReturnValue(throwError(() => error)),
      };

      interceptor
        .intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .subscribe({
          error: () => {
            expect(Logger.prototype.error).toHaveBeenCalledWith(
              expect.stringContaining("[TestController] GET /api/test"),
            );
            done();
          },
        });
    });

    it("should log error with request ID when available", (done) => {
      mockRequest.id = "my-request-id";
      const error = { message: "Internal error", status: 500 };
      mockCallHandler = {
        handle: jest.fn().mockReturnValue(throwError(() => error)),
      };

      interceptor
        .intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .subscribe({
          error: () => {
            expect(Logger.prototype.error).toHaveBeenCalledWith(
              expect.stringContaining("[my-request-id]"),
            );
            done();
          },
        });
    });

    it("should default to status 500 when error has no status", (done) => {
      const error = { message: "Unknown error" };
      mockCallHandler = {
        handle: jest.fn().mockReturnValue(throwError(() => error)),
      };

      interceptor
        .intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .subscribe({
          error: () => {
            expect(Logger.prototype.error).toHaveBeenCalledWith(
              expect.stringContaining("500"),
            );
            done();
          },
        });
    });
  });
});
