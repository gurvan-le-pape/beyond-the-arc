// src/frontend/shared/components/domain/ClubLogo.tsx

import { ImageWithFallback } from "@/shared/components/primitives";
import { cn, formatNameToFileName } from "@/shared/utils";

export const DEFAULT_CLUB_LOGO = "/images/clubs/defaultLogo.30cc7520.svg";

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
      {/* Local 40px .webp crest in a fixed-size tile, so next/image would add a
          runtime optimizer round-trip for no LCP or CLS gain. */}
      <ImageWithFallback
        src={src}
        alt={alt ?? clubName ?? ""}
        fallback={DEFAULT_CLUB_LOGO}
        className="w-10 h-10 object-contain transition-transform duration-200 group-hover:scale-105"
        loading="eager"
      />
    </div>
  );
}

export default ClubLogo;
