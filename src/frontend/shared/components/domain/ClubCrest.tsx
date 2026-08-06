// src/frontend/shared/components/domain/ClubCrest.tsx

import { ImageWithFallback } from "@/shared/components/primitives";
import { formatNameToFileName } from "@/shared/utils";

import { DEFAULT_CLUB_LOGO } from "./ClubLogo";

interface ClubCrestProps {
  readonly clubName: string;
  readonly className?: string;
}

/**
 * The bare inline crest used in table rows — no tile, no gradient, unlike
 * [ClubLogo].
 */
export function ClubCrest({
  clubName,
  className = "w-8 h-8 object-contain",
}: ClubCrestProps) {
  return (
    /* Local 32px .webp crest; see ClubLogo for why next/image isn't used. */
    <ImageWithFallback
      src={`/images/clubs/${formatNameToFileName(clubName)}.webp`}
      alt={`${clubName} logo`}
      fallback={DEFAULT_CLUB_LOGO}
      className={className}
    />
  );
}

export default ClubCrest;
