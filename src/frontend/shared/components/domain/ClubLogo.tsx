// src/frontend/shared/components/domain/ClubLogo.tsx
"use client";

import { cn, formatNameToFileName } from "@/shared/utils";

const DEFAULT_CLUB_LOGO = "/images/clubs/defaultLogo.30cc7520.svg";

interface ClubLogoProps {
  readonly clubName: string | null | undefined;
  readonly alt?: string;
  /** Extra classes for the tile wrapper. */
  readonly className?: string;
}

/**
 * The gradient logo tile used across the list cards: a club's crest resolved
 * from its name, falling back to the default logo on error.
 */
export function ClubLogo({ clubName, alt, className }: ClubLogoProps) {
  const src = clubName
    ? `/images/clubs/${formatNameToFileName(clubName)}.webp`
    : DEFAULT_CLUB_LOGO;

  return (
    <div
      className={cn(
        "w-14 h-14 rounded-card flex-shrink-0",
        "flex items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-surface-inset to-surface-own",
        "border border-divide/60 shadow-sm",
        className,
      )}
    >
      <img
        src={src}
        alt={alt ?? clubName ?? ""}
        className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src = DEFAULT_CLUB_LOGO;
        }}
      />
    </div>
  );
}

export default ClubLogo;
