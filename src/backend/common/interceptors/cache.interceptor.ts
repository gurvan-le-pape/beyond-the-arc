// src/backend/common/interceptors/cache.interceptor.ts
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  mixin,
  NestInterceptor,
  Type,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";

interface CacheInterceptorOptions {
  ttl?: number;
}

/**
 * Factory function to create a CacheInterceptor with custom options.
 *
 * @param options - Configuration options for caching
 * @param options.ttl - Time to live in milliseconds (default: 300000)
 *
 * @example
 * ```typescript
 * @UseInterceptors(CacheInterceptor({ ttl: 600000 })) // 10 minutes
 * @Get('divisions')
 * async getDivisions() { ... }
 * ```
 */
export function CacheInterceptor(
  options: CacheInterceptorOptions = {},
): Type<NestInterceptor> {
  @Injectable()
  class MixinCacheInterceptor implements NestInterceptor {
    private readonly logger = new Logger(MixinCacheInterceptor.name);
    private readonly ttl: number = options.ttl ?? 300000;

    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<unknown>> {
      const request = context.switchToHttp().getRequest();
      const { method, url } = request;

      // Only cache GET requests
      if (method !== "GET") {
        return next.handle();
      }

      const cacheKey = this.generateCacheKey(url);

      // Try to get from cache
      const cachedResponse = await this.cacheManager.get(cacheKey);

      if (cachedResponse) {
        this.logger.debug(`Cache HIT for ${url}`);
        return of(cachedResponse);
      }

      this.logger.debug(`Cache MISS for ${url}`);

      // If not in cache, execute the handler and cache the result
      return next.handle().pipe(
        mergeMap(async (response) => {
          await this.cacheManager.set(cacheKey, response, this.ttl);
          this.logger.debug(`Cached response for ${url} (TTL: ${this.ttl}ms)`);
          return response;
        }),
      );
    }

    /**
     * Generates a cache key from the request URL.
     * Includes the full URL with query parameters to ensure unique caching.
     *
     * @param url - The request URL including query parameters
     * @returns A sanitized cache key
     */
    private generateCacheKey(url: string): string {
      // Sanitize URL to prevent cache key collisions
      const sanitized = url.replaceAll(/[^a-zA-Z0-9:/?=&_-]/g, "_");
      return `cache:${sanitized}`;
    }
  }

  return mixin(MixinCacheInterceptor);
}
