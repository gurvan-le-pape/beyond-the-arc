// src/frontend/shared/constants/pagination.ts

/**
 * The page sizes a paginated list offers, in the page-size select and in the
 * `size` query parameter alike. Capped by the API, which rejects a `limit`
 * above 100 with a 400.
 */
export const PAGE_SIZES = [25, 50, 100] as const;
