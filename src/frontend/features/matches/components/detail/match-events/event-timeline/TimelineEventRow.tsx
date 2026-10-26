// src/frontend/features/matches/components/detail/match-events/event-timeline/TimelineEventRow.tsx
import { useTranslations } from "next-intl";

import type { EventStyle, MatchTeam } from "@/features/matches/types";
import {
  describeEvent,
  tokenizeEventDescription,
} from "@/features/matches/utils";
import { TextLink } from "@/shared/components/primitives";
import { EventCategory } from "@/shared/constants";
import { cn } from "@/shared/utils";

import { periodClock, type ScoredMatchEvent } from "../matchEventsView";
import { EventScore } from "./EventScore";

const STRIPE = {
  home: "bg-solid-home",
  away: "bg-solid-away",
} as const;

interface TimelineEventRowProps {
  readonly event: ScoredMatchEvent;
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
  /** Resolved display config for this event's type. */
  readonly style: EventStyle;
  /** Match tip-off, from which the event's game clock is derived. */
  readonly matchDate: Date | string;
}

/**
 * One event of the play-by-play, as a list item: clock, team stripe, icon,
 * label and sentence, and the score when the event scored.
 *
 * The stripe's colour is the only visual sign of the team, so the team's name
 * is also written out for screen readers. An event with no team (none in a
 * qualifying role) gets a neutral stripe and no name. The icon is dropped
 * below `sm`, where the sentence needs the width.
 */
export function TimelineEventRow({
  event,
  homeTeam,
  awayTeam,
  style,
  matchDate,
}: TimelineEventRowProps) {
  const tMatches = useTranslations("matches");
  const Icon = style.icon;

  let side: "home" | "away" | undefined;
  if (event.teamId === homeTeam.id) side = "home";
  else if (event.teamId === awayTeam.id) side = "away";
  const team = side === "home" ? homeTeam : awayTeam;

  const description = describeEvent(event);
  const descriptionTokens = description
    ? tokenizeEventDescription(
        tMatches(
          `matchEvents.descriptions.${description.key}`,
          description.values,
        ),
        event.players,
      )
    : [];

  return (
    <li className="grid grid-cols-[2.75rem_3px_minmax(0,1fr)_auto] sm:grid-cols-[3rem_3px_1.25rem_minmax(0,1fr)_auto] gap-x-3 items-start px-3 sm:px-4 py-2.5 border-b border-divide/60 last:border-b-0">
      <span className="font-mono text-xs text-text-secondary tabular-nums pt-0.5">
        {periodClock(event.occurredAt, matchDate, event.period)}
      </span>

      <span
        aria-hidden="true"
        className={cn(
          "self-stretch rounded-full",
          side ? STRIPE[side] : "bg-divide",
        )}
      />

      <Icon
        aria-hidden="true"
        className={cn("hidden sm:block size-5 shrink-0", style.color)}
      />

      <div className="min-w-0">
        {side && <span className="sr-only">{team.name}</span>}
        <p className={cn("font-semibold text-sm", style.color)}>
          {style.labelKey ? tMatches(style.labelKey) : event.eventType}
        </p>
        {/* The player names are real anchors rendered by React, not an HTML
            string handed to dangerouslySetInnerHTML, so nothing here depends
            on the description being tag-free. */}
        {descriptionTokens.length > 0 && (
          <p className="text-sm text-text-body break-words">
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
      </div>

      {style.eventCategory === EventCategory.MADE && side ? (
        <EventScore
          homeScore={event.homeScore}
          awayScore={event.awayScore}
          scoredBy={side}
        />
      ) : (
        <span />
      )}
    </li>
  );
}

export default TimelineEventRow;
