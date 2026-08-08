// src/backend/common/interceptors/cache.interceptor.ts
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { from, lastValueFrom, Observable, of } from "rxjs";
import { finalize, mergeMap, shareReplay } from "rxjs/operators";

import { CacheDedupService } from "../services/cache-dedup.service";

interface CacheInterceptorOptions {
  /**
   * Time-to-live in **milliseconds**. Defaults to 300_000 (5 minutes).
   *
   * cache-manager 7 sits on Keyv, whose `ttl` is milliseconds. Passing a
   * seconds value here does not fail — it expires the entry 1000x early and
   * looks like a cache that never hits. Use the `CACHE_TTL` constants.
   */
  ttl?: number;
  /**
   * When true, the authenticated user's ID is included in the cache key.
   * Enable for any endpoint whose response differs per user (e.g. /me, /profile).
   * Assumes `request.user.id` is populated by your auth guard.
   */
  includeUser?: boolean;
}

export function CacheInterceptor(
  options: CacheInterceptorOptions = {},
): Type<NestInterceptor> {
  @Injectable()
  class MixinCacheInterceptor implements NestInterceptor {
    // Default: 300_000 ms (5 min). Keyv, and therefore cache-manager 7, takes
    // milliseconds.
    private readonly ttl: number = options.ttl ?? 300_000;

    constructor(
      @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
      @InjectPinoLogger(MixinCacheInterceptor.name)
      private readonly logger: PinoLogger,
      // Injected as a singleton so all mixin instances share one inFlight map.
      // If dedup state lived here on the class, each module-scoped mixin
      // instance would have its own map and stampede protection would silently
      // break for concurrent requests routed to different instances.
      private readonly dedup: CacheDedupService,
    ) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<unknown>> {
      const request = context.switchToHttp().getRequest();
      const { method, url } = request;

      if (method !== "GET") {
        return next.handle();
      }

      const cacheKey = this.generateCacheKey(url, request);
      const cachedResponse = await this.cacheManager.get(cacheKey);

      // Use !== undefined so falsy values (false, 0, "") are still served
      // from cache rather than being treated as a miss.
      if (cachedResponse !== undefined) {
        this.logger.debug({ cacheKey, url, action: "cache.hit" }, "Cache hit");
        return of(cachedResponse);
      }

      // If another request is already fetching this resource, reuse its
      // Promise rather than firing a duplicate upstream call.
      //
      // We return a *fresh* Observable wrapping the shared Promise, not the
      // original observable stream. This keeps concerns separate:
      //   - `dedup` owns the upstream call (deduplicated data fetch)
      //   - each caller gets its own Observable (independent stream lifecycle)
      //
      // Concretely: `from(promise)` emits the resolved value once and
      // completes, which is identical behaviour to what the primary caller's
      // `upstream$` produces for this JSON API use-case.
      const existing = this.dedup.get(cacheKey);
      if (existing) {
        this.logger.debug(
          { cacheKey, url, action: "cache.inflight" },
          "Joining in-flight request",
        );
        return from(existing);
      }

      this.logger.debug({ cacheKey, url, action: "cache.miss" }, "Cache miss");

      // Build the upstream observable. shareReplay(1) multicasts the single
      // upstream execution to both the returned observable (consumed by NestJS)
      // and lastValueFrom below (used to register the dedup promise) — ensuring
      // next.handle() is only subscribed to once regardless of how many
      // consumers reference upstream$.
      const upstream$ = next.handle().pipe(
        mergeMap(async (response) => {
          await this.cacheManager.set(cacheKey, response, this.ttl);
          this.logger.debug(
            { cacheKey, url, ttl: this.ttl, action: "cache.set" },
            "Response cached",
          );
          return response;
        }),
        // Guaranteed cleanup on completion, error, *and* cancellation.
        // Keeping the delete here (rather than in mergeMap) means a thrown
        // error can never leave a stale rejected Promise poisoning the map.
        finalize(() => {
          this.dedup.delete(cacheKey);
        }),
        shareReplay(1),
      );

      // Store the data Promise for dedup *before* returning the observable.
      // `lastValueFrom` resolves with the final emitted value, which for this
      // single-emission stream equals the full response — exactly what late
      // joiners need from `from(existing)` above.
      const inFlight = lastValueFrom(upstream$);
      // If the upstream errors and no late joiner ever consumed this promise,
      // its rejection would be unhandled — and an unhandled rejection
      // terminates the Node process, so any error on a cached endpoint would
      // crash the whole API. The no-op handler defuses that; late joiners
      // still receive the real rejection through their own `from(inFlight)`
      // subscription.
      inFlight.catch(() => {});
      this.dedup.set(cacheKey, inFlight);

      return upstream$;
    }

    /**
     * Produces a stable cache key from a URL.
     *
     * - Query parameters are sorted so `/items?b=2&a=1` and `/items?a=1&b=2`
     *   resolve to the same entry.
     * - When `options.includeUser` is true, the authenticated user's ID is
     *   prepended so per-user endpoints (e.g. /me) don't bleed across users.
     *
     * The normalized URL is used verbatim. It must NOT be run through a
     * character replacement: `URLSearchParams.toString()` has already
     * percent-encoded the query, so any lossy replace maps distinct queries
     * onto one key and serves one caller's response to another. `?search=A.S`
     * and `?search=A_S` are 15 clubs and 637 clubs; collapsing `.` to `_` made
     * whichever arrived second inherit the first's body.
     *
     * The store is an in-memory Map, so the key needs no escaping — it is
     * never rendered and never reaches a query language. Should a Keyv/Redis
     * store ever be added, HASH the key (it has no length bound and Redis caps
     * keys at 512 MB); do not reintroduce a replace.
     *
     * NOTE: This interceptor has no built-in cache invalidation. If a mutating
     * endpoint (POST/PUT/PATCH/DELETE) should bust related GET caches, call
     * `cacheManager.del(key)` explicitly in the handler or add a dedicated
     * invalidation interceptor that shares this key format.
     */
    private generateCacheKey(
      url: string,
      request?: Record<string, unknown>,
    ): string {
      const [path, query] = url.split("?");

      const normalizedQuery = query
        ? new URLSearchParams(
            [...new URLSearchParams(query).entries()].sort(([a], [b]) =>
              a.localeCompare(b),
            ),
          ).toString()
        : "";

      const normalizedUrl = normalizedQuery
        ? `${path}?${normalizedQuery}`
        : path;

      if (options.includeUser && request) {
        const user = request.user as { id?: string } | undefined;
        const userId = user?.id ?? "anon";
        return `cache:${userId}:${normalizedUrl}`;
      }

      return `cache:${normalizedUrl}`;
    }
  }

  return mixin(MixinCacheInterceptor);
}
