// src/frontend/features/matches/components/detail/events/timeline/MatchEventsTimeline.tsx
"use client";

import React from "react";

import type { EventStyle } from "@/features/matches/types/EventStyle";
import type { EventWithScore } from "@/features/matches/types/EventWithScore";
import type { MatchEvent } from "@/features/matches/types/MatchEvent";
import type { TeamInfo } from "@/features/teams/types/TeamInfo";
import { useRouter } from "@/navigation";
import { EventCategory } from "@/shared/constants/event-categories";

import { EventScorePill } from "./EventScorePill";
import { TimelineEventBlock } from "./TimelineEventBlock";
import { TimelineTeamHeader } from "./TimelineTeamHeader";

interface MatchEventsTimelineProps {
  events: EventWithScore[];
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  getEventStyle: (eventType: string) => EventStyle;
  makeDescriptionClickable: (
    description: string,
    eventPlayers?: MatchEvent["players"],
  ) => string;
}

/**
 * Match events timeline.
 * Renders events along a centred vertical line – home team on the left,
 * away team on the right.  Scoring events show a running-score pill in the
 * centre column; non-scoring events show a small dot.
 */
export const MatchEventsTimeline: React.FC<MatchEventsTimelineProps> = ({
  events,
  homeTeam,
  awayTeam,
  getEventStyle,
  makeDescriptionClickable,
}) => {
  const router = useRouter();

  /** Navigates to a player page when a `.match-player-link` span is clicked. */
  const handleDescriptionClick = (
    e: React.MouseEvent<HTMLParagraphElement>,
  ) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("match-player-link")) {
      const playerId = target.dataset.playerId;
      if (playerId) void router.push(`/players/${playerId}`);
    }
  };

  return (
    <div>
      <TimelineTeamHeader homeTeam={homeTeam} awayTeam={awayTeam} />

      <div className="relative">
        {/* Centre vertical rule */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600 transform -translate-x-1/2" />

        <div className="space-y-3">
          {events.map((event) => {
            const style = getEventStyle(event.eventType);
            const isHomeTeam = event.teamId === homeTeam.id;
            const isAwayTeam = event.teamId === awayTeam.id;
            const isScoring = style.eventCategory === EventCategory.SCORING;

            const eventKey = `${event.id}`;

            // Pre-compute once; TeamEventBlock will use it via dangerouslySetInnerHTML.
            const descriptionHtml = event.description
              ? makeDescriptionClickable(event.description, event.players)
              : "";

            return (
              <div
                key={eventKey}
                className="grid grid-cols-[1fr_80px_1fr] gap-4 items-center"
              >
                {/* Left column – home team event or spacer */}
                {isHomeTeam ? (
                  <TimelineEventBlock
                    align="right"
                    style={style}
                    event={event}
                    descriptionHtml={descriptionHtml}
                    onDescriptionClick={handleDescriptionClick}
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
                    <div className="w-2 h-2 rounded-button bg-gray-300 dark:bg-gray-600" />
                  )}
                </div>

                {/* Right column – away team event or spacer */}
                {isAwayTeam ? (
                  <TimelineEventBlock
                    align="left"
                    style={style}
                    event={event}
                    descriptionHtml={descriptionHtml}
                    onDescriptionClick={handleDescriptionClick}
                  />
                ) : (
                  <div />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MatchEventsTimeline;
