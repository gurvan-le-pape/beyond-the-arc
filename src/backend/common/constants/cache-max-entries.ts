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
 * (`/matches?limit=100` measures 51 KB on production, `/players?limit=100`
 * 45 KB, measured 2026-11-09), so 500 entries is on the order of 25 MB. That
 * figure is close to literal here: Keyv serializes, so an entry is held as a
 * JSON string rather than an object graph, which is both more compact and
 * easier to reason about than the unserialized store cache-manager builds by
 * default. `/clubs/all` is far larger at 674 KB, but it declares no query
 * parameters and `UndeclaredQueryGuard` rejects any it is sent, so it is
 * exactly one key and cannot be multiplied.
 *
 * That distinction is the whole test, and it is what keeps
 * `/teams/:teamId/shots` out of the cache: ~20 KB a third of the way through
 * a season and ~65 KB by its end (22 matchdays at ~57 shots a game, ~52 bytes
 * a shot), keyed by one of 60,168 teams, so it is both large *and*
 * multipliable. Caching it would make it the body this ceiling is sized
 * against: 500 x ~65 KB is ~33 MB rather than ~25 MB, on a backend container
 * that has no `memory` limit in compose.
 * `/players/:playerId/shots` passes the same test at a few kilobytes and is
 * cached.
 *
 * Lower this if the backend ever gets a memory limit in compose; raise it only
 * with the same arithmetic redone against the biggest cacheable response.
 */
export const CACHE_MAX_ENTRIES = 500;
