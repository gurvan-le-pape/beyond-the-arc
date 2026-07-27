// src/frontend/shared/components/table/variants.ts
import { cva } from "class-variance-authority";

/**
 * Table presentation, as typed variants rather than class strings passed in
 * from call sites — the pattern the rest of the design system already uses
 * (see primitives/Button.tsx, primitives/Card.tsx).
 *
 * Private to the table module: nothing here is exported from the barrel.
 */

// ---------------------------------------------------------------------------
// Blocks shared by `th` and `td`
//
// Written once so a column's header and its body cells can never disagree —
// which is exactly what went wrong while column styling was a `className` that
// only reached the body.
// ---------------------------------------------------------------------------

const align = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

const density = {
  comfortable: "px-6 py-4",
  compact: "px-1 py-1",
} as const;

/**
 * Kept separate from `density` so a table can be dense without being forced
 * onto one line, or roomy and still nowrap. The old `size="compact"` was the
 * pair of them.
 */
const wrap = {
  true: "",
  false: "overflow-hidden whitespace-nowrap",
} as const;

const width = {
  auto: "",
  icon: "w-8",
} as const;

/** Vertical rule fencing off a group of columns, e.g. the shooting splits. */
const divider = {
  none: "",
  left: "border-l border-divide",
  right: "border-r border-divide",
  both: "border-x border-divide",
} as const;

// ---------------------------------------------------------------------------
// Elements
// ---------------------------------------------------------------------------

export const headVariants = cva("", {
  variants: { align, density, wrap, width, divider },
  defaultVariants: {
    align: "left",
    density: "comfortable",
    wrap: true,
    width: "auto",
    divider: "none",
  },
});

export const headInnerVariants = cva("flex items-center gap-2", {
  variants: {
    align: {
      left: "justify-start",
      center: "justify-center",
      right: "justify-end",
    },
  },
  defaultVariants: { align: "left" },
});

export const cellVariants = cva("text-sm text-text-emphasis", {
  variants: {
    align,
    density,
    wrap,
    width,
    divider,
    /** The one column a table is *about* — a rank, a total. */
    emphasis: { true: "font-bold text-text-heading", false: "" },
  },
  defaultVariants: {
    align: "left",
    density: "comfortable",
    wrap: true,
    width: "auto",
    divider: "none",
    emphasis: false,
  },
});
