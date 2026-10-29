// src/frontend/shared/components/primitives/TextLink.tsx
import type { ReactNode } from "react";

import { Link } from "@/navigation";
import { cn } from "@/shared/utils";

const VARIANT_CLASSES = {
  accent: "text-ink-primary hover:underline",
  plain: "hover:text-ink-primary hover:underline",
} as const;

interface TextLinkProps {
  readonly href: string;
  readonly children: ReactNode;
  /**
   * `accent` stands out in the brand colour, for a link the reader is meant to
   * notice (a breadcrumb, a player named in running text). `plain` keeps the
   * surrounding text colour and only reacts on hover, for a name that is
   * already the subject of its line.
   */
  readonly variant?: "accent" | "plain";
  /**
   * An address outside the app (a website, `mailto:`, `tel:`): rendered as a
   * plain anchor, opening in a new tab, instead of the locale-aware router
   * link.
   */
  readonly external?: boolean;
  readonly ariaLabel?: string;
}

/**
 * A link inside text. It sets colour, underline and focus only: size, weight
 * and layout come from the element around it, so it reads as part of that text.
 */
export function TextLink({
  href,
  children,
  variant = "accent",
  external = false,
  ariaLabel,
}: TextLinkProps) {
  const className = cn(
    "relative rounded-sm underline-offset-2 transition-colors duration-200 focus-ring",
    // The hit area reaches 4px above and below the text, without moving it:
    // a 17px line becomes a 25px target, past WCAG's 24px for a link that
    // stands on its own ("Résumé" on a match card).
    "after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']",
    VARIANT_CLASSES[variant],
  );

  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export default TextLink;
