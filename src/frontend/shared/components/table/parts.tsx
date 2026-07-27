// src/frontend/shared/components/table/parts.tsx
import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/shared/utils";

import { Text } from "../typography";
import {
  cellVariants,
  headInnerVariants,
  headVariants,
  rowVariants,
} from "./variants";

type Alignment = "left" | "center" | "right";
type Density = "comfortable" | "compact";
type Width = "auto" | "icon";
type Divider = "none" | "left" | "right" | "both";
type Stripe = "none" | "even" | "odd";

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  ref?: React.Ref<HTMLTableElement>;
}

export const Table = ({ className, children, ref, ...props }: TableProps) => (
  <div className="w-full overflow-x-auto">
    <table ref={ref} className={cn("min-w-full", className)} {...props}>
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
}) => (
  <thead ref={ref} className={cn("bg-primary-ghost", className)} {...props} />
);

// ---------------------------------------------------------------------------
// TableBody
// ---------------------------------------------------------------------------

export const TableBody = ({
  className,
  ref,
  ...props
}: HTMLAttributes<HTMLTableSectionElement> & {
  ref?: React.Ref<HTMLTableSectionElement>;
}) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-divide", "surface-raised", className)}
    {...props}
  />
);

// ---------------------------------------------------------------------------
// TableRow
// ---------------------------------------------------------------------------

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  hoverable?: boolean;
  clickable?: boolean;
  stripe?: Stripe;
  ref?: React.Ref<HTMLTableRowElement>;
}

export const TableRow = ({
  className,
  hoverable = true,
  clickable = false,
  stripe = "none",
  ref,
  ...props
}: TableRowProps) => (
  <tr
    ref={ref}
    className={cn(rowVariants({ stripe, hoverable, clickable }), className)}
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
  tooltip,
  children,
  ref,
  ...props
}: TableHeadProps) => (
  <th
    title={tooltip}
    ref={ref}
    className={cn(
      headVariants({ align, density, wrap, width, divider }),
      className,
    )}
    {...props}
  >
    <div className={cn(headInnerVariants({ align }))}>
      <Text variant="label" as="span">
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
  emphasis = false,
  ref,
  ...props
}: TableCellProps) => (
  <td
    ref={ref}
    className={cn(
      cellVariants({ align, density, wrap, width, divider, emphasis }),
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
    <TableRow hoverable={false}>
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
