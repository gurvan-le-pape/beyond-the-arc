// src/frontend/shared/components/primitives/Button.tsx
//
// THREE exports live here, split by concern:
//
//   Button      — universal primitive. No layout knowledge.
//   NavButton   — navigation and list-item patterns.
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
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-surface " +
  "disabled:pointer-events-none disabled:opacity-50 active:scale-95";

// ---------------------------------------------------------------------------
// Button — universal primitive
// ---------------------------------------------------------------------------

export const buttonVariants = cva(BASE, {
  variants: {
    variant: {
      // ── Core intent variants ──────────────────────────────────────────────
      primary:
        "rounded-button bg-primary text-white " +
        "hover:bg-primary-strong " +
        "focus-visible:ring-primary",

      secondary:
        "rounded-button bg-secondary text-white " +
        "hover:bg-secondary-strong " +
        "focus-visible:ring-secondary",

      outline:
        "rounded-button border-2 border-primary text-primary bg-surface-inset " +
        "hover:bg-primary-subtle " +
        "focus-visible:ring-primary",

      ghost:
        "rounded-button text-primary " +
        "hover:bg-primary-subtle " +
        "focus-visible:ring-primary",

      // Inline text action — underlined, no background or border.
      // Use for low-emphasis actions like "Reset all" that sit next to other UI.
      link:
        "rounded text-text-secondary underline underline-offset-2 " +
        "hover:text-text-body " +
        "focus-visible:ring-primary " +
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
        "rounded-button bg-gradient-to-r from-primary-bold to-secondary-strong text-white shadow " +
        "hover:from-primary-deep hover:to-secondary-bold " +
        "focus-visible:ring-primary",

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

      // Domain entity-specific
      clubs:
        "rounded-button bg-clubs text-white shadow-sm " +
        "hover:bg-clubs-strong " +
        "focus-visible:ring-clubs",

      // Control buttons (filter dropdowns, sort toggles, toolbar actions)
      control:
        "rounded-button border border-divide surface-subtle text-text-emphasis font-medium " +
        "hover:bg-surface-inset " +
        "focus-visible:ring-2 focus-visible:ring-primary",
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
 * <Button variant="clubs">Find a club</Button>
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
// NavButton — navigation and list-item patterns
//
// Kept separate because these variants know about layout context
// (a sidebar, a nav bar, a categorised list). Button shouldn't know that.
// ---------------------------------------------------------------------------

// Exported like buttonVariants, so a real `<a>`/`<Link>` can wear the nav-item
// look without being rebuilt as a button — see ChampionshipNavigation.
export const navButtonVariants = cva(BASE, {
  variants: {
    variant: {
      // Segmented nav / tab bar
      navActive:
        "rounded-button bg-primary text-white border-2 border-primary shadow-md " +
        "hover:bg-primary-strong " +
        "focus-visible:ring-primary",

      navInactive:
        "rounded-button surface-raised text-primary border-2 border-primary-subtle shadow-sm " +
        "hover:bg-primary-subtle hover:border-primary " +
        "focus-visible:ring-primary",

      // List item variants
      listItem:
        "w-full justify-start text-left rounded-none border-l-4 border-l-transparent " +
        "hover:bg-primary-subtle hover:border-l-primary " +
        "focus-visible:ring-inset focus-visible:ring-primary " +
        "active:scale-100",

      // Expandable section headers
      categoryHeader:
        "w-full justify-start gap-2 text-left rounded " +
        "hover:bg-transparent " +
        "focus-visible:ring-primary " +
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
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof navButtonVariants> {
  isLoading?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
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
export const NavButton = ({
  className,
  variant,
  size,
  isLoading,
  children,
  disabled,
  ref,
  ...props
}: NavButtonProps) => (
  <button
    ref={ref}
    type="button"
    className={cn(navButtonVariants({ variant, size, className }))}
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
        "rounded-full bg-primary text-white font-bold shadow-md " +
        "ring-2 ring-primary-subtle border border-primary z-10 " +
        "focus-visible:ring-primary",

      // RoundSelector inactive pill
      pillInactive:
        "rounded-full surface-raised text-text-emphasis border border-divide " +
        "hover:bg-primary-subtle hover:text-primary-strong hover:border-primary-subtle " +
        "focus-visible:ring-primary",

      // Carousel prev/next arrows
      carouselArrow:
        "rounded-full p-2 border border-divide surface-raised text-text-muted " +
        "hover:bg-primary-subtle hover:text-primary " +
        "disabled:opacity-30 disabled:cursor-not-allowed " +
        "focus-visible:ring-primary " +
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
