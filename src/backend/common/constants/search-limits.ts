// src/backend/common/constants/search-limits.ts

/**
 * Upper bound on the `search` query parameter, in characters.
 *
 * `search` was declared `@IsString()` with no length bound, and production
 * accepted 2,000 characters and more. Two things make that worth closing.
 *
 * It is cache-key material: the response cache is keyed by request URL, so an
 * unbounded `search` is an unbounded key held in memory for the life of the
 * entry. And it feeds an unanchored `ILIKE '%...%'` with no trigram or GIN
 * index behind it, so the cost is paid on every call.
 *
 * 100 is generous against the data: the longest club name in the seeded set is
 * 89 characters, so nothing longer can match anything.
 */
export const MAX_SEARCH_LENGTH = 100;
