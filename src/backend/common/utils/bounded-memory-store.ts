// src/backend/common/utils/bounded-memory-store.ts

/**
 * A `Map` with a hard entry ceiling, for use as a Keyv store.
 *
 * Keyv's default store is a plain `Map` with no bound: entries are only ever
 * removed when someone reads an expired key, so a cache keyed by request URL
 * grows for as long as callers keep inventing URLs. On a public,
 * unauthenticated API that is a free heap-exhaustion path, and the `max`
 * option on `CacheModule.register()` does not close it —
 * `@nestjs/cache-manager@3` forwards only `ttl`, `refreshThreshold` and
 * `nonBlocking` when no `stores` are supplied, so `max` was silently dropped.
 *
 * Eviction is least-recently-used: `Map` preserves insertion order, so a
 * `get` that re-inserts moves the entry to the back of the queue and the
 * oldest key falls off the front once the ceiling is passed.
 *
 * This is deliberately not a dependency. Keyv still owns TTL and expiry — the
 * store only has to bound how many entries can exist at once, which is a
 * handful of lines and one less name in the supply chain.
 */
export class BoundedMemoryStore<K, V> extends Map<K, V> {
  constructor(private readonly maxEntries: number) {
    super();
    if (!Number.isInteger(maxEntries) || maxEntries < 1) {
      throw new TypeError(
        `BoundedMemoryStore requires a positive integer ceiling, got ${maxEntries}`,
      );
    }
  }

  override get(key: K): V | undefined {
    const value = super.get(key);
    if (value === undefined) {
      return undefined;
    }
    // Re-insert so this key becomes the most recently used.
    super.delete(key);
    super.set(key, value);
    return value;
  }

  override set(key: K, value: V): this {
    // Delete first so an overwrite also refreshes recency rather than keeping
    // the original insertion position.
    super.delete(key);
    super.set(key, value);

    while (this.size > this.maxEntries) {
      const oldest = super.keys().next();
      if (oldest.done) {
        break;
      }
      super.delete(oldest.value);
    }

    return this;
  }
}
