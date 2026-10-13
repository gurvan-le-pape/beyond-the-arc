// src/frontend/features/matches/components/detail/match-score-card/LogoLink.tsx
"use client";

import { useTranslations } from "next-intl";

import type { TeamInfo } from "@/features/teams/types";
import { Link } from "@/navigation";
import { ClubMark } from "@/shared/components/domain";
import { cn } from "@/shared/utils";

interface LogoLinkProps {
  readonly team: TeamInfo;
  readonly isWinning: boolean;
}

/** Club logo, linking to the club. The winning side gets the accent border. */
export function LogoLink({ team, isWinning }: LogoLinkProps) {
  const tCommon = useTranslations("common");

  return (
    <Link
      href={`/organizations/clubs/${team.clubId}`}
      aria-label={tCommon("club.seeClub", { name: team.clubName ?? "" })}
      className={cn(
        "w-16 h-16 md:w-20 md:h-20 flex-shrink-0 p-0 rounded-button overflow-hidden",
        "flex items-center justify-center",
        "border-4 bg-surface-inset transition-all duration-200",
        isWinning
          ? "border-primary shadow-card-hover"
          : "border-divide hover:border-primary shadow-card",
      )}
    >
      <ClubMark clubName={team.clubName} size="xl" />
    </Link>
  );
}
