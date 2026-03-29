// src/frontend/shared/components/ui/primitives/Table.tsx
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

/**
 * Table Root Component
 * Wrapper for the entire table with responsive container
 */
interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="w-full overflow-x-auto">
        <table ref={ref} className={cn("min-w-full", className)} {...props}>
          {children}
        </table>
      </div>
    );
  },
);

Table.displayName = "Table";

/**
 * Table Header Component
 */
export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  return (
    <thead
      ref={ref}
      className={cn("bg-surface-subtle dark:bg-surface-subtle-dark", className)}
      {...props}
    />
  );
});

TableHeader.displayName = "TableHeader";

/**
 * Table Body Component
 */
export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  return (
    <tbody
      ref={ref}
      className={cn(
        "divide-y divide-divide-light dark:divide-divide-dark bg-surface-raised dark:bg-surface-raised-dark",
        className,
      )}
      {...props}
    />
  );
});

TableBody.displayName = "TableBody";

/**
 * Table Footer Component (for totals, etc.)
 */
export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => {
  return (
    <tfoot
      ref={ref}
      className={cn(
        "bg-surface-subtle dark:bg-surface-subtle-dark font-medium text-text-heading dark:text-text-heading-dark",
        className,
      )}
      {...props}
    />
  );
});

TableFooter.displayName = "TableFooter";

/**
 * Table Row Component
 */
interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  hoverable?: boolean;
  clickable?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, hoverable = true, clickable = false, ...props }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "border-b border-divide-light dark:border-divide-dark transition-colors duration-200",
          hoverable &&
            "hover:bg-surface-subtle dark:hover:bg-surface-subtle-dark",
          clickable && "cursor-pointer",
          className,
        )}
        {...props}
      />
    );
  },
);

TableRow.displayName = "TableRow";

/**
 * Table Head Cell Component
 */
interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      align = "left",
      sortable = false,
      sortDirection = null,
      onSort,
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
          "px-6 py-4 text-sm font-semibold text-text-heading dark:text-text-heading-dark",
          alignmentClasses[align],
          sortable &&
            "cursor-pointer select-none hover:bg-surface-subtle dark:hover:bg-surface-subtle-dark transition-colors duration-200",
          className,
        )}
        onClick={sortable ? onSort : undefined}
        {...props}
      >
        <div className="flex items-center justify-center gap-2">
          <span>{children}</span>
          {sortable && (
            <span className="flex flex-col">
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

/**
 * Table Cell Component
 */
interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  highlight?: boolean;
  colSpan?: number;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, align = "left", highlight = false, ...props }, ref) => {
    const alignmentClasses = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    return (
      <td
        ref={ref}
        className={cn(
          "px-6 py-4 text-sm text-text-emphasis dark:text-text-emphasis-dark",
          alignmentClasses[align],
          highlight &&
            "font-bold text-text-heading dark:text-text-heading-dark",
          className,
        )}
        {...props}
      />
    );
  },
);

TableCell.displayName = "TableCell";

/**
 * Table Caption Component (for accessibility)
 */
export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => {
  return (
    <caption
      ref={ref}
      className={cn(
        "mt-4 text-sm text-text-secondary dark:text-text-secondary-dark",
        className,
      )}
      {...props}
    />
  );
});

TableCaption.displayName = "TableCaption";

/**
 * Empty State for Tables
 */
interface TableEmptyProps {
  colSpan: number;
  message: string;
}

export function TableEmpty({ colSpan, message }: TableEmptyProps) {
  return (
    <TableRow hoverable={false}>
      <TableCell
        colSpan={colSpan}
        align="center"
        className="py-12 text-text-secondary dark:text-text-secondary-dark"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
