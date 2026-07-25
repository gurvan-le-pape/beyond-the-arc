// src/frontend/shared/components/domain/ClubLogoLink.tsx
"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/navigation";
import { ImageWithFallback } from "@/shared/components/primitives";
import { formatNameToFileName } from "@/shared/utils";

import { DEFAULT_CLUB_LOGO } from "./ClubLogo";

interface ClubLogoLinkProps {
  readonly clubId: number;
  readonly clubName: string;
}

/**
 * The club crest tile in the team and player detail headers, linking to the
 * club.
 *
 * The list-card equivalent is `ClubLogo` — kept separate because that one is a
 * smaller gradient tile that is not a link and never sits on a surface-inset
 * background.
 */
export function ClubLogoLink({ clubId, clubName }: ClubLogoLinkProps) {
  const tCommon = useTranslations("common");

  return (
    <Link
      href={`/organizations/clubs/${clubId}`}
      aria-label={tCommon("club.seeClub", { name: clubName })}
      className="w-16 h-16 flex-shrink-0 rounded-card border border-divide bg-surface-inset overflow-hidden flex items-center justify-center"
    >
      <ImageWithFallback
        src={`/images/clubs/${formatNameToFileName(clubName)}.webp`}
        alt={clubName}
        fallback={DEFAULT_CLUB_LOGO}
        className="w-14 h-14 object-contain"
      />
    </Link>
  );
}

export default ClubLogoLink;
