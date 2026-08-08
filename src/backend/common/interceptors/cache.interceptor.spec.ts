// src/backend/common/interceptors/cache.interceptor.spec.ts
import type { CallHandler, ExecutionContext } from "@nestjs/common";
import type { Subscriber } from "rxjs";
import { from, lastValueFrom, Observable, of, throwError } from "rxjs";

import { CacheDedupService } from "../services/cache-dedup.service";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DEFAULT_HANDLER_VALUE = { data: "fresh" };

function makeCallHandler(value: unknown = DEFAULT_HANDLER_VALUE): CallHandler {
  return { handle: jest.fn().mockReturnValue(of(value)) };
}

function makeContext(url: string, method = "GET", user?: { id: string }) {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ url, method, user }),
    }),
  } as unknown as ExecutionContext;
}

function makeCacheManager() {
  const store = new Map<string, unknown>();
  return {
    get: jest.fn(async (key: string) => store.get(key)),
    set: jest.fn(async (key: string, value: unknown) => {
      store.set(key, value);
    }),
    del: jest.fn(async (key: string) => {
      store.delete(key);
    }),
    store,
  };
}

function makeLogger() {
  return { debug: jest.fn(), warn: jest.fn(), error: jest.fn() };
}

/**
 * Instantiates the mixin interceptor without NestJS DI, injecting deps
 * directly so tests remain fast and free of module bootstrapping overhead.
 */
function makeInterceptor(
  options: { ttl?: number; includeUser?: boolean } = {},
  cacheManager = makeCacheManager(),
  dedup = new CacheDedupService(),
) {
  // Import inline to pick up the module under test without circular issues.

  const { CacheInterceptor } = require("./cache.interceptor");
  const MixinClass = CacheInterceptor(options);

  // Bypass NestJS DI by constructing directly.
  const logger = makeLogger();

  const instance = new MixinClass(cacheManager, logger as any, dedup);
  return { instance, cacheManager, logger, dedup };
}

// ---------------------------------------------------------------------------
// CacheDedupService unit tests
// ---------------------------------------------------------------------------

