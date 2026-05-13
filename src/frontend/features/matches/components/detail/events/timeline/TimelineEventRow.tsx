// src/frontend/features/matches/components/detail/events/timeline/TimelineEventRow.tsx
import React from "react";

import type { EventStyle } from "@/features/matches/types";
import type { MatchEvent } from "@/features/matches/types";
import type { ClubTeamInfo } from "@/features/organizations/clubs/types";
import { EventCategory } from "@/shared/constants";

import TeamEventBlock from "./TeamEventBlock";

interface TimelineEventRowProps {
  event: MatchEvent & { homeScore: number; awayScore: number; teamId?: number };
  homeTeam: ClubTeamInfo;
  awayTeam: ClubTeamInfo;
  getEventStyle: (eventType: string) => EventStyle;
  makeDescriptionClickable: (
    description: string,
    eventPlayers?: MatchEvent["players"],
  ) => string;
  handleDescriptionClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  router: any;
}

export const TimelineEventRow: React.FC<TimelineEventRowProps> = ({
  event,
  homeTeam,
  awayTeam,
  getEventStyle,
  makeDescriptionClickable,
  handleDescriptionClick,
  router,
}) => {
  const style = getEventStyle(event.eventType);
  const teamId = event.teamId;
  const isHomeTeam = teamId === homeTeam.id;
  const isAwayTeam = teamId === awayTeam.id;
  const isScoring = style.eventCategory === EventCategory.MADE;
  const eventKey = `${event.id}`;

  return (
    <div key={eventKey}>
      <div className="grid grid-cols-[1fr_80px_1fr] gap-4 items-center">
        {/* Home Team Event (Left) */}
        {isHomeTeam ? (
          <TeamEventBlock
            align="right"
            style={style}
            event={event}
            router={router}
            makeDescriptionClickable={makeDescriptionClickable}
            handleDescriptionClick={handleDescriptionClick}
            showKeyHandler={true}
          />
        ) : (
          <div></div>
        )}

        {/* Center Score */}
        <div className="flex items-center justify-center">
          {isScoring ? (
            <div
              className={`px-3 py-1 rounded-full text-sm font-bold ${
                isHomeTeam
                  ? "bg-primary-subtle text-primary-strong"
                  : "bg-error-subtle text-error-strong"
              }`}
            >
              {event.homeScore} - {event.awayScore}
            </div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-divide"></div>
          )}
        </div>

        {/* Away Team Event (Right) */}
        {isAwayTeam ? (
          <TeamEventBlock
            align="left"
            style={style}
            event={event}
            router={router}
            makeDescriptionClickable={makeDescriptionClickable}
            handleDescriptionClick={handleDescriptionClick}
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default TimelineEventRow;
