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
   * Time-to-live in **seconds** (cache-manager v5+ convention).
   * Defaults to 300 (5 minutes).
   *
   * If you are on cache-manager v4 or below (which uses milliseconds),
   * change the default to 300_000 and update callers accordingly.
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
    // Default: 300 seconds (5 min) — cache-manager v5+ uses seconds.
    // Swap for 300_000 if on cache-manager v4 (millisecond-based).
    private readonly ttl: number = options.ttl ?? 300;

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
      this.dedup.set(cacheKey, lastValueFrom(upstream$));

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

      const sanitized = normalizedUrl.replaceAll(/[^a-zA-Z0-9:/?=&_-]/g, "_");

      if (options.includeUser && request) {
        const user = request.user as { id?: string } | undefined;
        const userId = user?.id ?? "anon";
        return `cache:${userId}:${sanitized}`;
      }

      return `cache:${sanitized}`;
    }
  }

  return mixin(MixinCacheInterceptor);
}
