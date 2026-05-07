// src/frontend/shared/components/primitives/Card.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

import { Text } from "../typography";

/**
 * Card variants
 */
const cardVariants = cva("rounded-card border transition-all duration-200", {
  variants: {
    variant: {
      default: "surface-subtle border-divide shadow-card",
      highlighted: "surface-subtle border-primary border-2 shadow-card-hover",
      ghost: "bg-transparent border-transparent",
      // Empty — allows full custom styling via className
      custom: "",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
    clickable: {
      true: "hover:shadow-card-hover cursor-pointer active:scale-[0.98]",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
    clickable: false,
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof cardVariants> {}

/**
 * Card — the surface-subtle container layer.
 *
 * Elevation convention (must be respected):
 *   page (surface-base) → Card (surface-subtle) → InfoBox/Input (surface-raised)
 *
 * When `clickable` is true, renders as a <button> for correct keyboard and
 * screen-reader behaviour. Never attach onClick to a plain <div>.
 *
 * @example
 * <Card variant="highlighted" padding="lg">…</Card>
 * <Card clickable onClick={() => navigate('/detail')}>…</Card>
 */
export const Card = forwardRef<HTMLElement, CardProps>(
  ({ className, variant, padding, clickable, onClick, ...props }, ref) => {
    if (clickable) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className={cn(
            cardVariants({ variant, padding, clickable, className }),
          )}
          onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
          {...(props as HTMLAttributes<HTMLButtonElement>)}
        />
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(cardVariants({ variant, padding, clickable, className }))}
        {...(props as HTMLAttributes<HTMLDivElement>)}
      />
    );
  },
);

Card.displayName = "Card";

// ---------------------------------------------------------------------------
// Card sub-components
// ---------------------------------------------------------------------------

export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 pb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * CardTitle — uses Text variant="h3" so font tokens stay in one place.
 *
 * Renders as <h3> by default. Override with `as` when the heading level
 * needs to differ from the visual style (e.g. as="h2" for a top-level card).
 * Never skip heading levels — h1 → h2 → h3, never h1 → h3.
 */
export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement> & { as?: React.ElementType }
>(({ className, as = "h3", ...props }, ref) => (
  <Text
    ref={ref as React.Ref<HTMLElement>}
    variant="h3"
    as={as}
    className={className}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * CardDescription — uses Text variant="caption".
 *
 * Renders as <p>. caption gives text-secondary color and text-sm size,
 * matching the visual role of supporting description text under a title.
 */
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <Text
    ref={ref as React.Ref<HTMLElement>}
    variant="caption"
    as="p"
    className={className}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 border-t border-divide", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
