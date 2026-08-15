// src/frontend/shared/components/navigation/Pagination.tsx
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import type { Pagination as PaginationType } from "@/shared/types";

import { Text } from "../typography";

interface PaginationProps {
  pagination: PaginationType | null;
  pageSize: number;
  setPageSize: (size: number) => void;
  setPageIndex: (index: number) => void;
  /**
   * The item noun, already agreed with `pagination.total` by the caller — the
   * plural rule belongs to the noun, and the noun belongs to the caller's
   * namespace. Passing a bare plural rendered `(1 joueurs)` on any filter
   * matching one row.
   */
  label: string;
}

const PAGE_SIZES = [25, 50, 100, 200];

const navButtonBase = "p-2 rounded-button transition-colors";
const navButtonEnabled =
  "surface-subtle text-text-emphasis hover:bg-surface-inset border border-divide";
const navButtonDisabled =
  "bg-surface-subtle text-text-muted cursor-not-allowed";

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  pageSize,
  setPageSize,
  setPageIndex,
  label,
}: PaginationProps) => {
  const t = useTranslations("filters");

  if (!pagination) return null;

  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;

  // Calculate page range to show
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push(-1); // -1 represents ellipsis
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push(-2); // -2 represents ellipsis
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center px-4 sm:px-6 py-4 border-t border-divide surface-base gap-4">
      {/* Info text */}
      <div className="text-sm text-text-body">
        {t("pagination.pageInfo", {
          page: currentPage,
          totalPages: totalPages,
          total: pagination.total,
          label,
        })}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Page size selector */}
        <div className="flex items-center gap-2">
          <Text variant="label" as="span" className="whitespace-nowrap">
            {t("pagination.resultsPerPage")}
          </Text>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}
            className="px-3 py-1.5 border border-divide rounded-input bg-surface-inset text-text-heading focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            aria-label={t("pagination.resultsPerPage")}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-1">
          {/* First page */}
          <button
            type="button"
            onClick={() => setPageIndex(0)}
            disabled={currentPage <= 1}
            className={`${navButtonBase} ${
              currentPage <= 1 ? navButtonDisabled : navButtonEnabled
            }`}
            aria-label={t("pagination.firstPage")}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous page */}
          <button
            type="button"
            onClick={() => setPageIndex(Math.max(0, currentPage - 2))}
            disabled={currentPage <= 1}
            className={`${navButtonBase} ${
              currentPage <= 1 ? navButtonDisabled : navButtonEnabled
            }`}
            aria-label={t("pagination.previousPage")}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((pageNum, idx) => {
              if (pageNum < 0) {
                // Ellipsis
                return (
                  <span
                    key={`ellipsis-${idx === 0 ? "start" : "end"}`}
                    className="px-3 py-1.5 text-text-secondary"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  type="button"
                  key={pageNum}
                  onClick={() => setPageIndex(pageNum - 1)}
                  className={`px-3 py-1.5 rounded-button transition-colors font-medium ${
                    pageNum === currentPage
                      ? "bg-primary text-white"
                      : navButtonEnabled
                  }`}
                  aria-current={pageNum === currentPage ? "page" : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Mobile: Current page indicator */}
          <div className="sm:hidden px-3 py-1.5 bg-primary-strong text-white rounded-button font-medium">
            {currentPage}
          </div>

          {/* Next page */}
          <button
            type="button"
            onClick={() => setPageIndex(Math.min(totalPages - 1, currentPage))}
            disabled={currentPage >= totalPages}
            className={`${navButtonBase} ${
              currentPage >= totalPages ? navButtonDisabled : navButtonEnabled
            }`}
            aria-label={t("pagination.nextPage")}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last page */}
          <button
            type="button"
            onClick={() => setPageIndex(totalPages - 1)}
            disabled={currentPage >= totalPages}
            className={`${navButtonBase} ${
              currentPage >= totalPages ? navButtonDisabled : navButtonEnabled
            }`}
            aria-label={t("pagination.lastPage")}
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
