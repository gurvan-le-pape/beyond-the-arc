// src/frontend/shared/components/primitives/Button.tsx
//
// TWO exports live here, split by concern:
//
//   Button      — universal primitive. No layout knowledge.
//   PillButton  — round-selector and carousel patterns.
//

import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes } from "react";

import { cn } from "@/shared/utils";

// Narrow path, not the `../feedback` barrel: that barrel re-exports
// `EmptyState`, which imports this file, so the barrel form closes a runtime
// import cycle (Button → feedback/index → EmptyState → Button) and drags the
// whole feedback + layout graph in behind it. `EmptyState.tsx` already writes
// the narrow form in the other direction.
import { LoadingSpinner } from "../feedback/LoadingSpinner";

// ---------------------------------------------------------------------------
// Shared base styles
// ---------------------------------------------------------------------------

const BASE =
  "inline-flex items-center justify-center font-medium transition-all duration-200 " +
  "focus-ring " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-95";

// ---------------------------------------------------------------------------
// Button — universal primitive
// ---------------------------------------------------------------------------

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
      // Icon-only: square, no padding. Always pair with an aria-label.
      icon: "h-10 w-10",
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
 * Do NOT add layout-specific variants here (carousel, pill, nav).
 *
 * @example
 * <Button variant="primary" size="lg">Save</Button>
 * <Button variant="danger" isLoading={isDeleting}>Delete</Button>
 * <Button size="icon" aria-label="Close"><XIcon /></Button>
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
    {isLoading ? <LoadingSpinner size="sm" /> : children}
  </button>
);

// ---------------------------------------------------------------------------
// PillButton — round-selector and carousel patterns
//
// Kept separate because these have non-standard sizes (pill, icon-sm) and
// visual treatments (ring overlay, rounded-full) that don't belong in a
// general-purpose button.
// ---------------------------------------------------------------------------

const pillButtonVariants = cva(BASE, {
  variants: {
    variant: {
      // RoundSelector active pill
      pillActive:
        "rounded-full bg-solid-primary text-on-solid-primary font-bold shadow-md " +
        "ring-2 ring-line-primary border border-solid-primary z-raised",

      // RoundSelector inactive pill
      pillInactive:
        "rounded-full surface-raised text-text-emphasis border border-divide " +
        "hover:bg-tint-primary hover:text-ink-primary hover:border-line-primary",

      // Carousel prev/next arrows
      carouselArrow:
        "rounded-full p-2 border border-divide surface-raised text-text-muted " +
        "hover:bg-tint-primary hover:text-ink-primary " +
        "disabled:opacity-30 disabled:cursor-not-allowed",
    },

    size: {
      // Standard pill (RoundSelector)
      pill: "px-4 py-2 text-lg",
      // Square icon (carousel arrow — padding already in variant)
      icon: "h-9 w-9",
    },
  },
  defaultVariants: {
    variant: "pillInactive",
    size: "pill",
  },
});

export interface PillButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pillButtonVariants> {
  isLoading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

/**
 * PillButton — round-selector and carousel arrow buttons.
 *
 * @example
 * <PillButton variant="pillActive" size="pill">Round 1</PillButton>
 * <PillButton variant="pillInactive" size="pill">Round 2</PillButton>
 * <PillButton variant="carouselArrow" size="icon" aria-label="Previous">
 *   <ChevronLeftIcon className="h-5 w-5" />
 * </PillButton>
 */
export const PillButton = ({
  className,
  variant,
  size,
  isLoading,
  children,
  disabled,
  ref,
  ...props
}: PillButtonProps) => (
  <button
    ref={ref}
    type="button"
    className={cn(pillButtonVariants({ variant, size, className }))}
    disabled={disabled || isLoading}
    aria-busy={isLoading || undefined}
    {...props}
  >
    {isLoading ? <LoadingSpinner size="sm" /> : children}
  </button>
);
