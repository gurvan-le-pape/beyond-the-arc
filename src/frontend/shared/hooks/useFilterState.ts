// src/frontend/shared/hooks/useFilterState.ts
"use client";

import { useCallback, useMemo } from "react";

import {
  type FilterCascades,
  intParam,
  pageSizeParam,
  type UrlCodecs,
  withDependentsCleared,
} from "@/shared/utils";

import { useUrlState } from "./useUrlState";

const DEFAULT_PAGE_SIZE = 50;

const PAGING = { page: intParam, size: pageSizeParam };

/** The decoded value of each filter, keyed by its query parameter. */
export type FilterValues<T> = { [K in keyof T]: T[K] | undefined };

/** What a filter panel, or a shared piece of one, reads and writes. */
export interface FilterProps<V> {
  readonly filters: V;
  readonly set: (patch: Partial<V>) => void;
}

/**
 * A list's filters and pagination, kept in the query string so a filtered list
 * survives a reload and the back button, and can be shared as a link.
 *
 * `set` takes any subset of the filters and writes it as one URL update. It
 * also clears every filter that depends on a changed one, transitively through
 * `cascades` — a new level clears the committee, which clears the divisions
 * under it — and goes back to page 1. A caller never resets either by hand.
 *
 * Page size defaults to 50 and is left out of the URL at that value; `reset`
 * clears every filter but keeps the page size.
 *
 * @param codecs - one codec per filter; the key is the query parameter
 * @param cascades - the filters each one clears when it changes
 * @returns the filter values and `set`, the page and page size with their
 *   setters, and `reset`
 */
export function useFilterState<T>(
  codecs: UrlCodecs<T>,
  cascades: FilterCascades<NoInfer<T>>,
) {
  const allCodecs = useMemo(() => ({ ...codecs, ...PAGING }), [codecs]);
  const { state, update } = useUrlState(allCodecs);
  const { page, size, ...filters } = state;

  const set = useCallback(
    (patch: Partial<FilterValues<T>>) => {
      update({ ...withDependentsCleared(patch, cascades), page: undefined });
    },
    [update, cascades],
  );

  const setPage = useCallback(
    (next: number) => update({ page: next > 1 ? next : undefined }),
    [update],
  );

  const setPageSize = useCallback(
    (next: number) =>
      update({
        size: next === DEFAULT_PAGE_SIZE ? undefined : next,
        page: undefined,
      }),
    [update],
  );

  const reset = useCallback(
    () =>
      set(
        Object.fromEntries(
          Object.keys(codecs).map((key) => [key, undefined]),
        ) as Partial<FilterValues<T>>,
      ),
    [set, codecs],
  );

  return {
    filters: filters as FilterValues<T>,
    set,
    page: page ?? 1,
    pageSize: size ?? DEFAULT_PAGE_SIZE,
    setPage,
    setPageSize,
    reset,
  };
}
