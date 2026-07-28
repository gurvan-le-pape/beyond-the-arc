// src/frontend/features/matches/components/detail/match-events/timeline/TimelineEventBlock.tsx
import { useTranslations } from "next-intl";
import React from "react";

import type { EventStyle, EventWithScore } from "@/features/matches/types";
import { Text } from "@/shared/components/typography";
import { cn } from "@/shared/utils";

interface TimelineEventBlockProps {
  /** Which side of the timeline this block sits on. */
  readonly align: "left" | "right";
  /** Resolved display config for this event's type. */
  readonly style: EventStyle;
  /** The enriched event (includes description, timestamp, etc.). */
  readonly event: EventWithScore;
  /** Pre-rendered HTML string – player names already wrapped in clickable spans. */
  readonly descriptionHtml: string;
  /** Bubbled click handler; the parent uses it to navigate on player-link clicks. */
  readonly onDescriptionClick: (
    e: React.MouseEvent<HTMLParagraphElement>,
  ) => void;
  /** Match kick-off time, used to derive the game-clock display. */
  readonly matchDate: Date | string;
}

function formatGameClock(
  eventTimestamp: Date | string,
  matchDate: Date | string,
): string {
  const elapsedSeconds = Math.floor(
    (new Date(eventTimestamp).getTime() - new Date(matchDate).getTime()) / 1000,
  );
  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
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
  matchDate,
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
                "text-text-body mt-0.5",
                isRight ? "text-right" : "text-left",
              )}
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
          </div>
        )}

        {/* Game clock display */}
        <Text variant="caption" as="span" className="font-mono">
          {formatGameClock(event.timestamp, matchDate)}
        </Text>
      </div>
    </div>
  );
}

export default TimelineEventBlock;
