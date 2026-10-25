// src/frontend/shared/components/table/parts.tsx
import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/shared/utils";

import { Text } from "../typography";
import {
  cellVariants,
  headInnerVariants,
  headVariants,
  rowVariants,
  TABLE_FRAME,
  TABLE_HEADER,
} from "./variants";

type Alignment = "left" | "center" | "right";
type Density = "comfortable" | "cozy" | "compact";
type Width = "auto" | "icon" | "fit";
type Divider = "none" | "left" | "right" | "both";

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  ref?: React.Ref<HTMLTableElement>;
}

/**
 * The table element and the horizontally scrollable frame around it.
 *
 * **That wrapper is `overflow-x-auto`, which is what makes a sticky `thead`
 * impossible** — a sticky header resolves against the nearest scroll container,
 * so it would stick to the horizontal scroller rather than the viewport. Column
 * pinning is available instead, through `stickyLead` on the cells.
 *
 * These parts are the raw layer and accept `className`. Prefer `DataTable`,
 * whose variant API is deliberately closed; reach for these only where a table
 * cannot be expressed through it.
 */
export const Table = ({ className, children, ref, ...props }: TableProps) => (
  <div className={cn("w-full overflow-x-auto scroll-shadow-x", TABLE_FRAME)}>
    <table ref={ref} className={cn("min-w-full", className)} {...props}>
      {children}
    </table>
  </div>
);

// ---------------------------------------------------------------------------
// TableHeader
// ---------------------------------------------------------------------------

/**
 * The `<thead>`, carrying the shared header token.
 *
 * **No fill by design.** The header separates itself typographically over the
 * same hairline the rows use, because a tinted band under small semibold text
 * failed contrast on every surface this table sits on. Adding a background here
 * reintroduces that.
 */
export const TableHeader = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.Ref<HTMLTableSectionElement>;
}) => <thead ref={ref} className={cn(TABLE_HEADER, className)} {...props} />;

// ---------------------------------------------------------------------------
// TableBody
// ---------------------------------------------------------------------------

/**
 * The body sets no surface of its own — it inherits whatever container it sits
 * in, which for every table but one is a `Section`, i.e. a `Card` at
 * surface-subtle.
 *
 * Not `surface-raised`: globals.css reserves that elevation for "inputs,
 * modals, infoboxes, skeleton fills" and documents it as the ceiling. A table
 * body is none of those, and setting it puts a darker grey slab inside an
 * already-grey card. It also breaks row hover — under `surface-raised`,
 * `--surface-inset` resolves back to surface-raised (the ceiling has nowhere
 * above it), so `hover:bg-surface-inset` on navigable rows paints the colour
 * the row already is.
 *
 * Row separation lives here, as `divide-y`, and only here — `rowVariants` must
 * not also set a `border-b`.
 */
export const TableBody = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.Ref<HTMLTableSectionElement>;
}) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-divide", className)}
    {...props}
  />
);

// ---------------------------------------------------------------------------
// TableRow
// ---------------------------------------------------------------------------

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  interactive?: boolean;
  ref?: React.Ref<HTMLTableRowElement>;
}

/**
 * A `<tr>`, optionally styled as navigable.
 *
 * `interactive` controls hover affordance only — it adds no handler and no
 * link. Under `DataTable` it is derived from whether the row actually has a
 * destination, so a row cannot advertise a click it does not have; setting it
 * by hand here reintroduces that possibility.
 *
 * Row separation comes from `TableBody`'s `divide-y`, never from a border here.
 */
export const TableRow = ({
  className,
  interactive = false,
  ref,
  ...props
}: TableRowProps) => (
  <tr
    ref={ref}
    className={cn(rowVariants({ interactive }), className)}
    {...props}
  />
);

// ---------------------------------------------------------------------------
// TableHead
// ---------------------------------------------------------------------------

interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {
  align?: Alignment;
  density?: Density;
  wrap?: boolean;
  width?: Width;
  divider?: Divider;
  numeric?: boolean;
  stickyLead?: boolean;
  from?: "all" | "sm";
  tooltip?: string;
  ref?: React.Ref<HTMLTableCellElement>;
}

/**
 * A header cell, sharing every layout axis with `TableCell`.
 *
 * The axes — align, density, wrap, width, divider, numeric — are declared once
 * in `variants.ts` and consumed by both, so a column's header and its body
 * cells cannot drift apart. Styling one through `className` alone is what
 * breaks that.
 *
 * `numeric` is the one to reach for on a column of figures: it sets
 * `tabular-nums` and defaults the alignment right, on the header as well as the
 * cells, so a label never sits off the column it names.
 */
export const TableHead = ({
  className,
  align = "left",
  density = "comfortable",
  wrap = true,
  width = "auto",
  divider = "none",
  numeric = false,
  stickyLead = false,
  from = "all",
  tooltip,
  children,
  ref,
  ...props
}: TableHeadProps) => (
  <th
    title={tooltip}
    ref={ref}
    className={cn(
      headVariants({
        align,
        density,
        wrap,
        width,
        divider,
        numeric,
        stickyLead,
        from,
      }),
      className,
    )}
    {...props}
  >
    <div className={cn(headInnerVariants({ align }))}>
      <Text variant="overline" as="span">
        {children}
      </Text>
    </div>
  </th>
);

// ---------------------------------------------------------------------------
// TableCell
// ---------------------------------------------------------------------------

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  align?: Alignment;
  colSpan?: number;
  density?: Density;
  wrap?: boolean;
  width?: Width;
  divider?: Divider;
  numeric?: boolean;
  stickyLead?: boolean;
  from?: "all" | "sm";
  emphasis?: boolean;
  ref?: React.Ref<HTMLTableCellElement>;
}

/**
 * A body cell, sharing every layout axis with `TableHead`.
 *
 * `emphasis` is the only axis the header does not have. The rest mirror it
 * exactly and come from the same variant definitions, which is what keeps a
 * column aligned end to end.
 *
 * `stickyLead` pins the cell horizontally, and doing so makes it a positioned
 * element — which is why it cannot be combined with a row-level link overlay;
 * `DataTable`'s props type refuses that pairing outright.
 */
export const TableCell = ({
  className,
  align = "left",
  density = "comfortable",
  wrap = true,
  width = "auto",
  divider = "none",
  numeric = false,
  stickyLead = false,
  from = "all",
  emphasis = false,
  ref,
  ...props
}: TableCellProps) => (
  <td
    ref={ref}
    className={cn(
      cellVariants({
        align,
        density,
        wrap,
        width,
        divider,
        numeric,
        stickyLead,
        from,
        emphasis,
      }),
      className,
    )}
    {...props}
  />
);

// ---------------------------------------------------------------------------
// TableEmpty
// ---------------------------------------------------------------------------

interface TableEmptyProps {
  readonly colSpan: number;
  readonly message: string;
}

/**
 * The "no rows" message, as a single full-width row.
 *
 * **`colSpan` must match the table's column count.** Nothing checks it: too few
 * leaves a ragged trailing gap, too many stretches the table wider than its
 * header. It is passed rather than derived because these parts never see the
 * column definitions — `DataTable` does, and supplies it.
 */
export function TableEmpty({ colSpan, message }: TableEmptyProps) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        align="center"
        className="py-12 text-text-secondary"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
