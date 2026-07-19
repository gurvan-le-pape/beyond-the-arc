// src/frontend/features/competitions/championships/components/detail/championship-matches/match-card/ScoreDisplay.tsx
import { useTranslations } from "next-intl";

import { Badge } from "@/shared/components/primitives";

interface ScoreDisplayProps {
  readonly homeTeamScore: number | null;
  readonly awayTeamScore: number | null;
  readonly isHomeWinner: boolean;
  readonly isAwayWinner: boolean;
  readonly matchId: number;
  readonly locale: string;
}

export function ScoreDisplay({
  homeTeamScore,
  awayTeamScore,
  isHomeWinner,
  isAwayWinner,
  matchId,
  locale,
}: ScoreDisplayProps) {
  const tMatches = useTranslations("matches");
  const hasScores = homeTeamScore !== null && awayTeamScore !== null;

  return (
    <div className="flex flex-col items-center flex-shrink-0 px-2">
      {hasScores ? (
        <>
          <div className="text-xl font-bold text-text-heading mb-1">
            <span
              className={isHomeWinner ? "text-primary" : "text-text-emphasis"}
            >
              {homeTeamScore}
            </span>
            <span className="mx-1.5 text-text-muted">-</span>
            <span
              className={isAwayWinner ? "text-primary" : "text-text-emphasis"}
            >
              {awayTeamScore}
            </span>
          </div>
          <a
            href={`/${locale}/matches/${matchId}`}
            className="text-sm text-primary hover:text-primary-strong hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ring-offset-surface rounded-button"
          >
            {tMatches("summary")}
          </a>
        </>
      ) : (
        <Badge variant="outline" size="md">
          {tMatches("upcoming")}
        </Badge>
      )}
    </div>
  );
}
