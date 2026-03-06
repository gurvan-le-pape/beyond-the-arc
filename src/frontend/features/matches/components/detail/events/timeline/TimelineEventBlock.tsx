// src/frontend/features/matches/components/detail/events/timeline/TimelineEventBlock.tsx
import { useTranslations } from "next-intl";
import React from "react";

import type { EventStyle } from "@/features/matches/types/EventStyle";
import type { EventWithScore } from "@/features/matches/types/EventWithScore";
import { cn } from "@/shared/utils/cn";

interface TimelineEventBlockProps {
  /** Which side of the timeline this block sits on. */
  align: "left" | "right";
  /** Resolved display config for this event's type. */
  style: EventStyle;
  /** The enriched event (includes description, timestamp, etc.). */
  event: EventWithScore;
  /** Pre-rendered HTML string – player names already wrapped in clickable spans. */
  descriptionHtml: string;
  /** Bubbled click handler; the parent uses it to navigate on player-link clicks. */
  onDescriptionClick: (e: React.MouseEvent<HTMLParagraphElement>) => void;
}

/**
 * Renders the icon, event-type label, optional clickable description,
 * and timestamp for a single event on one side of the timeline.
 *
 * Defined at module scope (not inside another component) so that React can
 * reconcile instances across re-renders instead of remounting every time.
 */
export function TimelineEventBlock({
  align,
  style,
  event,
  descriptionHtml,
  onDescriptionClick,
}: TimelineEventBlockProps) {
  const tMatches = useTranslations("matches");
  const isRight = align === "right";

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        isRight ? "justify-end pr-4" : "pl-4",
      )}
    >
      <div className={cn("flex-1", isRight ? "text-right" : "text-left")}>
        {/* Icon + label row – icon order flips depending on alignment */}
        <div
          className={cn("flex items-center gap-2", isRight && "justify-end")}
        >
          {isRight ? (
            <>
              <span className={cn("font-semibold text-body-sm", style.color)}>
                {style.labelKey ? tMatches(style.labelKey) : event.eventType}
              </span>
              <span className="text-2xl">{style.icon}</span>
            </>
          ) : (
            <>
              <span className="text-2xl">{style.icon}</span>
              <span className={cn("font-semibold text-body-sm", style.color)}>
                {style.labelKey ? tMatches(style.labelKey) : event.eventType}
              </span>
            </>
          )}
        </div>

        {/* Description (may contain clickable player links via dangerouslySetInnerHTML) */}
        {event.description && (
          <div
            role="none"
            onClick={onDescriptionClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onDescriptionClick(
                  e as unknown as React.MouseEvent<HTMLParagraphElement>,
                );
              }
            }}
          >
            <p
              className={cn(
                "text-caption text-gray-600 dark:text-gray-400 mt-0.5",
                isRight ? "text-right" : "text-left",
              )}
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </div>
        )}

        {/* Timestamp */}
        <span className="text-caption text-gray-400 dark:text-gray-500 font-mono">
          {new Date(event.timestamp).toLocaleTimeString("fr-FR", {
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

export default TimelineEventBlock;