describe("CacheDedupService", () => {
  let service: CacheDedupService;

  beforeEach(() => {
    service = new CacheDedupService();
  });

  it("returns undefined for an unknown key", () => {
    expect(service.get("missing")).toBeUndefined();
  });

  it("stores and retrieves a promise", async () => {
    const p = Promise.resolve(42);
    service.set("k", p);
    expect(service.get("k")).toBe(p);
    await expect(service.get("k")).resolves.toBe(42);
  });

  it("delete removes the key", () => {
    service.set("k", Promise.resolve(1));
    service.delete("k");
    expect(service.get("k")).toBeUndefined();
  });

  it("delete is a no-op for non-existent keys", () => {
    expect(() => service.delete("ghost")).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// CacheInterceptor unit tests
// ---------------------------------------------------------------------------

describe("CacheInterceptor", () => {
  // -------------------------------------------------------------------------
  // Non-GET passthrough
  // -------------------------------------------------------------------------

  describe("non-GET requests", () => {
    it.each(["POST", "PUT", "PATCH", "DELETE"])(
      "passes %s requests through without touching the cache",
      async (method) => {
        const { instance, cacheManager } = makeInterceptor();
        const handler = makeCallHandler();
        const ctx = makeContext("/items", method);
        const obs$ = await instance.intercept(ctx, handler);
        await lastValueFrom(obs$);
        expect(cacheManager.get).not.toHaveBeenCalled();
        expect(cacheManager.set).not.toHaveBeenCalled();
      },
    );
  });

  // -------------------------------------------------------------------------
  // Cache miss → stores upstream response
  // -------------------------------------------------------------------------

  describe("cache miss", () => {
    it("calls the upstream handler on a miss", async () => {
      const { instance } = makeInterceptor();
      const handler = makeCallHandler({ id: 1 });
      const ctx = makeContext("/items/1");
      const obs$ = await instance.intercept(ctx, handler);
      await lastValueFrom(obs$);
      expect(handler.handle).toHaveBeenCalledTimes(1);
    });

    it("stores the response in cache with the configured TTL", async () => {
      const { instance, cacheManager } = makeInterceptor({ ttl: 60 });
      const payload = { id: 1 };
      const handler = makeCallHandler(payload);
      const ctx = makeContext("/items/1");
      const obs$ = await instance.intercept(ctx, handler);
      await lastValueFrom(obs$);
      expect(cacheManager.set).toHaveBeenCalledWith(
        expect.stringContaining("/items/1"),
        payload,
        60,
      );
    });

    it("emits the upstream response value to the caller", async () => {
      const { instance } = makeInterceptor();
      const payload = { name: "widget" };
      const obs$ = await instance.intercept(
        makeContext("/x"),
        makeCallHandler(payload),
      );
      const result = await lastValueFrom(obs$);
      expect(result).toEqual(payload);
    });
  });

  // -------------------------------------------------------------------------
  // Cache hit → serves stored value
  // -------------------------------------------------------------------------

  describe("cache hit", () => {
    it("returns the cached value without calling the handler", async () => {
      const cacheManager = makeCacheManager();
      const cached = { id: 1, fromCache: true };
      cacheManager.store.set("cache:/items/1", cached);

      const { instance } = makeInterceptor({}, cacheManager);
      const handler = makeCallHandler({ id: 1, fromCache: false });
      const obs$ = await instance.intercept(makeContext("/items/1"), handler);
      const result = await lastValueFrom(obs$);

      expect(result).toEqual(cached);
      expect(handler.handle).not.toHaveBeenCalled();
    });

    it("serves falsy cached values (0, false, '') rather than treating them as misses", async () => {
      for (const falsyValue of [0, false, ""]) {
        const cacheManager = makeCacheManager();
        cacheManager.get.mockResolvedValue(falsyValue);

        const { instance } = makeInterceptor({}, cacheManager);
        const handler = makeCallHandler("should-not-be-called");
        const obs$ = await instance.intercept(makeContext("/items"), handler);
        const result = await lastValueFrom(obs$);

        expect(result).toBe(falsyValue);
        expect(handler.handle).not.toHaveBeenCalled();
      }
    });
  });

  // -------------------------------------------------------------------------
  // Stampede prevention (in-flight dedup via singleton CacheDedupService)
  // -------------------------------------------------------------------------

  describe("stampede prevention", () => {
    it("fires the upstream handler only once for concurrent requests to the same URL", async () => {
      const dedup = new CacheDedupService();
      const cacheManager = makeCacheManager();
      const { instance } = makeInterceptor({}, cacheManager, dedup);

      // Simulate a slow upstream response
      let resolve!: (v: unknown) => void;
      const upstreamPromise = new Promise((r) => {
        resolve = r;
      });
      const handler: CallHandler = {
        handle: jest.fn().mockReturnValue(
          new Observable((subscriber: Subscriber<unknown>) => {
            upstreamPromise.then(
              (v) => {
                subscriber.next(v);
                subscriber.complete();
              },
              (err) => subscriber.error(err),
            );
          }),
        ),
      };

      const ctx = makeContext("/slow");

      // Two concurrent requests arrive before the upstream resolves
      const obs1$ = await instance.intercept(ctx, handler);
      const obs2$ = await instance.intercept(ctx, handler);

      const result1Promise = lastValueFrom(obs1$);
      const result2Promise = lastValueFrom(obs2$);

      // Resolve the upstream
      resolve({ data: "slow-response" });

      const [r1, r2] = await Promise.all([result1Promise, result2Promise]);

      expect(handler.handle).toHaveBeenCalledTimes(1);
      expect(r1).toEqual({ data: "slow-response" });
      expect(r2).toEqual({ data: "slow-response" });
    });

    it("cleans up the in-flight entry after the upstream resolves", async () => {
      const dedup = new CacheDedupService();
      const { instance } = makeInterceptor({}, makeCacheManager(), dedup);
      const obs$ = await instance.intercept(
        makeContext("/cleanup"),
        makeCallHandler(),
      );
      await lastValueFrom(obs$);
      // After the observable completes, finalize should have fired
      expect(dedup.get("cache:/cleanup")).toBeUndefined();
    });

    it("shared dedup state across two interceptor instances (simulates mixin multi-instantiation)", async () => {
      // This is the core regression test for the singleton scope fix.
      // Before the fix, each interceptor instance had its own inFlight map,
      // so concurrent requests reaching *different* instances would both miss
      // the dedup check and fire duplicate upstream calls.
      const dedup = new CacheDedupService(); // shared singleton
      const cacheManager = makeCacheManager();

      const { instance: instance1 } = makeInterceptor({}, cacheManager, dedup);
      const { instance: instance2 } = makeInterceptor({}, cacheManager, dedup);

      let resolve!: (v: unknown) => void;
      const upstreamPromise = new Promise((r) => {
        resolve = r;
      });
      const handler: CallHandler = {
        handle: jest.fn().mockReturnValue(from(upstreamPromise)),
      };

      const obs1$ = await instance1.intercept(makeContext("/shared"), handler);
      const obs2$ = await instance2.intercept(makeContext("/shared"), handler);

      const p1 = lastValueFrom(obs1$);
      const p2 = lastValueFrom(obs2$);

      resolve({ ok: true });
      await Promise.all([p1, p2]);

      // With a shared dedup service, the upstream is called exactly once
      // even though the two requests hit different interceptor instances.
      expect(handler.handle).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // Upstream errors
  // -------------------------------------------------------------------------

  describe("upstream errors", () => {
    function makeErrorHandler(message = "upstream boom"): CallHandler {
      return {
        handle: jest.fn().mockReturnValue(throwError(() => new Error(message))),
      };
    }

    it("propagates the error to the caller and cleans the dedup map", async () => {
      const { instance, dedup } = makeInterceptor();
      const obs$ = await instance.intercept(
        makeContext("/error"),
        makeErrorHandler(),
      );
      await expect(lastValueFrom(obs$)).rejects.toThrow("upstream boom");
      expect(dedup.get("cache:/error")).toBeUndefined();
    });

    it("does not leave an unhandled rejection from the dedup promise", async () => {
      // The dedup map stores a second Promise consumer of the upstream. When
      // the upstream errors and no concurrent request ever consumed that
      // promise, its rejection must not surface as unhandled — in production
      // an unhandled rejection terminates the Node process, so any error on
      // a cached endpoint would crash the whole API.
      const rejections: unknown[] = [];
      const onUnhandled = (reason: unknown) => rejections.push(reason);
      process.on("unhandledRejection", onUnhandled);
      try {
        const { instance } = makeInterceptor();
        const obs$ = await instance.intercept(
          makeContext("/lonely-error"),
          makeErrorHandler(),
        );
        await expect(lastValueFrom(obs$)).rejects.toThrow("upstream boom");
        // Let the orphaned promise's rejection reach the macrotask boundary
        // where Node decides it is unhandled.
        await new Promise((resolve) => setTimeout(resolve, 0));
        await new Promise((resolve) => setImmediate(resolve));
        expect(rejections).toHaveLength(0);
      } finally {
        process.off("unhandledRejection", onUnhandled);
      }
    });

    it("delivers the error to a late joiner of the in-flight request", async () => {
      const dedup = new CacheDedupService();
      const cacheManager = makeCacheManager();
      const { instance } = makeInterceptor({}, cacheManager, dedup);

      let reject!: (e: unknown) => void;
      const upstreamPromise = new Promise((_, r) => {
        reject = r;
      });
      const handler: CallHandler = {
        handle: jest.fn().mockReturnValue(from(upstreamPromise)),
      };

      const obs1$ = await instance.intercept(makeContext("/joined"), handler);
      const obs2$ = await instance.intercept(makeContext("/joined"), handler);
      const p1 = lastValueFrom(obs1$);
      const p2 = lastValueFrom(obs2$);
      // Attach expectations before rejecting so neither is unhandled.
      const a1 = expect(p1).rejects.toThrow("shared boom");
      const a2 = expect(p2).rejects.toThrow("shared boom");

      reject(new Error("shared boom"));
      await Promise.all([a1, a2]);
      expect(handler.handle).toHaveBeenCalledTimes(1);
    });
  });

  // -------------------------------------------------------------------------
  // Cache key generation
  // -------------------------------------------------------------------------

  describe("cache key generation", () => {
    it("produces the same key for query params in different orders", async () => {
      const cacheManager = makeCacheManager();
      const { instance } = makeInterceptor({}, cacheManager);

      const h1 = makeCallHandler({ order: "asc" });
      const h2 = makeCallHandler({ order: "asc" });

      await lastValueFrom(
        await instance.intercept(makeContext("/items?b=2&a=1"), h1),
      );
      await lastValueFrom(
        await instance.intercept(makeContext("/items?a=1&b=2"), h2),
      );

      // Second request should hit the cache from the first, so set is called once
      expect(cacheManager.set).toHaveBeenCalledTimes(1);
    });

    it("includes the user ID in the key when includeUser is true", async () => {
      const cacheManager = makeCacheManager();
      const { instance } = makeInterceptor({ includeUser: true }, cacheManager);

      const ctx = makeContext("/me", "GET", { id: "user-42" });
      const obs$ = await instance.intercept(ctx, makeCallHandler());
      await lastValueFrom(obs$);

      const setKey = (cacheManager.set.mock.calls[0] as unknown[])[0] as string;
      expect(setKey).toContain("user-42");
    });

    it("uses 'anon' as user ID when includeUser is true but request has no user", async () => {
      const cacheManager = makeCacheManager();
      const { instance } = makeInterceptor({ includeUser: true }, cacheManager);

      const obs$ = await instance.intercept(
        makeContext("/public"),
        makeCallHandler(),
      );
      await lastValueFrom(obs$);

      const setKey = (cacheManager.set.mock.calls[0] as unknown[])[0] as string;
      expect(setKey).toContain("anon");
    });

    it("different users get different cache keys", async () => {
      const cacheManager = makeCacheManager();
      const { instance } = makeInterceptor({ includeUser: true }, cacheManager);

      await lastValueFrom(
        await instance.intercept(
          makeContext("/me", "GET", { id: "alice" }),
          makeCallHandler({ name: "Alice" }),
        ),
      );
      await lastValueFrom(
        await instance.intercept(
          makeContext("/me", "GET", { id: "bob" }),
          makeCallHandler({ name: "Bob" }),
        ),
      );

      // Two different users → two cache.set calls (no cross-user hit)
      expect(cacheManager.set).toHaveBeenCalledTimes(2);
    });

    // The key used to be run through `.replaceAll(/[^a-zA-Z0-9:/?=&_-]/g, "_")`
    // with `_` inside its own allow-list, so these four search terms all
    // collapsed onto one entry and whichever request arrived second was served
    // the first one's body. Reproduced against production: `?search=A.S` is 15
    // clubs, `?search=A_S` is 637.
    it.each([
      ["a dot", "A.S", "A_S"],
      ["an asterisk", "A*S", "A_S"],
      ["a space", "A S", "A_S"],
    ])("does not collide %s with an underscore", async (_label, a, b) => {
      const cacheManager = makeCacheManager();
      const { instance } = makeInterceptor({}, cacheManager);

      await lastValueFrom(
        await instance.intercept(
          makeContext(`/clubs?search=${encodeURIComponent(a)}`),
          makeCallHandler({ total: 15 }),
        ),
      );
      await lastValueFrom(
        await instance.intercept(
          makeContext(`/clubs?search=${encodeURIComponent(b)}`),
          makeCallHandler({ total: 637 }),
        ),
      );

      // Two distinct searches → two entries, and neither inherits the other.
      expect(cacheManager.set).toHaveBeenCalledTimes(2);
      const [k1, k2] = cacheManager.set.mock.calls.map((c) => c[0] as string);
      expect(k1).not.toBe(k2);
      expect([...cacheManager.store.values()]).toEqual([
        { total: 15 },
        { total: 637 },
      ]);
    });
  });

  // -------------------------------------------------------------------------
  // Logging
  // -------------------------------------------------------------------------

  describe("logging", () => {
    it("logs a cache.miss on first request", async () => {
      const { instance, logger } = makeInterceptor();
      const obs$ = await instance.intercept(
        makeContext("/miss"),
        makeCallHandler(),
      );
      await lastValueFrom(obs$);
      expect(logger.debug).toHaveBeenCalledWith(
        expect.objectContaining({ action: "cache.miss" }),
        expect.any(String),
      );
    });

    it("logs a cache.hit on second request", async () => {
      const { instance, logger } = makeInterceptor();
      const ctx = makeContext("/hit");
      const obs1$ = await instance.intercept(ctx, makeCallHandler());
      await lastValueFrom(obs1$);
      const obs2$ = await instance.intercept(ctx, makeCallHandler());
      await lastValueFrom(obs2$);
      expect(logger.debug).toHaveBeenCalledWith(
        expect.objectContaining({ action: "cache.hit" }),
        expect.any(String),
      );
    });

    it("logs cache.set after storing the response", async () => {
      const { instance, logger } = makeInterceptor();
      const obs$ = await instance.intercept(
        makeContext("/set"),
        makeCallHandler(),
      );
      await lastValueFrom(obs$);
      expect(logger.debug).toHaveBeenCalledWith(
        expect.objectContaining({ action: "cache.set" }),
        expect.any(String),
      );
    });
  });
});
