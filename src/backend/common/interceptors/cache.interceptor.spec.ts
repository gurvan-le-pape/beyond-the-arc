// src/backend/common/interceptors/cache.interceptor.spec.ts
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { CallHandler, ExecutionContext } from "@nestjs/common";
import type { TestingModule } from "@nestjs/testing";
import { Test } from "@nestjs/testing";
import { of } from "rxjs";

import { CacheInterceptor } from "./cache.interceptor";

describe("CacheInterceptor", () => {
  let interceptor: any;
  let mockCacheManager: { get: jest.Mock; set: jest.Mock };
  let mockCallHandler: Partial<CallHandler>;
  let mockExecutionContext: Partial<ExecutionContext>;

  const buildContext = (method: string, url: string) => ({
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ method, url }),
    }),
  });

  beforeEach(async () => {
    mockCacheManager = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
    };

    const InterceptorClass = CacheInterceptor({ ttl: 60000 });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InterceptorClass,
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    interceptor = module.get(InterceptorClass);
  });

  describe("non-GET requests", () => {
    it("should bypass cache for POST requests", (done) => {
      mockExecutionContext = buildContext("POST", "/api/test") as any;
      mockCallHandler = { handle: jest.fn().mockReturnValue(of({ id: 1 })) };

      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .then((obs$: any) => {
          obs$.subscribe({
            next: () => {
              expect(mockCacheManager.get).not.toHaveBeenCalled();
              done();
            },
          });
        });
    });

    it("should bypass cache for PUT requests", (done) => {
      mockExecutionContext = buildContext("PUT", "/api/test") as any;
      mockCallHandler = { handle: jest.fn().mockReturnValue(of({})) };

      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .then((obs$: any) => {
          obs$.subscribe({
            complete: () => {
              expect(mockCacheManager.get).not.toHaveBeenCalled();
              done();
            },
          });
        });
    });
  });

  describe("GET requests - cache MISS", () => {
    it("should call next.handle() and cache the response", (done) => {
      mockExecutionContext = buildContext("GET", "/api/test") as any;
      const responseData = { id: 1, name: "Test" };
      mockCallHandler = {
        handle: jest.fn().mockReturnValue(of(responseData)),
      };

      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .then((obs$: any) => {
          obs$.subscribe({
            next: (result: any) => {
              expect(result).toEqual(responseData);
              expect(mockCacheManager.set).toHaveBeenCalledWith(
                expect.stringContaining("cache:"),
                responseData,
                60000,
              );
              done();
            },
          });
        });
    });
  });

  describe("GET requests - cache HIT", () => {
    it("should return cached response without calling next.handle()", (done) => {
      const cachedData = { id: 1, name: "Cached" };
      mockCacheManager.get.mockResolvedValue(cachedData);
      mockExecutionContext = buildContext("GET", "/api/test") as any;
      mockCallHandler = { handle: jest.fn() };

      interceptor
        .intercept(mockExecutionContext, mockCallHandler)
        .then((obs$: any) => {
          obs$.subscribe({
            next: (result: any) => {
              expect(result).toEqual(cachedData);
              expect(mockCallHandler.handle).not.toHaveBeenCalled();
              done();
            },
          });
        });
    });
  });

  describe("generateCacheKey", () => {
    it("should generate consistent cache keys for the same URL", (done) => {
      mockExecutionContext = buildContext("GET", "/api/test?foo=bar") as any;
      mockCallHandler = { handle: jest.fn().mockReturnValue(of({})) };

      interceptor.intercept(mockExecutionContext, mockCallHandler).then(() => {
        expect(mockCacheManager.get).toHaveBeenCalledWith(
          "cache:/api/test?foo=bar",
        );
        done();
      });
    });

    it("should sanitize special characters in URL", (done) => {
      mockExecutionContext = buildContext(
        "GET",
        "/api/test?name=hello world",
      ) as any;
      mockCallHandler = { handle: jest.fn().mockReturnValue(of({})) };

      interceptor.intercept(mockExecutionContext, mockCallHandler).then(() => {
        expect(mockCacheManager.get).toHaveBeenCalledWith(
          "cache:/api/test?name=hello_world",
        );
        done();
      });
    });
  });
});
