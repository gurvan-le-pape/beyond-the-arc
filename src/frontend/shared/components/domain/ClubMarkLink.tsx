// src/frontend/shared/components/domain/ClubMarkLink.tsx
"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/navigation";

import { ClubMark } from "./ClubMark";

interface ClubMarkLinkProps {
  readonly clubId: number;
  readonly clubName: string;
}

/** A club's mark linking to the club — the team and player detail headers. */
export function ClubMarkLink({ clubId, clubName }: ClubMarkLinkProps) {
  const tCommon = useTranslations("common");

  return (
    <Link
      href={`/organizations/clubs/${clubId}`}
      aria-label={tCommon("club.seeClub", { name: clubName })}
      className="shrink-0 rounded-button focus-ring"
    >
      <ClubMark clubName={clubName} size="xl" />
    </Link>
  );
}

export default ClubMarkLink;
