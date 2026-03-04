// src/frontend/features/matches/components/detail/events/timeline/TimelineTeamLogo.tsx
import React from "react";

import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

interface TimelineTeamLogoProps {
  teamName: string;
}

/**
 * Renders a team's logo image.
 * Falls back to a generic default logo if the image fails to load.
 */
export function TimelineTeamLogo({ teamName }: TimelineTeamLogoProps) {
  return (
    <img
      src={`/images/clubs/${formatNameToFileName(teamName)}.webp`}
      alt={teamName}
      className="w-8 h-8 object-contain"
      onError={(e) => {
        (e.target as HTMLImageElement).src =
          "/images/clubs/defaultLogo.30cc7520.svg";
      }}
    />
  );
}

export default TimelineTeamLogo;
