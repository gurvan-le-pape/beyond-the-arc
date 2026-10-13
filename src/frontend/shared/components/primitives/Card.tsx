// src/frontend/shared/components/primitives/Card.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";

import { Link } from "@/navigation";
import { cn } from "@/shared/utils";

/**
 * Card variants
 */
const cardVariants = cva(
  "rounded-card border transition-all duration-200 focus-ring",
  {
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
  },
);

interface CardBaseProps
  extends HTMLAttributes<HTMLElement>, VariantProps<typeof cardVariants> {
  ref?: React.Ref<HTMLElement>;
}

/** A card that navigates. Gets the clickable styling without asking for it. */
interface CardLinkProps {
  readonly href: string;
  readonly clickable?: never;
  readonly onClick?: never;
}

/** A card that either does nothing or runs an action in place. */
interface CardPlainProps {
  readonly href?: undefined;
  readonly clickable?: boolean;
}

export type CardProps = CardBaseProps & (CardLinkProps | CardPlainProps);

/**
 * Card — the surface-subtle container layer.
 *
 * Elevation convention (must be respected):
 *   page (surface-base) → Card (surface-subtle) → InfoBox/Input (surface-raised)
 *
 * A card that goes somewhere takes `href` and renders as a link. A card that
 * *does* something takes `clickable` and renders as a <button>. Never attach an
 * onClick to a plain <div>, and never use `clickable` for navigation: a button
 * has no href, so it gives no status-bar URL, no middle-click, no
 * open-in-new-tab and nothing for a crawler to follow. The props type keeps the
 * two apart.
 *
 * @example
 * <Card variant="highlighted" padding="lg">…</Card>
 * <Card href={`/players/${id}`}>…</Card>
 * <Card clickable onClick={() => setExpanded(true)}>…</Card>
 */
export const Card = ({
  className,
  variant,
  padding,
  clickable,
  href,
  ref,
  ...props
}: CardProps) => {
  if (href !== undefined) {
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        // `block` first, not last: an <a> is inline by default and padding on
        // an inline box does not lay out, but a consumer that sets its own
        // display (the roster card is `flex`) has to win — and with twMerge
        // the later class does.
        className={cn(
          "block",
          cardVariants({ variant, padding, clickable: true, className }),
        )}
        {...(props as HTMLAttributes<HTMLAnchorElement>)}
      />
    );
  }

  if (clickable) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={cn(cardVariants({ variant, padding, clickable, className }))}
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
};
