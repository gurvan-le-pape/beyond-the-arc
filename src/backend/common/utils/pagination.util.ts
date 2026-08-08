// src/backend/common/utils/pagination.util.ts
export const DEFAULT_PAGE_LIMIT = 50;
export const MAX_PAGE_LIMIT = 100;

/**
 * Upper bound on `page`.
 *
 * `@Min(1)` alone left the high end open, so `?page=2147483648` was accepted
 * and echoed straight back in the response body — past what a Postgres int4
 * can hold, on an API whose largest collection is under 5,000 rows. 100_000
 * pages is far beyond any real result set at the maximum limit and keeps the
 * offset arithmetic inside int4.
 */
export const MAX_PAGE_NUMBER = 100_000;

export interface ResolvedPagination {
  page: number;
  limit: number;
  skip: number;
  take: number;
}

/**
 * Applies the shared pagination defaults and derives skip/take.
 *
 * Bounds (page >= 1, limit <= MAX_PAGE_LIMIT) are enforced upstream by
 * PaginationQueryDto validation, so this only fills defaults.
 */
export function resolvePagination(query: {
  page?: number;
  limit?: number;
}): ResolvedPagination {
  const page = query.page ?? 1;
  const limit = query.limit ?? DEFAULT_PAGE_LIMIT;

  return { page, limit, skip: (page - 1) * limit, take: limit };
}
