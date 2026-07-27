// src/frontend/features/matches/components/detail/match-events/timeline/TimelineRow.tsx
import React from "react";

import { cn } from "@/shared/utils";

/**
 * The timeline's column track: home side | 80px centre gutter | away side.
 * Declared once here because the team legend and every event row must stay on
 * the same grid — previously this string was repeated at each call site and
 * drifting it in one place silently misaligned the centre score pills.
 */
const TIMELINE_GRID = "grid grid-cols-[1fr_80px_1fr] gap-4";

type TimelineRowProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * One row on the match-events timeline, laid out on the shared column track.
 *
 * Carries no ARIA role of its own — callers supply it, because the legend and
 * the event rows mean different things (see MatchEventsTimeline).
 */
export function TimelineRow({
  className,
  children,
  ...props
}: TimelineRowProps) {
  return (
    <div className={cn(TIMELINE_GRID, className)} {...props}>
      {children}
    </div>
  );
}

export default TimelineRow;
