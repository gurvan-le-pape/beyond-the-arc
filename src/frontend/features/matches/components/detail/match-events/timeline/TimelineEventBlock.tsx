// src/frontend/features/matches/components/detail/match-events/timeline/TimelineEventBlock.tsx
import { useTranslations } from "next-intl";

import type { EventStyle, EventWithScore } from "@/features/matches/types";
import type { EventDescriptionToken } from "@/features/matches/utils";
import { TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { cn } from "@/shared/utils";

interface TimelineEventBlockProps {
  /** Which side of the timeline this block sits on. */
  readonly align: "left" | "right";
  /** Resolved display config for this event's type. */
  readonly style: EventStyle;
  /** The enriched event (includes description, occurredAt, etc.). */
  readonly event: EventWithScore;
  /** The description split into runs, player names marked (see utils). */
  readonly descriptionTokens: readonly EventDescriptionToken[];
  /** Match kick-off time, used to derive the game-clock display. */
  readonly matchDate: Date | string;
}

function formatGameClock(
  occurredAt: Date | string,
  matchDate: Date | string,
): string {
  const elapsedSeconds = Math.floor(
    (new Date(occurredAt).getTime() - new Date(matchDate).getTime()) / 1000,
  );
  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/**
 * Renders the icon, event-type label, optional clickable description,
 * and game clock for a single event on one side of the timeline.
 *
 * Defined at module scope (not inside another component) so that React can
 * reconcile instances across re-renders instead of remounting every time.
 */
export function TimelineEventBlock({
  align,
  style,
  event,
  descriptionTokens,
  matchDate,
}: TimelineEventBlockProps) {
  const tMatches = useTranslations("matches");
  const isRight = align === "right";
  const Icon = style.icon;

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
              <span className={cn("font-semibold text-sm", style.color)}>
                {style.labelKey ? tMatches(style.labelKey) : event.eventType}
              </span>
              <Icon
                aria-hidden="true"
                className={cn("w-5 h-5 shrink-0", style.color)}
              />
            </>
          ) : (
            <>
              <Icon
                aria-hidden="true"
                className={cn("w-5 h-5 shrink-0", style.color)}
              />
              <span className={cn("font-semibold text-sm", style.color)}>
                {style.labelKey ? tMatches(style.labelKey) : event.eventType}
              </span>
            </>
          )}
        </div>

        {/* Description. The player names are real anchors rendered by React,
            not an HTML string handed to dangerouslySetInnerHTML, so nothing
            here depends on the description being tag-free. */}
        {event.description && (
          <p
            className={cn(
              "text-text-body mt-0.5",
              isRight ? "text-right" : "text-left",
            )}
          >
            {descriptionTokens.map((token, index) =>
              token.kind === "player" ? (
                <TextLink
                  // The tokens are positional runs of one string, so the index
                  // *is* the identity — there is no stabler key, and a token
                  // never moves without the whole description changing.
                  key={`${index}-${token.text}`}
                  href={`/players/${token.playerId}`}
                >
                  {token.text}
                </TextLink>
              ) : (
                token.text
              ),
            )}
          </p>
        )}

        <Text variant="caption" as="span" className="font-mono">
          {formatGameClock(event.occurredAt, matchDate)}
        </Text>
      </div>
    </div>
  );
}

export default TimelineEventBlock;
