// src/frontend/shared/components/domain/ListEntityCard.tsx
import type { ReactNode } from "react";

import { Card } from "@/shared/components/primitives";
import type { CompetitionLevel } from "@/shared/constants";
import { LEVEL_CONFIG } from "@/shared/constants";
import { cn } from "@/shared/utils";

/**
 * Grid wrapper for lists of `ListEntityCard`s.
 *
 * The second column arrives at `xl`, later than the `md` used by the compact
 * card grids (championships, clubs, leagues, committees). That is deliberate,
 * not an oversight: this card carries a wrapping badge cluster and a stats row,
 * so below ~590px it reflows rather than truncates. Measured at 768px forced to
 * two columns, a match card grows from 177px tall to 351px — same rows on
 * screen, each one worse. The compact cards stay at 101–129px throughout and
 * are fine from `md`.
 */
export const LIST_ENTITY_CARD_GRID = "grid grid-cols-1 xl:grid-cols-2 gap-4";

/** The LEVEL_CONFIG entry for a competition level, or the default. */
export function getLevelConfig(level: CompetitionLevel | undefined) {
  return (level && LEVEL_CONFIG[level]) || LEVEL_CONFIG.default;
}

interface ListEntityCardProps {
  readonly href: string;
  readonly ariaLabel: string;
  /** Competition level, used for the level-tinted card chrome. */
  readonly level: CompetitionLevel | undefined;
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
    <Card
      href={href}
      aria-label={ariaLabel}
      padding="none"
      className={cn(
        "group relative overflow-hidden",
        config.border,
        config.hover,
      )}
    >
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
    </Card>
  );
}

export default ListEntityCard;
