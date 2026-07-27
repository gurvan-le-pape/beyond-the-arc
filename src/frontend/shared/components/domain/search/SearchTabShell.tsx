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
  readonly isEmpty: boolean;
  readonly emptyState: React.ReactNode;
  readonly pagination: PaginationType | null;
  readonly pageSize: number;
  readonly onPageSizeChange: (size: number) => void;
  readonly onPageChange: (index: number) => void;
  readonly itemLabel: string;
  readonly children: React.ReactNode;
}

export function SearchTabShell({
  isLoading,
  error,
  errorMessage,
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
    return <ErrorMessage message={errorMessage} />;
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
