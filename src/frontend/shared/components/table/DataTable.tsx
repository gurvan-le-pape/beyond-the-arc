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
import { SortButton } from "./SortButton";
import { CELL_LINK, ROW_LINK } from "./variants";

/**
 * Definition of one column: how to label it and how to pull a cell out of a row.
 *
 * One type serves every table. A per-feature column type that differs only in
 * field names is this type with `T` bound — declare the binding, not a new type.
 */
export interface TableColumn<T> {
  /** Stable identity for the column, used as the React key. */
  readonly key: string;
  /** Header content. Omit for columns whose meaning is purely visual. */
  readonly header?: React.ReactNode;
  /** Pulls this column's cell content out of a row. */
  readonly render: (row: T) => React.ReactNode;
  /**
   * Overrides the alignment. Numeric columns already default to `right` — set
   * this only to argue with that.
   */
  readonly align?: "left" | "center" | "right";
  /**
   * A column of numbers. Sets `tabular-nums` so digits share one advance width
   * and the column stops shifting row to row, and defaults the alignment to
   * `right` so the units line up under each other. Applies to the header cell
   * as well, so a label never drifts off the column it names.
   */
  readonly numeric?: boolean;
  /** Native tooltip on the header, for abbreviated stat labels. */
  readonly tooltip?: string;
  /**
   * Vertical rule fencing off a group of columns, e.g. the shooting splits.
   * Drawn on the header cell as well as the body cells, so a group rule runs
   * the full height of the table; a `className` on the cells would reach the
   * body only and stop the rule below the header.
   */
  readonly divider?: "left" | "right" | "both";
  /** Bold, heading-toned cells, for the one column a table is *about*. */
  readonly emphasis?: boolean;
  /**
   * `icon` sizes the column to a single icon button. `fit` shrinks it to its
   * content on one line, leaving the spare width to the columns that wrap.
   */
  readonly width?: "auto" | "icon" | "fit";
  /** `sm` shows the column from the `sm` breakpoint up only, not on phones. */
  readonly from?: "sm";
  /**
   * The column's sort state, for a table its caller sorts. Set as `aria-sort`
   * on the header cell. With `onSort` it also makes the header a button that
   * shows the state as an arrow; the sorting itself stays with the caller.
   */
  readonly sort?: "ascending" | "descending" | "none";
  /**
   * Called when the header is pressed. Needs `sort`. When `tooltip` is set it
   * also names the button, since it is the abbreviated label written out.
   */
  readonly onSort?: () => void;
}

interface DataTableBaseProps<T> {
  readonly columns: TableColumn<T>[];
  readonly rows: T[];
  readonly getRowKey: (row: T) => React.Key;
  /**
   * Cell padding. Says nothing about wrapping — see `wrap`. Pick by column
   * count: `comfortable` up to a handful, `cozy` around eight to ten,
   * `compact` for a full stat line.
   */
  readonly density?: "comfortable" | "cozy" | "compact";
  /**
   * Rendered in place of the rows when `rows` is empty. Required: a header with
   * nothing under it and no explanation is never the right answer, and optional
   * means most tables ship without one.
   */
  readonly emptyMessage: string;
}

/**
 * A table whose rows navigate.
 *
 * The two exclusions below are expressed in the type rather than as comments in
 * `variants.ts`. As comments they are not enforced at all — nothing stops a
 * caller combining them, and the only guarantee is that no table happens to.
 * Both break the same way, so both are compile errors.
 */
interface RowLinkProps<T> {
  /**
   * Makes each row navigate. The lead cell's content becomes a link stretched
   * over the whole row, so rows are focusable and keyboard-activable — which
   * `onRowClick` on a `<tr>` never was.
   */
  readonly getRowHref: (row: T) => string | undefined;
  /**
   * Accessible name for the row link. Supply it whenever the lead cell alone
   * does not identify the row — a date does not.
   */
  readonly getRowLabel?: (row: T) => string;
  /**
   * Cannot be `false` alongside `getRowHref`: `wrap={false}` puts
   * `overflow-hidden` on every cell, which clips the stretched overlay back to
   * the lead cell and quietly turns the row link into a lead-cell link.
   */
  readonly wrap?: true;
  /**
   * Cannot be `true` alongside `getRowHref`: `position: sticky` makes the lead
   * `<td>` a positioned element, so the overlay's `absolute inset-0` resolves
   * against that cell instead of the `relative` `<tr>` — same collapse,
   * different cause.
   */
  readonly stickyLead?: false;
}

