// src/frontend/shared/components/navigation/SearchTabShell.tsx
"use client";

import { useEffect } from "react";

import { ErrorMessage, Spinner } from "@/shared/components/feedback";
import { Card } from "@/shared/components/primitives";
import type { PaginatedResponse } from "@/shared/types";

import { Pagination } from "./Pagination";

/** The parts of a paginated list query the shell reads: TanStack's result. */
interface PaginatedListQuery {
  readonly data: PaginatedResponse<unknown> | undefined;
  readonly isLoading: boolean;
  readonly error: unknown;
  /** Retries the query — see `ErrorMessage`'s `onRetry`. */
  readonly refetch: () => unknown;
}

interface SearchTabShellProps {
  /** The list query, as its hook returns it. */
  readonly query: PaginatedListQuery;
  readonly errorMessage: string;
  /** Shown when the query holds no item, including before it has run. */
  readonly emptyState: React.ReactNode;
  readonly pageSize: number;
  readonly onPageSizeChange: (size: number) => void;
  /** Called with a one-based page, as the API counts them. */
  readonly onPageChange: (page: number) => void;
  readonly itemLabel: string;
  readonly children: React.ReactNode;
}

/**
 * The loading, error, empty and paginated frame a paginated list renders
 * inside. It reads the list query itself: the pagination and the empty state
 * come from the query's data, and pages are reported one-based, as the API
 * counts them, so a caller passes its query and its page setter as they are.
 *
 * **The four states are strictly ordered and each returns early** — loading
 * beats error beats empty beats content. So an error arriving while results are
 * on screen replaces them rather than annotating them; there is no
 * stale-with-banner state.
 *
 * Pagination renders only when there is more than one page, and `children`
 * render only in the success path.
 *
 * A page past the last one, from a stale or hand-edited link, goes back to the
 * first page rather than rendering the empty state: the API answers it with no
 * items, and "nothing found" with no pagination is a dead end over a list that
 * is not empty.
 */
export function SearchTabShell({
  query,
  errorMessage,
  emptyState,
  pageSize,
  onPageSizeChange,
  onPageChange,
  itemLabel,
  children,
}: SearchTabShellProps) {
  const { data, isLoading, error, refetch } = query;
  const isPastLastPage =
    data !== undefined && data.totalPages > 0 && data.page > data.totalPages;

  useEffect(() => {
    if (isPastLastPage) onPageChange(1);
  }, [isPastLastPage, onPageChange]);

  if (isLoading || isPastLastPage) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={errorMessage} onRetry={refetch} />;
  }

  if (!data || data.items.length === 0) {
    return <Card padding="lg">{emptyState}</Card>;
  }

  return (
    <>
      <div className="space-y-4">{children}</div>
      {data.totalPages > 1 && (
        <Pagination
          pagination={data}
          pageSize={pageSize}
          setPageSize={(size) => {
            onPageSizeChange(size);
            onPageChange(1);
          }}
          setPageIndex={(index) => onPageChange(index + 1)}
          label={itemLabel}
        />
      )}
    </>
  );
}
