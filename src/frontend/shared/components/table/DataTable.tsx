// src/frontend/shared/components/table/DataTable.tsx
import React from "react";

import { Link } from "@/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "./parts";
import { ROW_LINK } from "./variants";

/**
 * Definition of one column: how to label it and how to pull a cell out of a row.
 *
 * This replaced two near-identical per-feature column types (a match-history
 * one and a player-stats one) that differed only in field names.
 */
export interface TableColumn<T> {
  /** Stable identity for the column, used as the React key. */
  readonly key: string;
  /** Header content. Omit for columns whose meaning is purely visual. */
  readonly header?: React.ReactNode;
  /** Pulls this column's cell content out of a row. */
  readonly render: (row: T) => React.ReactNode;
  readonly align?: "left" | "center" | "right";
  /** Native tooltip on the header, for abbreviated stat labels. */
  readonly tooltip?: string;
  /**
   * Vertical rule fencing off a group of columns, e.g. the shooting splits.
   * Drawn on the header cell as well as the body cells — the previous
   * `className` reached only the body, so group rules stopped below the header.
   */
  readonly divider?: "left" | "right" | "both";
  /** Bold, heading-toned cells, for the one column a table is *about*. */
  readonly emphasis?: boolean;
  /** `icon` sizes the column to a single icon button. */
  readonly width?: "auto" | "icon";
}

interface DataTableProps<T> {
  readonly columns: TableColumn<T>[];
  readonly rows: T[];
  readonly getRowKey: (row: T) => React.Key;
  /**
   * The table's outer treatment. `outline` is for a table that stands on its
   * own; a table inside a Section stays `none`, because the Section is already
   * a bordered Card.
   */
  readonly frame?: "none" | "outline";
  /** Cell padding. Says nothing about wrapping — see `wrap`. */
  readonly density?: "comfortable" | "compact";
  /** Set false on wide stat tables so cells stay on one line. */
  readonly wrap?: boolean;
  /**
   * Rendered in place of the rows when `rows` is empty. Required: a header
   * with nothing under it and no explanation is never the right answer, and
   * making it optional meant three of the four tables shipped without one.
   */
  readonly emptyMessage: string;
  /**
   * Makes each row navigate. The lead cell's content becomes a link stretched
   * over the whole row, so rows are focusable and keyboard-activable — which
   * `onRowClick` on a `<tr>` never was.
   */
  readonly getRowHref?: (row: T) => string;
  /**
   * Accessible name for the row link. Supply it whenever the lead cell alone
   * does not identify the row — a date does not.
   */
  readonly getRowLabel?: (row: T) => string;
  /** Alternating row backgrounds. */
  readonly striped?: boolean;
  /** Extra classes applied to every header cell. */
  readonly headerClassName?: string;
  /** Extra classes applied to every body cell. */
  readonly cellClassName?: string;
}

/**
 * Column-driven table.
 *
 * Every table in the app is the same shape — a header built from column
 * labels and a body built by mapping rows through those columns — so that
 * shape lives here once. Callers supply columns and rows; anything genuinely
 * per-feature (expand/collapse, sorting, a surrounding Section) stays with the
 * caller.
 */
/** Which stripe band a row sits in, or none when striping is off. */
const stripeFor = (striped: boolean, index: number) => {
  if (!striped) return "none" as const;
  return index % 2 === 0 ? ("even" as const) : ("odd" as const);
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  frame = "none",
  density = "comfortable",
  wrap = true,
  emptyMessage,
  getRowHref,
  getRowLabel,
  striped = false,
  headerClassName,
  cellClassName,
}: DataTableProps<T>) {
  return (
    <Table frame={frame}>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.key}
              align={column.align}
              density={density}
              wrap={wrap}
              width={column.width}
              divider={column.divider}
              tooltip={column.tooltip}
              className={headerClassName}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.length === 0 ? (
          <TableEmpty colSpan={columns.length} message={emptyMessage} />
        ) : (
          rows.map((row, index) => {
            const href = getRowHref?.(row);
            return (
              <TableRow
                key={getRowKey(row)}
                interactive={href !== undefined}
                stripe={stripeFor(striped, index)}
              >
                {columns.map((column, columnIndex) => (
                  <TableCell
                    key={column.key}
                    align={column.align}
                    density={density}
                    wrap={wrap}
                    width={column.width}
                    divider={column.divider}
                    emphasis={column.emphasis}
                    className={cellClassName}
                  >
                    {href !== undefined && columnIndex === 0 ? (
                      <Link
                        href={href}
                        aria-label={getRowLabel?.(row)}
                        className={ROW_LINK}
                      >
                        {column.render(row)}
                      </Link>
                    ) : (
                      column.render(row)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}

export default DataTable;
