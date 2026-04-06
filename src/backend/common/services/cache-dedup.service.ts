// src/backend/common/services/cache-dedup.service.ts
import { Injectable } from "@nestjs/common";

/**
 * Holds in-flight upstream request promises keyed by cache key.
 *
 * This MUST be a singleton (module-scoped, registered once at the root) so
 * that all instances of CacheInterceptor — which NestJS may instantiate
 * multiple times via mixin() across different modules — share the same map.
 *
 * If this state lived on the interceptor class itself, each module-scoped
 * instance would have its own map, and stampede protection would silently
 * break: two concurrent requests arriving at different interceptor instances
 * would both miss the dedup check and fire duplicate upstream calls.
 */
@Injectable()
export class CacheDedupService {
  /**
   * Maps a cache key to the Promise of the upstream response data.
   *
   * Invariant: a key is present only while an upstream call is in flight.
   * It is deleted in the `finalize` operator, which fires on completion,
   * error, *and* observable cancellation — so stale entries cannot accumulate.
   */
  private readonly inFlight = new Map<string, Promise<unknown>>();

  /**
   * Returns the existing in-flight promise for `key`, or undefined if none.
   */
  get(key: string): Promise<unknown> | undefined {
    return this.inFlight.get(key);
  }

  /**
   * Registers a promise for `key`. The caller is responsible for calling
   * `delete` (typically via `finalize`) once the upstream call settles.
   */
  set(key: string, promise: Promise<unknown>): void {
    this.inFlight.set(key, promise);
  }

  /**
   * Removes the in-flight entry for `key`. Safe to call even if the key
   * does not exist.
   */
  delete(key: string): void {
    this.inFlight.delete(key);
  }
}
