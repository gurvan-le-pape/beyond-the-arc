// src/frontend/features/matches/components/detail/match-events/timeline/TimelineTeamLogo.tsx

import { DEFAULT_CLUB_LOGO } from "@/shared/components/domain";
import { ImageWithFallback } from "@/shared/components/primitives";
import { formatNameToFileName } from "@/shared/utils";

interface TimelineTeamLogoProps {
  readonly teamName: string;
}

/**
 * Renders a team's logo image.
 * Falls back to a generic default logo if the image fails to load.
 */
export function TimelineTeamLogo({ teamName }: TimelineTeamLogoProps) {
  return (
    // Local 32px .webp crest; see ClubLogo for why next/image isn't used.
    <ImageWithFallback
      src={`/images/clubs/${formatNameToFileName(teamName)}.webp`}
      alt={teamName}
      fallback={DEFAULT_CLUB_LOGO}
      className="w-8 h-8 object-contain"
      loading="eager"
    />
  );
}

export default TimelineTeamLogo;
