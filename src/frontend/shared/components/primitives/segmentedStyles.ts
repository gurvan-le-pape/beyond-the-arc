// src/frontend/shared/components/primitives/segmentedStyles.ts
import { cva } from "class-variance-authority";

/**
 * The look of a segmented choice: options side by side in one thin frame, the
 * selected one tinted.
 *
 * Shared by `SegmentedControl`, which picks a value on the page, and by link
 * rows that move between sibling pages, so the two read as one control. Kept
 * out of `SegmentedControl.tsx` because that module is `"use client"`, and a
 * server component importing a value from it receives a client reference, not
 * the string.
 */
export const segmentGroupClass =
  "inline-flex flex-wrap gap-1 rounded-button border border-divide p-1";

export const segmentOptionVariants = cva(
  "rounded-button transition-colors duration-150 focus-ring",
  {
    variants: {
      size: {
        sm: "px-2.5 py-1 text-xs",
        md: "px-3 py-1.5 text-sm",
      },
      selected: {
        true: "bg-tint-primary text-ink-primary font-semibold",
        false: "text-text-body font-medium hover:text-text-heading",
      },
    },
    defaultVariants: { size: "md", selected: false },
  },
);
