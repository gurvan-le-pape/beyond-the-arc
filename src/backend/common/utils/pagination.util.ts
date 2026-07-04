// src/backend/common/utils/pagination.util.ts
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export function normalizePage(page: number): number {
  return page > 0 ? page : 1;
}

export function normalizeLimit(limit: number): number {
  return limit > 0 ? Math.min(limit, MAX_LIMIT) : DEFAULT_LIMIT;
}
