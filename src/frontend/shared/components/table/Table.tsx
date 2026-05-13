// src/frontend/shared/components/table/Table.tsx
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/shared/utils";

import { Text } from "../typography";

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => (
    <div className="w-full overflow-x-auto">
      <table ref={ref} className={cn("min-w-full", className)} {...props}>
        {children}
      </table>
    </div>
  ),
);
Table.displayName = "Table";

// ---------------------------------------------------------------------------
// TableHeader
// ---------------------------------------------------------------------------

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-surface-subtle", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

// ---------------------------------------------------------------------------
// TableBody
// ---------------------------------------------------------------------------

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-divide", "surface-raised", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

// ---------------------------------------------------------------------------
// TableFooter
// ---------------------------------------------------------------------------

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "bg-surface-subtle",
      "font-medium text-text-heading",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

// ---------------------------------------------------------------------------
// TableRow
// ---------------------------------------------------------------------------

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  hoverable?: boolean;
  clickable?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, hoverable = true, clickable = false, ...props }, ref) => (
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
  ),
);
TableRow.displayName = "TableRow";

// ---------------------------------------------------------------------------
// TableHead
// ---------------------------------------------------------------------------

interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
  size?: "default" | "compact";
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      align = "left",
      sortable = false,
      sortDirection = null,
      onSort,
      size = "default",
      children,
      ...props
    },
    ref,
  ) => {
    const alignmentClasses = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    return (
      <th
        ref={ref}
        className={cn(
          size === "compact"
            ? "px-1 py-1 overflow-hidden whitespace-nowrap"
            : "px-6 py-4",
          alignmentClasses[align],
          sortable &&
            "cursor-pointer select-none hover:bg-surface-inset transition-colors duration-200",
          className,
        )}
        onClick={sortable ? onSort : undefined}
        {...props}
      >
        <div className="flex items-center justify-center gap-2">
          <Text variant="label" as="span">
            {children}
          </Text>
          {sortable && (
            <span className="flex flex-col" aria-hidden="true">
              <svg
                className={cn(
                  "w-3 h-3 transition-opacity duration-200",
                  sortDirection === "asc" ? "opacity-100" : "opacity-30",
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M5 10l5-5 5 5H5z" />
              </svg>
              <svg
                className={cn(
                  "w-3 h-3 -mt-1 transition-opacity duration-200",
                  sortDirection === "desc" ? "opacity-100" : "opacity-30",
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M15 10l-5 5-5-5h10z" />
              </svg>
            </span>
          )}
        </div>
      </th>
    );
  },
);
TableHead.displayName = "TableHead";

// ---------------------------------------------------------------------------
// TableCell
// ---------------------------------------------------------------------------

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  highlight?: boolean;
  colSpan?: number;
  size?: "default" | "compact";
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    {
      className,
      align = "left",
      highlight = false,
      size = "default",
      ...props
    },
    ref,
  ) => {
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
          highlight && "font-bold text-text-heading",
          className,
        )}
        {...props}
      />
    );
  },
);
TableCell.displayName = "TableCell";

// ---------------------------------------------------------------------------
// TableCaption
// ---------------------------------------------------------------------------

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-text-secondary", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

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
