// src/frontend/shared/components/entity/table/Pagination.tsx
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import type { Pagination as PaginationType } from "types";

interface PaginationProps {
  pagination: PaginationType | null;
  pageSize: number;
  setPageSize: (size: number) => void;
  setPageIndex: (index: number) => void;
  label: string; // e.g. "joueurs", "équipes"
}

const PAGE_SIZES = [25, 50, 100, 200];

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

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

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
    <div className="flex flex-col md:flex-row md:justify-between md:items-center px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 gap-4">
      {/* Info text */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
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
          <label className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {t("pagination.resultsPerPage")}
          </label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}
            className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors"
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
            onClick={() => setPageIndex(0)}
            disabled={currentPage <= 1}
            className={`p-2 rounded-lg transition-colors ${
              currentPage <= 1
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
            }`}
            aria-label={t("pagination.firstPage")}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous page */}
          <button
            onClick={() => setPageIndex(Math.max(0, currentPage - 2))}
            disabled={currentPage <= 1}
            className={`p-2 rounded-lg transition-colors ${
              currentPage <= 1
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
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
                    key={`ellipsis-${idx}`}
                    className="px-3 py-1.5 text-gray-500 dark:text-gray-400"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPageIndex(pageNum - 1)}
                  className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    pageNum === currentPage
                      ? "bg-primary-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
                  }`}
                  aria-current={pageNum === currentPage ? "page" : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Mobile: Current page indicator */}
          <div className="sm:hidden px-3 py-1.5 bg-primary-600 text-white rounded-lg font-medium">
            {currentPage}
          </div>

          {/* Next page */}
          <button
            onClick={() => setPageIndex(Math.min(totalPages - 1, currentPage))}
            disabled={currentPage >= totalPages}
            className={`p-2 rounded-lg transition-colors ${
              currentPage >= totalPages
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
            }`}
            aria-label={t("pagination.nextPage")}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last page */}
          <button
            onClick={() => setPageIndex(totalPages - 1)}
            disabled={currentPage >= totalPages}
            className={`p-2 rounded-lg transition-colors ${
              currentPage >= totalPages
                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600"
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
