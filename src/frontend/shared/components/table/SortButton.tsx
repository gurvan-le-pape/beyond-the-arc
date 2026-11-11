// src/frontend/shared/components/table/SortButton.tsx
"use client";

import type { ReactNode } from "react";
import { Button as AriaButton } from "react-aria-components";

interface SortButtonProps {
  readonly children: ReactNode;
  /** The column's current sort, which draws the arrow. */
  readonly sort: "ascending" | "descending" | "none";
  readonly onSort: () => void;
  /** The column's name written out, when the visible label abbreviates it. */
  readonly label?: string;
}

/**
 * The header control of a sortable column, with an arrow on the sorted one.
 *
 * The arrow is for sighted readers only: `DataTable` sets `aria-sort` on the
 * header cell from the same `sort`, which is what assistive technology
 * announces.
 */
export function SortButton({ children, sort, onSort, label }: SortButtonProps) {
  return (
    <AriaButton
      onPress={onSort}
      aria-label={label}
      className="inline-flex items-center gap-1 uppercase hover:text-ink-primary focus-ring rounded-sm"
    >
      {children}
      {sort !== "none" && (
        <span aria-hidden="true">{sort === "descending" ? "↓" : "↑"}</span>
      )}
    </AriaButton>
  );
}
