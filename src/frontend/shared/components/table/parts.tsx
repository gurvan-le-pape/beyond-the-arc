// src/frontend/shared/components/table/parts.tsx
import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/shared/utils";

import { Text } from "../typography";
import {
  cellVariants,
  headInnerVariants,
  headVariants,
  rowVariants,
  TABLE_HEAD_TEXT,
  TABLE_HEADER,
  tableVariants,
} from "./variants";

type Alignment = "left" | "center" | "right";
type Density = "comfortable" | "cozy" | "compact";
type Width = "auto" | "icon";
type Divider = "none" | "left" | "right" | "both";
type Frame = "none" | "outline";

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  frame?: Frame;
  ref?: React.Ref<HTMLTableElement>;
}

export const Table = ({
  className,
  children,
  frame = "none",
  ref,
  ...props
}: TableProps) => (
  <div className="w-full overflow-x-auto">
    <table
      ref={ref}
      className={cn(tableVariants({ frame }), className)}
      {...props}
    >
      {children}
    </table>
  </div>
);

// ---------------------------------------------------------------------------
// TableHeader
// ---------------------------------------------------------------------------

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
 * It used to carry `surface-raised`, the elevation globals.css reserves for
 * "inputs, modals, infoboxes, skeleton fills" and documents as the ceiling. A
 * table body is none of those, and the result was a darker grey slab boxed
 * inside an already-grey card. Inheriting also repairs row hover: under
 * `surface-raised`, `--surface-inset` resolved back to surface-raised (the
 * ceiling has nowhere above it), so `hover:bg-surface-inset` on navigable rows
 * painted the colour the row already was.
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
  tooltip?: string;
  ref?: React.Ref<HTMLTableCellElement>;
}

export const TableHead = ({
  className,
  align = "left",
  density = "comfortable",
  wrap = true,
  width = "auto",
  divider = "none",
  numeric = false,
  tooltip,
  children,
  ref,
  ...props
}: TableHeadProps) => (
  <th
    title={tooltip}
    ref={ref}
    className={cn(
      headVariants({ align, density, wrap, width, divider, numeric }),
      className,
    )}
    {...props}
  >
    <div className={cn(headInnerVariants({ align }))}>
      <Text variant="overline" as="span" className={TABLE_HEAD_TEXT}>
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
  emphasis?: boolean;
  ref?: React.Ref<HTMLTableCellElement>;
}

export const TableCell = ({
  className,
  align = "left",
  density = "comfortable",
  wrap = true,
  width = "auto",
  divider = "none",
  numeric = false,
  emphasis = false,
  ref,
  ...props
}: TableCellProps) => (
  <td
    ref={ref}
    className={cn(
      cellVariants({ align, density, wrap, width, divider, numeric, emphasis }),
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
