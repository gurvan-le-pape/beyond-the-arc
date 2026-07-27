// src/frontend/shared/components/domain/ClubCrest.tsx
"use client";

import { DEFAULT_CLUB_LOGO } from "./ClubLogo";

interface ClubCrestProps {
  readonly clubName: string;
  readonly className?: string;
}

/**
 * The bare inline crest used in table rows — no tile, no gradient, unlike
 * [ClubLogo]. Client-only because the fallback swaps the DOM node's src in an
 * onError handler, which keeps its server-rendered callers server components.
 */
export function ClubCrest({
  clubName,
  className = "w-8 h-8 object-contain",
}: ClubCrestProps) {
  return (
    /* Local 32px .webp crest; see ClubLogo for why next/image isn't used. */
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`/images/clubs/${clubName}.webp`}
      alt={`${clubName} logo`}
      className={className}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).src = DEFAULT_CLUB_LOGO;
      }}
    />
  );
}

export default ClubCrest;
