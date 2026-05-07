// src/frontend/shared/components/primitives/Button.tsx
//
// THREE exports live here, split by concern:
//
//   Button      — universal primitive. No layout knowledge.
//   NavButton   — navigation and list-item patterns.
//   PillButton  — round-selector and carousel patterns.
//

import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/shared/utils/cn";

// ---------------------------------------------------------------------------
// Shared loading spinner — used by all three components
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <svg
      className="-ml-1 mr-2 h-4 w-4 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Shared base styles
// ---------------------------------------------------------------------------

const BASE =
  "inline-flex items-center justify-center font-medium transition-all duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-surface " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-95";

// ---------------------------------------------------------------------------
// Button — universal primitive
// ---------------------------------------------------------------------------

const buttonVariants = cva(BASE, {
  variants: {
    variant: {
      // ── Core intent variants ──────────────────────────────────────────────
      primary:
        "rounded-button bg-primary-500 text-white " +
        "hover:bg-primary-600 " +
        "focus-visible:ring-primary-500",

      secondary:
        "rounded-button bg-secondary-500 text-white " +
        "hover:bg-secondary-600 " +
        "focus-visible:ring-secondary-500",

      outline:
        "rounded-button border-2 border-primary-500 text-primary-500 bg-surface-inset " +
        "hover:bg-primary-300 " +
        "focus-visible:ring-primary-500",

      ghost:
        "rounded-button text-primary-500 " +
        "hover:bg-primary-300 " +
        "focus-visible:ring-primary-500",

      // Inline text action — underlined, no background or border.
      // Use for low-emphasis actions like "Reset all" that sit next to other UI.
      link:
        "rounded text-text-muted underline underline-offset-2 " +
        "hover:text-text-body " +
        "focus-visible:ring-primary-500 " +
        "active:scale-100",

      danger:
        "rounded-button bg-error text-white " +
        "hover:bg-error-strong " +
        "focus-visible:ring-error",

      success:
        "rounded-button bg-success text-white " +
        "hover:bg-success-strong " +
        "focus-visible:ring-success",

      download:
        "rounded-button bg-gradient-to-r from-primary-700 to-secondary-600 text-white shadow " +
        "hover:from-primary-800 hover:to-secondary-700 " +
        "focus-visible:ring-primary-500",

      // ── Semantic / branded ────────────────────────────────────────────────
      // Gender-specific: kept here because they encode meaning, not layout.
      male:
        "rounded-button bg-team-male text-white shadow-sm " +
        "hover:bg-team-male-strong " +
        "focus-visible:ring-team-male",

      female:
        "rounded-button bg-team-female text-white shadow-sm " +
        "hover:bg-team-female-strong " +
        "focus-visible:ring-team-female",

      // Control buttons (filter dropdowns, sort toggles, toolbar actions)
      control:
        "rounded-button border border-divide surface-raised text-text-emphasis font-medium " +
        "hover:bg-surface-inset " +
        "focus-visible:ring-2 focus-visible:ring-primary-500",
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
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
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
 * <Button variant="icon" aria-label="Close"><XIcon /></Button>
 * <Button variant="link" size="sm">Reset all</Button>
 * <Button variant="control">Filters</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, isLoading, children, disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  ),
);

Button.displayName = "Button";

// ---------------------------------------------------------------------------
// NavButton — navigation and list-item patterns
//
// Kept separate because these variants know about layout context
// (a sidebar, a nav bar, a categorised list). Button shouldn't know that.
// ---------------------------------------------------------------------------

const navButtonVariants = cva(BASE, {
  variants: {
    variant: {
      // Segmented nav / tab bar
      navActive:
        "rounded-button bg-primary-500 text-white border-2 border-primary shadow-md " +
        "hover:bg-primary-600 " +
        "focus-visible:ring-primary-500",

      navInactive:
        "rounded-button surface-raised text-primary-500 border-2 border-primary-300 shadow-sm " +
        "hover:bg-primary-300 hover:border-primary-500 " +
        "focus-visible:ring-primary-500",

      // List item variants
      listItem:
        "w-full justify-start text-left rounded-none border-l-4 border-l-transparent " +
        "hover:bg-primary-300 hover:border-l-primary-500 " +
        "focus-visible:ring-inset focus-visible:ring-primary-500 " +
        "active:scale-100",

      // Expandable section headers
      categoryHeader:
        "w-full justify-start gap-2 text-left rounded " +
        "hover:bg-transparent " +
        "focus-visible:ring-primary-500 " +
        "active:scale-100",
    },

    size: {
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
      // List items and category headers control their own height
      auto: "h-auto",
    },
  },
  defaultVariants: {
    variant: "navActive",
    size: "md",
  },
});

export interface NavButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof navButtonVariants> {
  isLoading?: boolean;
}

/**
 * NavButton — navigation and list-item buttons.
 *
 * Use for: tab bars, sidebar nav, expandable section headers, categorised list rows.
 * These variants know about their layout context — that's why they're separate
 * from the universal Button.
 *
 * @example
 * <NavButton variant="navActive">Résultats</NavButton>
 * <NavButton variant="navInactive">Classement</NavButton>
 * <NavButton variant="listItem" size="auto">Club name</NavButton>
 * <NavButton variant="categoryHeader" size="auto">
 *   <ChevronDownIcon /> Departmental
 * </NavButton>
 */
export const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  (
    { className, variant, size, isLoading, children, disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(navButtonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  ),
);

NavButton.displayName = "NavButton";

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
        "rounded-full bg-primary text-white font-bold shadow-md " +
        "ring-2 ring-primary-300 border border-primary z-10 " +
        "focus-visible:ring-primary-500",

      // RoundSelector inactive pill
      pillInactive:
        "rounded-full surface-raised text-text-emphasis border border-divide " +
        "hover:bg-primary-300 hover:text-primary-600 hover:border-primary-300 " +
        "focus-visible:ring-primary-500",

      // Carousel prev/next arrows
      carouselArrow:
        "rounded-full p-2 border border-divide surface-raised text-text-muted " +
        "hover:bg-primary-300 hover:text-primary-500 " +
        "disabled:opacity-30 disabled:cursor-not-allowed " +
        "focus-visible:ring-primary-500 " +
        "focus-visible:ring-offset-surface",
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
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pillButtonVariants> {
  isLoading?: boolean;
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
export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
  (
    { className, variant, size, isLoading, children, disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      className={cn(pillButtonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  ),
);

PillButton.displayName = "PillButton";
