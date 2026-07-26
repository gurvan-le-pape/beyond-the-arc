// src/frontend/features/competitions/championships/components/detail/championship-matches/match-card/ScoreDisplay.tsx
import { useTranslations } from "next-intl";

import { MatchScore } from "@/shared/components/domain";

interface ScoreDisplayProps {
  readonly homeTeamScore: number | null;
  readonly awayTeamScore: number | null;
  readonly matchId: number;
  readonly locale: string;
}

export function ScoreDisplay({
  homeTeamScore,
  awayTeamScore,
  matchId,
  locale,
}: ScoreDisplayProps) {
  const tMatches = useTranslations("matches");
  const hasScores = homeTeamScore !== null && awayTeamScore !== null;

  return (
    <div className="flex flex-col items-center flex-shrink-0 px-2">
      <MatchScore
        homeScore={homeTeamScore}
        awayScore={awayTeamScore}
        variant="compact"
        className="mb-1"
      />
      {hasScores && (
        <a
          href={`/${locale}/matches/${matchId}`}
          className="text-sm text-primary hover:text-primary-strong hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface rounded-button"
        >
          {tMatches("summary")}
        </a>
      )}
    </div>
  );
}
