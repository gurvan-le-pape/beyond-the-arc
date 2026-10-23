// src/frontend/shared/components/primitives/Button.tsx

import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes } from "react";

import { cn } from "@/shared/utils";

// Narrow path, not the `../feedback` barrel: that barrel re-exports
// `EmptyState`, which imports this file, so the barrel form closes a runtime
// import cycle (Button → feedback/index → EmptyState → Button) and drags the
// whole feedback + layout graph in behind it. `EmptyState.tsx` already writes
// the narrow form in the other direction.
import { Spinner } from "../feedback/Spinner";

const BASE =
  "inline-flex items-center justify-center font-medium transition-all duration-200 " +
  "focus-ring " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-95";

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
        "hover:text-text-body active:scale-100",

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

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * Button — universal action primitive.
 *
 * Use for any clickable action: form submits, modal triggers, data mutations.
 * Do NOT use for navigation links — use <a> or your router's <Link>.
 * Do NOT add layout-specific variants here (carousel, pill, nav). For a
 * button whose only content is an icon, use `IconButton`.
 *
 * @example
 * <Button variant="primary" size="lg">Save</Button>
 * <Button variant="danger" isLoading={isDeleting}>Delete</Button>
 * <Button variant="link" size="sm">Reset all</Button>
 * <Button variant="control">Filters</Button>
 */
export const Button = ({
  className,
  variant,
  size,
  isLoading,
  children,
  disabled,
  ref,
  ...props
}: ButtonProps) => (
  <button
    ref={ref}
    // Before the spread: callers can still opt into "submit"/"reset".
    type="button"
    className={cn(buttonVariants({ variant, size, className }))}
    disabled={disabled || isLoading}
    aria-busy={isLoading || undefined}
    {...props}
  >
    {isLoading ? <Spinner size="sm" /> : children}
  </button>
);
