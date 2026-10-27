// src/frontend/features/matches/components/detail/match-events/event-timeline/TimelineEventRow.tsx
import { useTranslations } from "next-intl";

import type { EventStyle, MatchTeam } from "@/features/matches/types";
import { TextLink } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

import { formatClock, type Play, playRowId } from "../matchEventsView";
import { EventScore } from "./EventScore";
import { usePlayDescription } from "./usePlayDescription";

const STRIPE = {
  home: "bg-solid-home",
  away: "bg-solid-away",
} as const;

interface TimelineEventRowProps {
  readonly play: Play;
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
  /** Resolved display config for the play's lead event. */
  readonly style: EventStyle;
  /** The reader just jumped to this play: it is tinted for a moment. */
  readonly highlighted: boolean;
}

/**
 * One play of the play-by-play, as a list item: clock, team stripe, icon,
 * label and sentence, and the score when the play scored.
 *
 * The stripe's colour is the only visual sign of the team, so the team's name
 * is also written out for screen readers. A play with no team (no player in a
 * qualifying role) gets a neutral stripe and no name. The icon is dropped
 * below `sm`, where the sentence needs the width.
 *
 * The row carries an id and takes focus from script only (`tabIndex={-1}`),
 * so a jump from the flow chart can land on it.
 */
export function TimelineEventRow({
  play,
  homeTeam,
  awayTeam,
  style,
  highlighted,
}: TimelineEventRowProps) {
  const tMatches = useTranslations("matches");
  const { label, freeThrows, tokens } = usePlayDescription(play, style);
  const Icon = style.icon;

  const sideOf = (teamId: number | undefined) => {
    if (teamId === homeTeam.id) return "home";
    if (teamId === awayTeam.id) return "away";
    return undefined;
  };
  const side = sideOf(play.teamId);
  const scoredBy = sideOf(play.scoringTeamId);

  return (
    <li
      id={playRowId(play.lead.id)}
      tabIndex={-1}
      className={cn(
        "grid grid-cols-[2.75rem_3px_minmax(0,1fr)_auto] sm:grid-cols-[3rem_3px_1.25rem_minmax(0,1fr)_auto] gap-x-3 items-start px-3 sm:px-4 py-2.5 border-b border-divide/60 last:border-b-0 outline-none transition-colors duration-700",
        highlighted && "bg-tint-primary",
      )}
    >
      <span className="font-mono text-xs text-text-secondary tabular-nums pt-0.5">
        {formatClock(play.lead.secondsLeft)}
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
        {side && (
          <span className="sr-only">
            {side === "home" ? homeTeam.name : awayTeam.name}
          </span>
        )}
        <p className={cn("font-semibold text-sm", style.color)}>
          {label}
          {freeThrows && (
            <span className="ml-2 px-1.5 rounded-input bg-surface-inset font-mono font-medium text-xs text-text-emphasis">
              {tMatches("matchEvents.freeThrowsShort", freeThrows)}
            </span>
          )}
        </p>
        {/* The player names are real anchors rendered by React, not an HTML
            string handed to dangerouslySetInnerHTML, so nothing here depends
            on the description being tag-free. */}
        {tokens.length > 0 && (
          <p className="text-sm text-text-body break-words">
            {tokens.map((token, index) =>
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

      {scoredBy ? (
        <EventScore
          homeScore={play.homeScore}
          awayScore={play.awayScore}
          scoredBy={scoredBy}
          swing={play.swing}
        />
      ) : (
        <span />
      )}
    </li>
  );
}

export default TimelineEventRow;
