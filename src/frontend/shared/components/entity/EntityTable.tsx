// src/frontend/shared/components/entity/EntityTable.tsx
import { useTranslations } from "next-intl";
import React from "react";

import {
  EmptyState,
  ErrorMessage,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui";
import { Button } from "@/shared/components/ui/primitives/Button";
import { Card } from "@/shared/components/ui/primitives/Card";
import type { FilterKey } from "@/shared/types";
import type { FilterRenderer } from "@/shared/utils/tableFilters";

import FilterRow from "./table/FilterRow";
import TableSkeleton from "./table/TableSkeleton";

interface EntityTableProps<RowType> {
  readonly columns: any[];
  readonly table: any;
  readonly isLoading: boolean;
  readonly error?: string | null;
  readonly onRowClick: (id: number) => void;
  readonly emptyMessage: string;
  readonly onRetry?: () => void;
  readonly skeletonRowCount?: number;
  readonly testID?: string;
  readonly ariaLabel: string;
  readonly rowAriaLabel: (row: RowType) => string;
  readonly rowTestId: (id: string | number) => string;
  readonly cellTestId: (cellId: string) => string;
  readonly filterableDropdownKeys: FilterKey[];
  readonly filterRenderers: Record<FilterKey, FilterRenderer<RowType>>;
  readonly headerTestId?: (colId: string) => string;
  readonly errorRowTestId?: string;
  readonly retryButtonTestId?: string;
  readonly emptyRowTestId?: string;
  readonly className?: string;
}

export function EntityTable<RowType extends { id: string | number }>(
  props: EntityTableProps<RowType>,
) {
  const {
    columns,
    table,
    isLoading,
    error,
    onRowClick,
    emptyMessage,
    onRetry,
    skeletonRowCount = 10,
    testID,
    ariaLabel,
    rowAriaLabel,
    rowTestId,
    cellTestId,
    filterableDropdownKeys,
    filterRenderers,
    headerTestId,
    errorRowTestId,
    retryButtonTestId,
    emptyRowTestId,
    className,
  } = props;

  const t = useTranslations("common");
  const rows = table.getRowModel().rows;
  const rowCount = rows.length;

  let tableBody: React.ReactNode;
  if (error) {
    tableBody = (
      <TableBody>
        <TableRow hoverable={false}>
          <TableCell
            colSpan={columns.length}
            align="center"
            className="py-12"
            data-testid={errorRowTestId ?? "error-row"}
          >
            <div className="space-y-4">
              <ErrorMessage message={error} />
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="md"
                  aria-label={t("retry")}
                  data-testid={retryButtonTestId ?? "retry-button"}
                >
                  {t("retry")}
                </Button>
              )}
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  } else if (isLoading) {
    tableBody = (
      <TableSkeleton columns={columns.length} rows={skeletonRowCount} />
    );
  } else if (rowCount === 0) {
    tableBody = (
      <TableBody>
        <TableRow hoverable={false}>
          <TableCell
            colSpan={columns.length}
            align="center"
            className="py-12"
            data-testid={emptyRowTestId ?? "empty-row"}
          >
            <EmptyState title={t("noData")} message={emptyMessage} />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  } else {
    tableBody = (
      <TableBody>
        {rows.map((row: any, index: number) => (
          <TableRow
            key={row.id}
            clickable
            onClick={() => onRowClick(row.original.id)}
            tabIndex={0}
            aria-label={rowAriaLabel(row.original)}
            aria-selected="false"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onRowClick(row.original.id);
              }
            }}
            data-testid={rowTestId(row.original.id)}
            className={
              index % 2 === 0
                ? "bg-primary-50 dark:bg-primary-900/20"
                : "bg-surface-raised dark:bg-surface-raised-dark"
            }
          >
            {row.getVisibleCells().map((cell: any) => (
              <TableCell
                key={cell.id}
                align="center"
                data-testid={cellTestId(cell.id)}
              >
                {cell.column.columnDef.cell(cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  }

  return (
    <Card
      variant="highlighted"
      padding="sm"
      className={className}
      data-testid={testID || "entity-table"}
      aria-label={ariaLabel}
    >
      <div className="overflow-x-auto">
        <Table className="border border-primary-500 dark:border-primary-600 rounded-card box-border">
          <TableHeader className="bg-primary-100 dark:bg-primary-900/30 border-b border-primary-500 dark:border-primary-600">
            {table.getHeaderGroups().map((headerGroup: any, i: number) => (
              <React.Fragment key={headerGroup.id}>
                {/* Column Headers */}
                <TableRow hoverable={false}>
                  {headerGroup.headers.map((header: any) => {
                    const canSort = header.column.getCanSort?.();
                    const isSorted = header.column.getIsSorted();
                    const toggleSortHandler =
                      header.column.getToggleSortingHandler?.();
                    const colId = header.column.id;

                    let ariaSort: "ascending" | "descending" | "none";
                    if (isSorted) {
                      ariaSort =
                        isSorted === "asc" ? "ascending" : "descending";
                    } else {
                      ariaSort = "none";
                    }

                    return (
                      <TableHead
                        key={header.id}
                        align="center"
                        sortable={canSort}
                        sortDirection={isSorted || null}
                        onSort={
                          canSort && toggleSortHandler
                            ? toggleSortHandler
                            : undefined
                        }
                        aria-sort={ariaSort}
                        aria-label={
                          canSort ? ariaLabel + " sort by " + colId : undefined
                        }
                        data-testid={
                          headerTestId ? headerTestId(colId) : undefined
                        }
                      >
                        {header.column.columnDef.header(header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>

                {/* Filter Row - only show on first header group */}
                {i === 0 && (
                  <FilterRow
                    headerGroup={table.getHeaderGroups()[0]}
                    filterableDropdownKeys={filterableDropdownKeys}
                    filterRenderers={filterRenderers}
                  />
                )}
              </React.Fragment>
            ))}
          </TableHeader>

          {tableBody}
        </Table>
      </div>
    </Card>
  );
}

export default EntityTable;
