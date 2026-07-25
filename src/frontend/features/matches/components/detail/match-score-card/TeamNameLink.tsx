// src/frontend/features/matches/components/detail/match-score-card/TeamNameLink.tsx
"use client";

import { useTranslations } from "next-intl";

import type { TeamInfo } from "@/features/teams/types";
import { Link } from "@/navigation";
import { cn } from "@/shared/utils";

interface TeamNameLinkProps {
  readonly team: TeamInfo;
  readonly isWinning: boolean;
  readonly align: "left" | "right";
}

/** Team name, linking to the team. `align` follows the side of the card. */
export function TeamNameLink({ team, isWinning, align }: TeamNameLinkProps) {
  const tCommon = useTranslations("common");

  return (
    <Link
      href={`/teams/${team.id}`}
      className={cn(
        "flex-1 min-w-0",
        "text-xs md:text-sm font-semibold leading-snug [overflow-wrap:break-word] [hyphens:auto]",
        "hover:text-primary transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary ring-offset-surface rounded",
        align === "left" ? "text-left" : "text-right",
        isWinning ? "text-text-heading" : "text-text-body",
      )}
      aria-label={tCommon("team.seeTeam", { number: team.name })}
    >
      {team.name}
    </Link>
  );
}