/** A table whose rows do not navigate, and so has no overlay to protect. */
interface PlainRowProps {
  readonly getRowHref?: undefined;
  readonly getRowLabel?: undefined;
  /** Set false on wide stat tables so cells stay on one line. */
  readonly wrap?: boolean;
  /**
   * Pins the first column while the rest scrolls sideways, so a wide table
   * keeps the thing that identifies each row in view. Pair it with a lead
   * column that actually identifies the row.
   */
  readonly stickyLead?: boolean;
}

/**
 * Where a column sits. Numbers go right, so their units, tens and hundreds
 * stack in the same places; everything else goes left. An explicit `align`
 * still wins, for the cases where a numeric column reads better centred.
 */
const alignFor = <T,>(column: TableColumn<T>) =>
  column.align ?? (column.numeric ? "right" : "left");

/** A column's header, as the sort control when the caller sorts by it. */
const headerContent = <T,>(column: TableColumn<T>) =>
  column.onSort && column.sort ? (
    <SortButton
      sort={column.sort}
      onSort={column.onSort}
      label={column.tooltip}
    >
      {column.header}
    </SortButton>
  ) : (
    column.header
  );

type DataTableProps<T> = DataTableBaseProps<T> &
  (RowLinkProps<T> | PlainRowProps);

/**
 * Column-driven table.
 *
 * Every table in the app is the same shape — a header built from column
 * labels and a body built by mapping rows through those columns — so that
 * shape lives here once. Callers supply columns and rows; anything genuinely
 * per-feature (expand/collapse, a surrounding Section) stays with the caller.
 *
 * Presentation is a closed set of typed variants: there are no `className`
 * props, on the table, the header, the cells or the rows. A look this
 * component cannot express is a request for a new named variant, reviewed
 * once here, rather than a class string pasted at a call site — which is how
 * four tables end up with three framings and two stripe recipes.
 */
export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  density = "comfortable",
  wrap = true,
  emptyMessage,
  getRowHref,
  getRowLabel,
  stickyLead = false,
}: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column, columnIndex) => (
            <TableHead
              key={column.key}
              align={alignFor(column)}
              density={density}
              wrap={wrap}
              width={column.width}
              divider={column.divider}
              numeric={column.numeric}
              stickyLead={stickyLead && columnIndex === 0}
              from={column.from}
              tooltip={column.tooltip}
              aria-sort={column.sort}
            >
              {headerContent(column)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.length === 0 ? (
          <TableEmpty colSpan={columns.length} message={emptyMessage} />
        ) : (
          rows.map((row) => {
            const href = getRowHref?.(row);
            return (
              <TableRow key={getRowKey(row)} interactive={href !== undefined}>
                {columns.map((column, columnIndex) => (
                  <TableCell
                    key={column.key}
                    align={alignFor(column)}
                    density={density}
                    wrap={wrap}
                    width={column.width}
                    divider={column.divider}
                    numeric={column.numeric}
                    stickyLead={stickyLead && columnIndex === 0}
                    from={column.from}
                    emphasis={column.emphasis}
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

interface TableCellLinkProps {
  /** Locale-aware path, same contract as `getRowHref`. */
  readonly href: string;
  /** Supply when the link text alone does not say where it goes. */
  readonly "aria-label"?: string;
  readonly children: React.ReactNode;
}

/**
 * Navigation for a cell in a table that cannot use `getRowHref`.
 *
 * A `wrap={false}` or `stickyLead` table has no working stretched overlay, and
 * the props type refuses the combination rather than shipping a row link that
 * has silently shrunk to the lead cell. Those tables use this instead: a real
 * link, scoped to the one cell that identifies the row.
 *
 * Exists here rather than at the call sites so table link presentation stays
 * inside the module — the same reason `DataTable` takes no `className`. Reach
 * for `getRowHref` first; this is the fallback, not the default.
 */
export function TableCellLink({
  href,
  "aria-label": ariaLabel,
  children,
}: TableCellLinkProps) {
  return (
    <Link href={href} aria-label={ariaLabel} className={CELL_LINK}>
      {children}
    </Link>
  );
}
