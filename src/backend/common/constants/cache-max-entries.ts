// src/backend/common/constants/cache-max-entries.ts

/**
 * Hard ceiling on how many entries the in-memory response cache may hold.
 *
 * The cache is keyed by request URL and every route is public and
 * unauthenticated, so without a ceiling the number of live entries is chosen
 * by whoever is calling. The ceiling is what turns that into a bounded cost.
 *
 * Sized from the largest body a caller can actually multiply. `limit` is
 * clamped at 100, which caps a paginated page at roughly 50 KB of JSON
 * (`/players?limit=100` measures 49 KB, `/matches?limit=100` 50 KB), so 500
 * entries is on the order of 25 MB of JSON and a few times that once parsed
 * into heap objects. `/clubs/all` is far larger at 990 KB, but it takes no
 * query parameters — it is exactly one key and cannot be multiplied.
 *
 * Lower this if the backend ever gets a memory limit in compose; raise it only
 * with the same arithmetic redone against the biggest cacheable response.
 */
export const CACHE_MAX_ENTRIES = 500;
