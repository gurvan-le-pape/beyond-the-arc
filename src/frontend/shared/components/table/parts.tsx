// src/frontend/shared/components/table/parts.tsx
import { type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/shared/utils";

import { Text } from "../typography";

type Alignment = "left" | "center" | "right";

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
  ref?: React.Ref<HTMLTableRowElement>;
}

export const TableRow = ({
  className,
  hoverable = true,
  clickable = false,
  ref,
  ...props
}: TableRowProps) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-divide transition-colors duration-200",
      hoverable && "hover:bg-surface-inset",
      clickable && "cursor-pointer",
      className,
    )}
    {...props}
  />
);

// ---------------------------------------------------------------------------
// TableHead
// ---------------------------------------------------------------------------

interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {
  align?: Alignment;
  size?: "default" | "compact";
  tooltip?: string;
  ref?: React.Ref<HTMLTableCellElement>;
}

export const TableHead = ({
  className,
  align = "left",
  size = "default",
  tooltip,
  children,
  ref,
  ...props
}: TableHeadProps) => {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const alignToJustify: Record<Alignment, string> = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <th
      title={tooltip}
      ref={ref}
      className={cn(
        size === "compact"
          ? "px-1 py-1 overflow-hidden whitespace-nowrap"
          : "px-6 py-4",
        alignmentClasses[align],
        className,
      )}
      {...props}
    >
      <div className={cn("flex items-center gap-2", alignToJustify[align])}>
        <Text variant="label" as="span">
          {children}
        </Text>
      </div>
    </th>
  );
};

// ---------------------------------------------------------------------------
// TableCell
// ---------------------------------------------------------------------------

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  align?: Alignment;
  colSpan?: number;
  size?: "default" | "compact";
  ref?: React.Ref<HTMLTableCellElement>;
}

export const TableCell = ({
  className,
  align = "left",
  size = "default",
  ref,
  ...props
}: TableCellProps) => {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <td
      ref={ref}
      className={cn(
        size === "compact"
          ? "px-1 py-1 overflow-hidden whitespace-nowrap"
          : "px-6 py-4",
        alignmentClasses[align],
        "text-sm text-text-emphasis",
        className,
      )}
      {...props}
    />
  );
};

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
