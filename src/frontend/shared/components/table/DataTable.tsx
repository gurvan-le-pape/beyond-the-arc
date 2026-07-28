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
   * Drawn on the header cell as well as the body cells — the previous
   * `className` reached only the body, so group rules stopped below the header.
   */
  readonly divider?: "left" | "right" | "both";
  /** Bold, heading-toned cells, for the one column a table is *about*. */
  readonly emphasis?: boolean;
  /** `icon` sizes the column to a single icon button. */
  readonly width?: "auto" | "icon";
}

interface DataTableBaseProps<T> {
  readonly columns: TableColumn<T>[];
  readonly rows: T[];
  readonly getRowKey: (row: T) => React.Key;
  /**
   * The table's outer treatment. `outline` is for a table that stands on its
   * own; a table inside a Section stays `none`, because the Section is already
   * a bordered Card.
   */
  readonly frame?: "none" | "outline";
  /**
   * Cell padding. Says nothing about wrapping — see `wrap`. Pick by column
   * count: `comfortable` up to a handful, `cozy` around eight to ten,
   * `compact` for a full stat line.
   */
  readonly density?: "comfortable" | "cozy" | "compact";
  /**
   * Rendered in place of the rows when `rows` is empty. Required: a header
   * with nothing under it and no explanation is never the right answer, and
   * making it optional meant three of the four tables shipped without one.
   */
  readonly emptyMessage: string;
}

/**
 * A table whose rows navigate.
 *
 * The two exclusions below used to be comments in `variants.ts`, which is to
 * say they were not enforced at all — the one `wrap={false}` table happened
 * not to use row links, and that was the whole guarantee. Both break the same
 * way and both are now compile errors.
 */
interface RowLinkProps<T> {
  /**
   * Makes each row navigate. The lead cell's content becomes a link stretched
   * over the whole row, so rows are focusable and keyboard-activable — which
   * `onRowClick` on a `<tr>` never was.
   */
  readonly getRowHref: (row: T) => string;
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

type DataTableProps<T> = DataTableBaseProps<T> &
  (RowLinkProps<T> | PlainRowProps);

/**
 * Where a column sits. Numbers go right, so their units, tens and hundreds
 * stack in the same places; everything else goes left. An explicit `align`
 * still wins, for the cases where a numeric column reads better centred.
 */
const alignFor = <T,>(column: TableColumn<T>) =>
  column.align ?? (column.numeric ? "right" : "left");

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
 * four tables previously ended up with three framings and two stripe recipes.
 */
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
  stickyLead = false,
}: DataTableProps<T>) {
  return (
    <Table frame={frame}>
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
              tooltip={column.tooltip}
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

export default DataTable;
