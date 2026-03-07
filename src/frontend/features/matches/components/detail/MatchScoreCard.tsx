// src/frontend/features/matches/components/detail/MatchScoreCard.tsx
"use client";

import { useTranslations } from "next-intl";
import React from "react";

import type { TeamInfo } from "@/features/teams/types/TeamInfo";
import { useRouter } from "@/navigation";
import { Button } from "@/shared/components/ui";
import { Card } from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";
import { formatNameToFileName } from "@/shared/utils/formatNameToFileName";

interface MatchScoreCardProps {
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  className?: string;
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
  const router = useRouter();
  const tCommon = useTranslations("common");

  const isHomeWinning = homeTeam.score > awayTeam.score;
  const isAwayWinning = awayTeam.score > homeTeam.score;

  const TeamSection = ({
    team,
    isWinning,
    align,
  }: {
    team: TeamInfo;
    isWinning: boolean;
    align: "left" | "right";
  }) => {
    console.log(
      "Club image path:",
      `/images/clubs/${formatNameToFileName(team.clubName ?? "")}.webp`,
    );
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
            "bg-gray-100 dark:bg-gray-700 flex items-center justify-center",
            "border-4 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-950",
            isWinning
              ? "border-primary-500 dark:border-primary-400 shadow-card-hover"
              : "border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 shadow-card dark:shadow-card-dark",
          )}
          onClick={() => void router.push(`/club/${team.clubId}`)}
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
          onClick={() => void router.push(`/teams/${team.id}`)}
          aria-label={tCommon("team.seeTeam", { number: team.name })}
          className={cn(
            "text-sm font-semibold",
            isWinning
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-600 dark:text-gray-400",
          )}
        >
          {team.name}
        </Button>
      </div>
    );
  };

  return (
    <Card variant="default" padding="lg" className={className}>
      <div className="flex items-center justify-between gap-6">
        {/* Home Team */}
        <TeamSection team={homeTeam} isWinning={isHomeWinning} align="left" />

        {/* Score */}
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "text-2xl md:text-4xl font-bold tabular-nums transition-colors duration-200",
              isHomeWinning
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-500",
            )}
          >
            {homeTeam.score}
          </span>
          <span className="text-xl md:text-2xl font-bold text-gray-400 dark:text-gray-600">
            -
          </span>
          <span
            className={cn(
              "text-2xl md:text-4xl font-bold tabular-nums transition-colors duration-200",
              isAwayWinning
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-500",
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
