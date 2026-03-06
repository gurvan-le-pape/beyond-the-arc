// src/backend/common/filters/all-exceptions.filter.spec.ts
import type { ArgumentsHost } from "@nestjs/common";
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from "@nestjs/common";

import { AllExceptionsFilter } from "./all-exceptions.filter";

describe("AllExceptionsFilter", () => {
  let filter: AllExceptionsFilter;
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let mockRequest: Partial<{
    url: string;
    method: string;
    ip: string;
    headers: Record<string, string>;
  }>;
  let mockHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new AllExceptionsFilter();
    jest.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, "warn").mockImplementation(() => undefined);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: "/api/test",
      method: "GET",
      ip: "127.0.0.1",
      headers: { "user-agent": "jest" },
    };

    mockHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.NODE_ENV;
  });

  describe("HttpException handling", () => {
    it("should handle NotFoundException with correct status and message", () => {
      filter.catch(
        new NotFoundException("Resource not found"),
        mockHost as ArgumentsHost,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.NOT_FOUND,
          message: "Resource not found",
        }),
      );
    });

    it("should handle BadRequestException with validation errors array", () => {
      const exception = new BadRequestException({
        message: ["field is required", "field must be a string"],
        error: "Bad Request",
      });

      filter.catch(exception, mockHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.BAD_REQUEST,
          message: ["field is required", "field must be a string"],
        }),
      );
    });

    it("should handle HttpException with string response", () => {
      const exception = new HttpException("Custom error", HttpStatus.CONFLICT);

      filter.catch(exception, mockHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.CONFLICT,
          message: "Custom error",
        }),
      );
    });
  });

  describe("Error handling", () => {
    it("should handle standard Error with 500 status", () => {
      filter.catch(new Error("Unexpected error"), mockHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Unexpected error",
          error: "Error",
        }),
      );
    });

    it("should handle string exception", () => {
      filter.catch("Something went wrong", mockHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Something went wrong",
        }),
      );
    });

    it("should handle unknown exception type", () => {
      filter.catch({ unexpected: true }, mockHost as ArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Internal server error",
        }),
      );
    });
  });

  describe("response structure", () => {
    it("should always include path, timestamp and statusCode", () => {
      filter.catch(new Error("test"), mockHost as ArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/api/test",
          timestamp: expect.any(String),
          statusCode: expect.any(Number),
        }),
      );
    });

    it("should include stack details in development mode", () => {
      process.env.NODE_ENV = "development";

      filter.catch(new Error("Dev error"), mockHost as ArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            stack: expect.any(String),
          }),
        }),
      );
    });

    it("should not include details outside development mode", () => {
      process.env.NODE_ENV = "production";

      filter.catch(new Error("Prod error"), mockHost as ArgumentsHost);

      const jsonCall = mockResponse.json.mock.calls[0][0];
      expect(jsonCall.details).toBeUndefined();
    });
  });

  describe("logging", () => {
    it("should log 5xx errors with logger.error", () => {
      filter.catch(new Error("Server error"), mockHost as ArgumentsHost);

      expect(Logger.prototype.error).toHaveBeenCalled();
    });

    it("should log 4xx errors with logger.warn", () => {
      filter.catch(
        new NotFoundException("Not found"),
        mockHost as ArgumentsHost,
      );

      expect(Logger.prototype.warn).toHaveBeenCalled();
    });

    it("should use unknown when user-agent header is missing", () => {
      mockRequest.headers = {};

      filter.catch(
        new NotFoundException("Not found"),
        mockHost as ArgumentsHost,
      );

      expect(Logger.prototype.warn).toHaveBeenCalled();
    });
  });
});
