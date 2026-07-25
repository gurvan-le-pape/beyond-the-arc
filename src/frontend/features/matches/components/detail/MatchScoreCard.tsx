// src/frontend/features/matches/components/detail/MatchScoreCard.tsx
"use client";

import { useTranslations } from "next-intl";
import React from "react";

import type { TeamInfo } from "@/features/teams/types";
import { Link } from "@/navigation";
import { Card, ImageWithFallback } from "@/shared/components/primitives";
import { cn, formatNameToFileName } from "@/shared/utils";

interface MatchScoreCardProps {
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  className?: string;
}

interface LogoLinkProps {
  readonly team: TeamInfo;
  readonly isWinning: boolean;
}

interface TeamNameLinkProps {
  readonly team: TeamInfo;
  readonly isWinning: boolean;
  readonly align: "left" | "right";
}

interface ScoreDisplayProps {
  readonly homeScore: number;
  readonly awayScore: number;
  readonly isHomeWinning: boolean;
  readonly isAwayWinning: boolean;
}

interface TeamSectionProps {
  readonly team: TeamInfo;
  readonly isWinning: boolean;
  readonly align: "left" | "right";
}

function LogoLink({ team, isWinning }: LogoLinkProps) {
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
      <ImageWithFallback
        src={`/images/clubs/${formatNameToFileName(team.clubName ?? "")}.webp`}
        alt={team.clubName ?? ""}
        fallback="/images/clubs/defaultLogo.30cc7520.svg"
        className="w-12 h-12 md:w-16 md:h-16 object-contain"
      />
    </Link>
  );
}

function TeamNameLink({ team, isWinning, align }: TeamNameLinkProps) {
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

function ScoreDisplay({
  homeScore,
  awayScore,
  isHomeWinning,
  isAwayWinning,
}: ScoreDisplayProps) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <span
        className={cn(
          "text-2xl md:text-4xl font-bold tabular-nums transition-colors duration-200",
          isHomeWinning ? "text-text-heading" : "text-text-secondary",
        )}
      >
        {homeScore}
      </span>
      <span className="text-xl md:text-2xl font-bold text-text-muted">-</span>
      <span
        className={cn(
          "text-2xl md:text-4xl font-bold tabular-nums transition-colors duration-200",
          isAwayWinning ? "text-text-heading" : "text-text-secondary",
        )}
      >
        {awayScore}
      </span>
    </div>
  );
}

// Desktop-only: logo + name stacked, used in the original single-row layout
function TeamSection({ team, isWinning, align }: TeamSectionProps) {
  return (
    <div
      className={cn(
        "flex-1 flex flex-col items-center gap-4 min-w-0",
        align === "left" ? "text-left" : "text-right",
      )}
    >
      <LogoLink team={team} isWinning={isWinning} />
      <TeamNameLink team={team} isWinning={isWinning} align={align} />
    </div>
  );
}

/**
 * Match score card component
 * Displays team logos, scores, and names in a card layout.
 *
 * Mobile: two-row layout — logos + score on top, full-width team names below.
 * Desktop: original single-row layout with logo stacked above name.
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
      {/* Mobile layout */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Row 1: logos + score */}
        <div className="flex items-center justify-between gap-4">
          <LogoLink team={homeTeam} isWinning={isHomeWinning} />
          <ScoreDisplay
            homeScore={homeTeam.score}
            awayScore={awayTeam.score}
            isHomeWinning={isHomeWinning}
            isAwayWinning={isAwayWinning}
          />
          <LogoLink team={awayTeam} isWinning={isAwayWinning} />
        </div>
        {/* Row 2: team names, full width */}
        <div className="flex justify-between gap-2">
          <TeamNameLink
            team={homeTeam}
            isWinning={isHomeWinning}
            align="left"
          />
          <TeamNameLink
            team={awayTeam}
            isWinning={isAwayWinning}
            align="right"
          />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex items-center justify-between gap-6">
        <TeamSection team={homeTeam} isWinning={isHomeWinning} align="left" />
        <ScoreDisplay
          homeScore={homeTeam.score}
          awayScore={awayTeam.score}
          isHomeWinning={isHomeWinning}
          isAwayWinning={isAwayWinning}
        />
        <TeamSection team={awayTeam} isWinning={isAwayWinning} align="right" />
      </div>
    </Card>
  );
};

export default MatchScoreCard;
