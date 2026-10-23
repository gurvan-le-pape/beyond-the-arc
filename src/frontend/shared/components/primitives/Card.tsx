// src/frontend/shared/components/primitives/Card.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes, type ReactNode } from "react";

import { Link } from "@/navigation";
import { cn } from "@/shared/utils";

import { Text } from "../typography";

/**
 * Card variants
 */
const cardVariants = cva(
  "rounded-card border transition-all duration-200 focus-ring",
  {
    variants: {
      variant: {
        default: "surface-subtle border-divide shadow-card",
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
      // A card that goes or does something lifts on hover. `motion-safe`: no
      // movement for a reader who asked the system for less.
      clickable: {
        true: "hover:shadow-card-hover motion-safe:hover:-translate-y-0.5 cursor-pointer",
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
  /**
   * A website outside the app: a plain anchor opening in a new tab, instead of
   * the locale-aware router link. A `mailto:` or `tel:` address is a plain
   * anchor without this, opening in place.
   */
  readonly external?: boolean;
  /** A file to save rather than a page to open: a plain anchor with `download`. */
  readonly download?: boolean;
  readonly clickable?: never;
  readonly onClick?: never;
  readonly heading?: never;
}

/** A card that runs an action in place. */
interface CardActionProps {
  readonly href?: undefined;
  readonly external?: never;
  readonly download?: never;
  readonly clickable: true;
  readonly heading?: never;
}

/** A card that does nothing: a block of content, optionally headed. */
interface CardStaticProps {
  readonly href?: undefined;
  readonly external?: never;
  readonly download?: never;
  readonly clickable?: false;
  /**
   * The card's title, drawn as an `h2` above the content. Every headed card
   * takes its heading from here, so they share one look.
   */
  readonly heading?: ReactNode;
}

export type CardProps = CardBaseProps &
  (CardLinkProps | CardActionProps | CardStaticProps);

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
 * <Card padding="lg">…</Card>
 * <Card padding="lg" heading={t("title")}>…</Card>
 * <Card href={`/players/${id}`}>…</Card>
 * <Card clickable onClick={() => setExpanded(true)}>…</Card>
 */
export const Card = ({
  className,
  variant,
  padding,
  clickable,
  href,
  external,
  download,
  ref,
  heading,
  children,
  ...props
}: CardProps) => {
  // A plain anchor for anything the router does not handle: another site, a
  // file to save, or a `mailto:` / `tel:` address.
  if (href !== undefined && (external || download || !href.startsWith("/"))) {
    return (
      <a
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        download={download || undefined}
        className={cn(
          "block",
          cardVariants({ variant, padding, clickable: true, className }),
        )}
        {...(props as HTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

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
      >
        {children}
      </Link>
    );
  }

  if (clickable) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={cn(cardVariants({ variant, padding, clickable, className }))}
        {...(props as HTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(cardVariants({ variant, padding, clickable, className }))}
      {...(props as HTMLAttributes<HTMLDivElement>)}
    >
      {heading && (
        <Text variant="h2" className="mb-6 text-center text-xl">
          {heading}
        </Text>
      )}
      {children}
    </div>
  );
};
