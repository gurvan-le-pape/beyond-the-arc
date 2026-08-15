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
 * entries is on the order of 25 MB. That figure is close to literal here:
 * Keyv serializes, so an entry is held as a JSON string rather than an object
 * graph, which is both more compact and easier to reason about than the
 * unserialized store cache-manager builds by default. `/clubs/all` is far
 * larger at 990 KB, but it takes no query parameters — it is exactly one key
 * and cannot be multiplied.
 *
 * That distinction is the whole test, and it is what keeps
 * `/matches/team/:teamId/events` out of the cache: 495 KB serialized (measured
 * on production 2026-08-15, 1,089 events) and keyed by one of 60,168 teams, so
 * it is both large *and* multipliable. Caching it would take this ceiling's
 * cost from ~25 MB to ~247 MB, on a backend container that has no `memory`
 * limit in compose. `/matches/player/:playerId/events` passes the same test at
 * 59 KB and is cached.
 *
 * Lower this if the backend ever gets a memory limit in compose; raise it only
 * with the same arithmetic redone against the biggest cacheable response.
 */
export const CACHE_MAX_ENTRIES = 500;
