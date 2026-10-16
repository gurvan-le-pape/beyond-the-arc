// src/backend/common/constants/search-limits.ts

/**
 * Upper bound on the `search` query parameter, in characters.
 *
 * Two things make a bound necessary.
 *
 * `search` is cache-key material: the response cache is keyed by request URL,
 * so an unbounded `search` is an unbounded key held in memory for the life of
 * the entry. And it feeds an unanchored `ILIKE '%...%'`, whose cost grows with
 * the term: the player name's trigram index splits it into one trigram per
 * character, and the club name has no index at all.
 *
 * 100 is generous against the data: the longest club name in the seeded set is
 * 89 characters, so nothing longer can match anything.
 */
export const MAX_SEARCH_LENGTH = 100;
