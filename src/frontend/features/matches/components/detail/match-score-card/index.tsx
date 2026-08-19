// src/frontend/features/matches/components/detail/match-score-card/index.tsx
"use client";

import type { TeamInfo } from "@/features/teams/types";
import { MatchScore } from "@/shared/components/domain";
import { Card } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

import { LogoLink } from "./LogoLink";
import { TeamNameLink } from "./TeamNameLink";

interface MatchScoreCardProps {
  readonly homeTeam: TeamInfo;
  readonly awayTeam: TeamInfo;
  readonly className?: string;
}

interface TeamSectionProps {
  readonly team: TeamInfo;
  readonly isWinning: boolean;
  readonly align: "left" | "right";
}

// Desktop-only: logo stacked over name. Kept here rather than in its own file
// because it is pure arrangement of the two links — the root owns layout.
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
export function MatchScoreCard({
  homeTeam,
  awayTeam,
  className,
}: MatchScoreCardProps) {
  const isHomeWinning = homeTeam.score > awayTeam.score;
  const isAwayWinning = awayTeam.score > homeTeam.score;

  return (
    <Card variant="highlighted" padding="lg" className={className}>
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center justify-between gap-4">
          <LogoLink team={homeTeam} isWinning={isHomeWinning} />
          <MatchScore
            homeScore={homeTeam.score}
            awayScore={awayTeam.score}
            variant="hero"
          />
          <LogoLink team={awayTeam} isWinning={isAwayWinning} />
        </div>
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

      <div className="hidden md:flex items-center justify-between gap-6">
        <TeamSection team={homeTeam} isWinning={isHomeWinning} align="left" />
        <MatchScore
          homeScore={homeTeam.score}
          awayScore={awayTeam.score}
          variant="hero"
        />
        <TeamSection team={awayTeam} isWinning={isAwayWinning} align="right" />
      </div>
    </Card>
  );
}

export default MatchScoreCard;
