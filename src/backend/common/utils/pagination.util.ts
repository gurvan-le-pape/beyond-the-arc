// src/backend/common/utils/pagination.util.ts
export const DEFAULT_PAGE_LIMIT = 50;
export const MAX_PAGE_LIMIT = 100;

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
