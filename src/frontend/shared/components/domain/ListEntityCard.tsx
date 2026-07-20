// src/frontend/shared/components/domain/ListEntityCard.tsx
import type { ReactNode } from "react";

import { Link } from "@/navigation";
import { LEVEL_CONFIG } from "@/shared/constants";
import { cn } from "@/shared/utils";

/** The LEVEL_CONFIG entry for a (lowercased) competition level, or default. */
export function getLevelConfig(level: string) {
  return (
    LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] ?? LEVEL_CONFIG.default
  );
}

interface ListEntityCardProps {
  readonly href: string;
  readonly ariaLabel: string;
  /** Lowercased competition level, used for the level-tinted card chrome. */
  readonly level: string;
  /** Header content after the status dot (title / date). */
  readonly headerLeft: ReactNode;
  /** Right-aligned badge cluster (see EntityCardBadges). */
  readonly badges: ReactNode;
  /** Card body. */
  readonly children: ReactNode;
}

/**
 * Shared shell for the teams / players / matches list cards: a level-tinted
 * linked card with a header (status dot + left content + badge cluster) over an
 * arbitrary body.
 */
export function ListEntityCard({
  href,
  ariaLabel,
  level,
  headerLeft,
  badges,
  children,
}: ListEntityCardProps) {
  const config = getLevelConfig(level);

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "group relative overflow-hidden rounded-card border",
        "surface-raised shadow-card",
        "transition-all duration-200",
        "hover:-translate-y-0.5 hover:scale-[1.01]",
        "hover:shadow-card-hover",
        "focus:outline-none focus:ring-2 focus:ring-primary",
        "focus:ring-offset-2 focus:ring-offset-surface",
        config.border,
        config.hover,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between gap-3 flex-wrap",
          "px-5 py-3",
          "border-b border-white/5",
          config.bg,
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-text-heading" />
          {headerLeft}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">{badges}</div>
      </div>

      {children}
    </Link>
  );
}

export default ListEntityCard;
