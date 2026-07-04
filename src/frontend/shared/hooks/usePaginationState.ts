// src/frontend/shared/hooks/usePaginationState.ts
"use client";

import { useCallback, useState } from "react";

/**
 * Shared page/pageSize state used by every filterable list (teams, players,
 * matches, championships). `resetToFirstPage` is meant to be called from the
 * caller's own "filters changed" effect — the set of filters that should
 * trigger a reset differs per feature, so that effect stays local.
 */
export function usePaginationState(initialPageSize: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const resetToFirstPage = useCallback(() => setCurrentPage(1), []);

  return {
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    resetToFirstPage,
  };
}
