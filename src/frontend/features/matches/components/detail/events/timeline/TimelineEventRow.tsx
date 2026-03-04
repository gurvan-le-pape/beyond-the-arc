// src/frontend/features/matches/components/detail/events/timeline/TimelineEventRow.tsx
import React from "react";

import type { EventStyle } from "@/features/matches/types/EventStyle";
import type { MatchEvent } from "@/features/matches/types/MatchEvent";
import type { ClubTeamInfo } from "@/features/organizations/clubs/types/ClubDetailed";
import { EventCategory } from "@/shared/constants/event-categories";

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
  const isScoring = style.eventCategory === EventCategory.SCORING;
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
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {event.homeScore} - {event.awayScore}
            </div>
          ) : (
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
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
