// src/frontend/features/matches/components/detail/match-events/timeline/TimelineRow.tsx
import React from "react";

import { cn } from "@/shared/utils";

/**
 * The timeline's column track: home side | 80px centre gutter | away side.
 * Declared once here because the team legend and every event row must stay on
 * the same grid — repeated at each call site, one copy can drift and silently
 * misalign the centre score pills.
 */
const TIMELINE_GRID = "grid grid-cols-[1fr_80px_1fr] gap-4";

interface TimelineRowProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Element to render. The event rows are `li` (they sit in the timeline's
   * `ul`); the team legend is a plain `div` because it is not a list entry.
   */
  readonly as?: "div" | "li";
}

/**
 * One row on the match-events timeline, laid out on the shared column track.
 *
 * Semantics are left to the caller — the legend and the event rows mean
 * different things (see MatchEventsTimeline).
 */
export function TimelineRow({
  as: Component = "div",
  className,
  children,
  ...props
}: Readonly<TimelineRowProps>) {
  return (
    <Component className={cn(TIMELINE_GRID, className)} {...props}>
      {children}
    </Component>
  );
}

export default TimelineRow;
