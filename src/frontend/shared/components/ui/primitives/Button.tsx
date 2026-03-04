// src/frontend/shared/components/ui/primitives/Button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";

import { cn } from "@/shared/utils/cn";

/**
 * Button variants using CVA
 *
 * Provides consistent button styling across the app with multiple variants
 */
const buttonVariants = cva(
  // Base styles (always applied)
  "inline-flex items-center justify-center rounded-button font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus-visible:ring-primary-500",
        secondary:
          "bg-secondary-600 text-white hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600 focus-visible:ring-secondary-500",
        outline:
          "border-2 border-primary-600 text-primary-600 bg-white hover:bg-primary-50 dark:border-primary-400 dark:text-primary-400 dark:bg-gray-800 dark:hover:bg-gray-700 focus-visible:ring-primary-500",
        ghost:
          "text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-gray-800 focus-visible:ring-primary-500",
        danger:
          "bg-error text-white hover:bg-error-dark focus-visible:ring-error",
        success:
          "bg-success text-white hover:bg-success-dark focus-visible:ring-success",

        // Gender-specific variants
        male: "bg-team-male text-white hover:bg-team-male-dark dark:bg-team-male-light dark:hover:bg-team-male focus-visible:ring-team-male shadow-sm",
        female:
          "bg-team-female text-white hover:bg-team-female-dark dark:bg-team-female-light dark:hover:bg-team-female focus-visible:ring-team-female shadow-sm",

        // Navigation variants
        navActive:
          "bg-primary-600 text-white border-2 border-primary-600 shadow-md hover:bg-primary-700 dark:bg-primary-500 dark:border-primary-500 dark:hover:bg-primary-600 focus-visible:ring-primary-500",
        navInactive:
          "bg-white text-primary-700 border-2 border-primary-300 hover:bg-primary-50 hover:border-primary-500 dark:bg-gray-800 dark:text-primary-400 dark:border-primary-600 dark:hover:bg-primary-900/20 dark:hover:border-primary-500 focus-visible:ring-primary-500 shadow-sm",

        // Round pill variants (for RoundSelector)
        pillActive:
          "bg-primary-600 text-white font-bold shadow-md ring-2 ring-primary-400 border border-primary-600 z-10 dark:bg-primary-500 dark:ring-primary-300 dark:border-primary-500 focus-visible:ring-primary-500",
        pillInactive:
          "bg-white text-gray-700 border border-gray-200 hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 dark:hover:border-primary-600 focus-visible:ring-primary-500",

        // Carousel navigation arrows
        carouselArrow:
          "p-2 rounded-full border border-gray-300 bg-white text-gray-500 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-primary-900/20 dark:hover:text-primary-400 focus-visible:ring-primary-500",

        // List item variants (for categorized lists)
        listItem:
          "w-full justify-start text-left rounded-none border-l-4 border-l-transparent hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-l-primary-600 dark:hover:border-l-primary-600 focus-visible:ring-inset focus-visible:ring-primary-500 active:scale-100",

        // Category header variant (for expandable sections)
        categoryHeader:
          "w-full justify-start gap-2 text-left rounded hover:bg-transparent dark:hover:bg-transparent focus-visible:ring-primary-500 active:scale-100",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
        // Custom size for pills
        pill: "px-4 py-2 text-base",
        // Auto height for list items and category headers
        auto: "h-auto",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

/**
 * Standard Button component
 * Use this for all buttons in the app to maintain consistency
 *
 * @example
 * <Button variant="primary" size="lg">Click me</Button>
 * <Button variant="male">Male Team</Button>
 * <Button variant="navActive">Active Nav</Button>
 * <Button variant="pillActive" size="pill">Round 1</Button>
 * <Button variant="carouselArrow" size="icon"><ChevronLeftIcon /></Button>
 * <Button variant="listItem" size="auto">List Item</Button>
 * <Button variant="categoryHeader" size="auto">Category Header</Button>
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, isLoading, children, disabled, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
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
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
