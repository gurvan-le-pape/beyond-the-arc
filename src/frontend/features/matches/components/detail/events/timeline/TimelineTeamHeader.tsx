// src/frontend/features/matches/components/detail/events/timeline/TimelineTeamHeader.tsx
import React from "react";

import type { TeamInfo } from "@/features/teams/types/TeamInfo";

import { TimelineTeamLogo } from "./TimelineTeamLogo";

interface TimelineTeamHeaderProps {
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
}

/**
 * Two-column header row displayed above the event timeline.
 * Home team (logo + name) on the left, away team (name + logo) on the right,
 * separated by a bottom border.
 */
export function TimelineTeamHeader({
  homeTeam,
  awayTeam,
}: TimelineTeamHeaderProps) {
  return (
    <div className="grid grid-cols-[1fr_80px_1fr] gap-4 mb-4 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
      {/* Home (left) */}
      <div className="flex items-center gap-2">
        <TimelineTeamLogo teamName={homeTeam.name} />
        <span className="font-bold text-body text-gray-800 dark:text-gray-200">
          {homeTeam.name}
        </span>
      </div>

      {/* Centre spacer (matches the 80px score-pill column) */}
      <div />

      {/* Away (right) */}
      <div className="flex items-center gap-2 justify-end">
        <span className="font-bold text-body text-gray-800 dark:text-gray-200">
          {awayTeam.name}
        </span>
        <TimelineTeamLogo teamName={awayTeam.name} />
      </div>
    </div>
  );
}

export default TimelineTeamHeader;
