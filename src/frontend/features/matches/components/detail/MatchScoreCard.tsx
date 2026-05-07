// src/frontend/features/matches/components/detail/MatchScoreCard.tsx
"use client";

import { useTranslations } from "next-intl";
import React from "react";

import type { TeamInfo } from "@/features/teams/types/TeamInfo";
import { useRouter } from "@/navigation";
import { Button, Card } from "@/shared/components/primitives";
import { cn } from "@/shared/utils/cn";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

interface MatchScoreCardProps {
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  className?: string;
}

interface TeamSectionProps {
  readonly team: TeamInfo;
  readonly isWinning: boolean;
  readonly align: "left" | "right";
}

function TeamSection({ team, isWinning, align }: TeamSectionProps) {
  const router = useRouter();
  const tCommon = useTranslations("common");

  return (
    <div
      className={cn(
        "flex-1 flex flex-col items-center gap-4",
        align === "left" ? "text-left" : "text-right",
      )}
    >
      {/* Club Logo */}
      <button
        type="button"
        className={cn(
          "group relative w-20 h-20 rounded-button overflow-hidden",
          "bg-surface-inset flex items-center justify-center",
          "border-4 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface",
          isWinning
            ? "border-primary shadow-card-hover"
            : "border-divide hover:border-primary shadow-card",
        )}
        onClick={() => router.push(`/organizations/clubs/${team.clubId}`)}
        aria-label={tCommon("club.seeClub", { name: team.clubName ?? "" })}
      >
        <img
          src={`/images/clubs/${formatNameToFileName(
            team.clubName ?? "",
          )}.webp`}
          alt={`${team.clubName} logo`}
          className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-200"
          loading="lazy"
          onError={(e) => {
            (
              e.target as HTMLImageElement
            ).src = `/images/clubs/defaultLogo.30cc7520.svg`;
          }}
        />
      </button>

      {/* Team Name */}
      <Button
        variant="ghost"
        size="md"
        onClick={() => router.push(`/teams/${team.id}`)}
        aria-label={tCommon("team.seeTeam", { number: team.name })}
        className={cn(
          "text-sm font-semibold",
          isWinning ? "text-text-heading" : "text-text-body",
        )}
      >
        {team.name}
      </Button>
    </div>
  );
}

/**
 * Match score card component
 * Displays team logos, scores, and names in a card layout
 */
export const MatchScoreCard: React.FC<MatchScoreCardProps> = ({
  homeTeam,
  awayTeam,
  className,
}) => {
  const isHomeWinning = homeTeam.score > awayTeam.score;
  const isAwayWinning = awayTeam.score > homeTeam.score;

  return (
    <Card variant="highlighted" padding="lg" className={className}>
      <div className="flex items-center justify-between gap-6">
        {/* Home Team */}
        <TeamSection team={homeTeam} isWinning={isHomeWinning} align="left" />

        {/* Score */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "text-2xl md:text-4xl font-bold tabular-nums transition-colors duration-200",
              isHomeWinning ? "text-text-heading" : "text-text-secondary",
            )}
          >
            {homeTeam.score}
          </span>
          <span className="text-xl md:text-2xl font-bold text-text-muted">
            -
          </span>
          <span
            className={cn(
              "text-2xl md:text-4xl font-bold tabular-nums transition-colors duration-200",
              isAwayWinning ? "text-text-heading" : "text-text-secondary",
            )}
          >
            {awayTeam.score}
          </span>
        </div>

        {/* Away Team */}
        <TeamSection team={awayTeam} isWinning={isAwayWinning} align="right" />
      </div>
    </Card>
  );
};

export default MatchScoreCard;
