// src/backend/common/interceptors/transform.interceptor.spec.ts
import type { CallHandler, ExecutionContext } from "@nestjs/common";
import { of } from "rxjs";

import { TransformInterceptor } from "./transform.interceptor";

describe("TransformInterceptor", () => {
  let interceptor: TransformInterceptor<unknown>;
  let mockExecutionContext: Partial<ExecutionContext>;
  let mockCallHandler: Partial<CallHandler>;

  beforeEach(() => {
    interceptor = new TransformInterceptor();

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ url: "/api/test" }),
        getResponse: jest.fn().mockReturnValue({ statusCode: 200 }),
      }),
    };
  });

  describe("response structure", () => {
    it("should wrap response in standard structure", (done) => {
      const data = { id: 1, name: "Test" };
      mockCallHandler = { handle: jest.fn().mockReturnValue(of(data)) };

      interceptor
        .intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .subscribe({
          next: (result) => {
            expect(result.data).toEqual(data);
            expect(result.path).toBe("/api/test");
            expect(result.statusCode).toBe(200);
            expect(result.timestamp).toBeDefined();
            done();
          },
        });
    });

    it("should include a valid ISO timestamp", (done) => {
      mockCallHandler = { handle: jest.fn().mockReturnValue(of({})) };

      interceptor
        .intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .subscribe({
          next: (result) => {
            expect(new Date(result.timestamp).toISOString()).toBe(
              result.timestamp,
            );
            done();
          },
        });
    });
  });

  describe("generateMeta", () => {
    it("should return count for array data", (done) => {
      const data = [1, 2, 3];
      mockCallHandler = { handle: jest.fn().mockReturnValue(of(data)) };

      interceptor
        .intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .subscribe({
          next: (result) => {
            expect(result.meta).toEqual({ count: 3 });
            done();
          },
        });
    });

    it("should return count of 0 for empty array", (done) => {
      mockCallHandler = { handle: jest.fn().mockReturnValue(of([])) };

      interceptor
        .intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .subscribe({
          next: (result) => {
            expect(result.meta).toEqual({ count: 0 });
            done();
          },
        });
    });

    it("should return paginated meta for paginated response", (done) => {
      const data = { items: [1, 2, 3], total: 30, page: 2, limit: 10 };
      mockCallHandler = { handle: jest.fn().mockReturnValue(of(data)) };

      interceptor
        .intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .subscribe({
          next: (result) => {
            expect(result.meta).toEqual({
              count: 3,
              page: 2,
              limit: 10,
              totalPages: 3,
            });
            done();
          },
        });
    });

    it("should return totalPages as undefined when limit is not provided", (done) => {
      const data = { items: [1, 2], total: 10 };
      mockCallHandler = { handle: jest.fn().mockReturnValue(of(data)) };

      interceptor
        .intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .subscribe({
          next: (result) => {
            expect(result.meta?.totalPages).toBeUndefined();
            done();
          },
        });
    });

    it("should return undefined meta for plain object", (done) => {
      const data = { id: 1, name: "Test" };
      mockCallHandler = { handle: jest.fn().mockReturnValue(of(data)) };

      interceptor
        .intercept(
          mockExecutionContext as ExecutionContext,
          mockCallHandler as CallHandler,
        )
        .subscribe({
          next: (result) => {
            expect(result.meta).toBeUndefined();
            done();
          },
        });
    });
  });
});
