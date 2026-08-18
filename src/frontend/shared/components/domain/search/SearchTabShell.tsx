// src/frontend/shared/components/domain/search/SearchTabShell.tsx
"use client";

import { ErrorMessage, LoadingSpinner } from "@/shared/components/feedback";
import { Pagination } from "@/shared/components/navigation";
import { Card } from "@/shared/components/primitives";
import type { Pagination as PaginationType } from "@/shared/types";

interface SearchTabShellProps {
  readonly isLoading: boolean;
  readonly error: unknown;
  readonly errorMessage: string;
  /** The list query's `refetch` — see `ErrorMessage`'s `onRetry`. */
  readonly onRetry: () => unknown;
  readonly isEmpty: boolean;
  readonly emptyState: React.ReactNode;
  readonly pagination: PaginationType | null;
  readonly pageSize: number;
  readonly onPageSizeChange: (size: number) => void;
  readonly onPageChange: (index: number) => void;
  readonly itemLabel: string;
  readonly children: React.ReactNode;
}

/**
 * The loading, error, empty and paginated frame every search tab renders
 * inside.
 *
 * **The four states are strictly ordered and each returns early** — loading
 * beats error beats empty beats content. So an error arriving while results are
 * on screen replaces them rather than annotating them; there is no
 * stale-with-banner state.
 *
 * `onPageChange` reports a **zero-based** index. The API counts pages from one,
 * so every caller adds the offset — see the search tabs.
 *
 * Pagination renders only when there is more than one page, and `children`
 * render only in the success path.
 */
export function SearchTabShell({
  isLoading,
  error,
  errorMessage,
  onRetry,
  isEmpty,
  emptyState,
  pagination,
  pageSize,
  onPageSizeChange,
  onPageChange,
  itemLabel,
  children,
}: SearchTabShellProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={errorMessage} onRetry={onRetry} />;
  }

  if (isEmpty) {
    return <Card padding="lg">{emptyState}</Card>;
  }

  return (
    <>
      <div className="space-y-4">{children}</div>
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          pageSize={pageSize}
          setPageSize={(size) => {
            onPageSizeChange(size);
            onPageChange(0);
          }}
          setPageIndex={onPageChange}
          label={itemLabel}
        />
      )}
    </>
  );
}
