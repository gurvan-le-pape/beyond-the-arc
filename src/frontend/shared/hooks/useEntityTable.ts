// src/frontend/shared/hooks/useEntityTable.ts
import type { ColumnFiltersState, OnChangeFn } from "@tanstack/react-table";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface UseEntityTableProps<T> {
  data: T[];
  columns: any[];
  pagination: { page: number; totalPages: number } | null;
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
}

export function useEntityTable<T>({
  data,
  columns,
  pagination,
  pageSize,
  setCurrentPage,
  columnFilters,
  setColumnFilters,
  onColumnFiltersChange,
}: UseEntityTableProps<T>) {
  return useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages || 1,
    state: {
      pagination: {
        pageIndex: (pagination?.page || 1) - 1,
        pageSize: pageSize,
      },
      columnFilters,
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const next = updater({
          pageIndex: (pagination?.page || 1) - 1,
          pageSize: pageSize,
        });
        setCurrentPage(next.pageIndex + 1);
      } else {
        setCurrentPage(updater.pageIndex + 1);
      }
    },
    onColumnFiltersChange: onColumnFiltersChange || setColumnFilters,
    manualSorting: true,
    manualFiltering: true,
  });
}
