// src/frontend/shared/components/ui/primitives/Card.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

/**
 * Card variants
 */
const cardVariants = cva("rounded-card border transition-all duration-200", {
  variants: {
    variant: {
      default:
        "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-card dark:shadow-card-dark",
      highlighted:
        "bg-white dark:bg-gray-800 border-primary-500 dark:border-primary-400 border-2 shadow-card-hover dark:shadow-card-dark",
      ghost: "bg-transparent border-transparent",
      custom: "", // Empty - allows full custom styling via className
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
 * Card component for consistent card styling
 *
 * @example
 * <Card variant="highlighted" padding="lg">
 *   <h3>Title</h3>
 *   <p>Content</p>
 * </Card>
 *
 * @example
 * <Card clickable onClick={() => console.log('clicked')}>
 *   Clickable card
 * </Card>
 *
 * @example
 * <Card variant="custom" className="bg-gradient-to-br from-success-light/20 to-success-light/10">
 *   Custom background card
 * </Card>
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

/**
 * Card Header component
 */
export const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2 pb-4", className)}
      {...props}
    />
  );
});

CardHeader.displayName = "CardHeader";

/**
 * Card Title component
 */
export const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        "text-body-lg font-bold text-gray-900 dark:text-gray-100",
        className,
      )}
      {...props}
    >
      {props.children}
    </h3>
  );
});

CardTitle.displayName = "CardTitle";

/**
 * Card Description component
 */
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-body-sm text-gray-600 dark:text-gray-400", className)}
      {...props}
    />
  );
});

CardDescription.displayName = "CardDescription";

/**
 * Card Content component
 */
export const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});

CardContent.displayName = "CardContent";

/**
 * Card Footer component
 */
export const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center pt-4 border-t border-gray-200 dark:border-gray-700",
        className,
      )}
      {...props}
    />
  );
});

CardFooter.displayName = "CardFooter";
