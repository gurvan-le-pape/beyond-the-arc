// src/frontend/shared/components/primitives/buttonStyles.ts
import { cva } from "class-variance-authority";

// Apart from Button.tsx, which is a client module: a server component styling
// a link as a button calls buttonVariants, and a function exported from a
// "use client" file reaches the server only as a client reference.

const BASE =
  "inline-flex items-center justify-center font-medium transition-all duration-200 " +
  "focus-ring " +
  // data-[pressed] for React Aria's buttons, which cancel the pointerdown
  // :active needs; :active for the links that borrow these classes.
  "disabled:pointer-events-none disabled:opacity-50 active:scale-95 data-[pressed]:scale-95";

export const buttonVariants = cva(BASE, {
  variants: {
    variant: {
      // ── Core intent variants ──────────────────────────────────────────────
      primary:
        "rounded-button bg-solid-primary text-on-solid-primary hover:bg-solid-primary-hover",

      secondary:
        "rounded-button bg-solid-secondary text-on-solid-secondary hover:bg-solid-secondary-hover",

      outline:
        "rounded-button border-2 border-solid-primary text-ink-primary bg-surface-inset " +
        "hover:bg-tint-primary",

      ghost: "rounded-button text-ink-primary hover:bg-tint-primary",

      // Inline text action — underlined, no background or border.
      // Use for low-emphasis actions like "Reset all" that sit next to other UI.
      link:
        "rounded text-text-secondary underline underline-offset-2 " +
        "hover:text-text-body active:scale-100 data-[pressed]:scale-100",

      danger:
        "rounded-button bg-solid-error text-on-solid-error hover:bg-solid-error-hover",

      success:
        "rounded-button bg-solid-success text-on-solid-success hover:bg-solid-success-hover",

      download:
        "rounded-button bg-solid-primary text-on-solid-primary shadow hover:bg-solid-primary-hover",

      // ── Semantic / branded ────────────────────────────────────────────────
      // Gender-specific: kept here because they encode meaning, not layout.
      male:
        "rounded-button bg-solid-male text-on-solid-male shadow-sm " +
        "hover:bg-solid-male-hover",

      female:
        "rounded-button bg-solid-female text-on-solid-female shadow-sm " +
        "hover:bg-solid-female-hover",

      // Control buttons (filter dropdowns, sort toggles, toolbar actions)
      control:
        "rounded-button border border-divide surface-subtle text-text-emphasis font-medium " +
        "hover:bg-surface-inset",
    },

    size: {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
