// src/frontend/features/matches/components/detail/match-events/timeline/MatchEventsTimeline.tsx
"use client";

import { useTranslations } from "next-intl";

import type { EventStyle, EventWithScore } from "@/features/matches/types";
import {
  describeEvent,
  tokenizeEventDescription,
} from "@/features/matches/utils";
import type { TeamInfo } from "@/features/teams/types";
import { EventCategory } from "@/shared/constants";

import { EventScorePill } from "./EventScorePill";
import { TimelineEventBlock } from "./TimelineEventBlock";
import { TimelineRow } from "./TimelineRow";
import { TimelineTeamHeader } from "./TimelineTeamHeader";

interface MatchEventsTimelineProps {
  readonly events: EventWithScore[];
  readonly homeTeam: TeamInfo;
  readonly awayTeam: TeamInfo;
  readonly getEventStyle: (eventType: string) => EventStyle;
  readonly matchDate: Date | string;
}

/**
 * Match events timeline.
 * Renders events along a centred vertical line – home team on the left,
 * away team on the right.  Scoring events show a running-score pill in the
 * centre column; non-scoring events show a small dot.
 */
export function MatchEventsTimeline({
  events,
  homeTeam,
  awayTeam,
  getEventStyle,
  matchDate,
}: MatchEventsTimelineProps) {
  const tMatches = useTranslations("matches");

  return (
    <div>
      <TimelineTeamHeader homeTeam={homeTeam} awayTeam={awayTeam} />

      <div className="relative">
        {/* Centre vertical rule – purely decorative */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-divide transform -translate-x-1/2"
        />

        {/*
          A list rather than a table: every event belongs to exactly one team,
          so a three-column table would announce a blank cell on every single
          row. The `ul` is the direct parent of the `li` rows, so nothing
          breaks the list relationship.
        */}
        <ul
          aria-label={tMatches("matchEvents.timelineLabel")}
          className="space-y-3"
        >
          {events.map((event) => {
            const style = getEventStyle(event.eventType);
            const isHomeTeam = event.teamId === homeTeam.id;
            const isAwayTeam = event.teamId === awayTeam.id;
            const isScoring = style.eventCategory === EventCategory.MADE;

            const eventKey = `${event.id}`;

            // Pre-computed here rather than in the block because only one of
            // the two branches below renders, and the tokens are the same
            // either way.
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

            let eventTeamName: string | null = null;
            if (isHomeTeam) {
              eventTeamName = homeTeam.name;
            } else if (isAwayTeam) {
              eventTeamName = awayTeam.name;
            }

            return (
              <TimelineRow as="li" key={eventKey} className="items-center">
                {/*
                  Left/right placement is what conveys the team visually, and
                  that is invisible to a screen reader. Naming the team here
                  makes each item self-contained. `sr-only` is absolutely
                  positioned, so this span never becomes a grid item.
                */}
                {eventTeamName && (
                  <span className="sr-only">{eventTeamName}</span>
                )}

                {/* Left column – home team event or spacer */}
                {isHomeTeam ? (
                  <TimelineEventBlock
                    align="right"
                    style={style}
                    event={event}
                    descriptionTokens={descriptionTokens}
                    matchDate={matchDate}
                  />
                ) : (
                  <div />
                )}

                {/* Centre column – score pill or dot */}
                <div className="flex items-center justify-center">
                  {isScoring ? (
                    <EventScorePill
                      homeScore={event.homeScore}
                      awayScore={event.awayScore}
                      isHomeTeam={isHomeTeam}
                    />
                  ) : (
                    <div className="w-2 h-2 rounded-button bg-divide" />
                  )}
                </div>

                {/* Right column – away team event or spacer */}
                {isAwayTeam ? (
                  <TimelineEventBlock
                    align="left"
                    style={style}
                    event={event}
                    descriptionTokens={descriptionTokens}
                    matchDate={matchDate}
                  />
                ) : (
                  <div />
                )}
              </TimelineRow>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default MatchEventsTimeline;
