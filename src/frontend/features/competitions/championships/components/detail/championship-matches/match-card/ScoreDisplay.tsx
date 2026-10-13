// src/frontend/features/competitions/championships/components/detail/championship-matches/match-card/ScoreDisplay.tsx
import { useTranslations } from "next-intl";

import { Link } from "@/navigation";
import { MatchScore } from "@/shared/components/domain";

interface ScoreDisplayProps {
  readonly homeTeamScore: number | null;
  readonly awayTeamScore: number | null;
  readonly matchId: number;
}

/**
 * The scoreline, and a link to the full match summary beneath it.
 *
 * **The link appears only when both scores are present.** An unplayed fixture
 * therefore has no route to its detail page from here, which is deliberate:
 * there is nothing to show yet.
 */
export function ScoreDisplay({
  homeTeamScore,
  awayTeamScore,
  matchId,
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
        <Link
          href={`/matches/${matchId}`}
          className="text-sm text-primary hover:text-primary-strong hover:underline transition-colors duration-200 focus-ring rounded-button"
        >
          {tMatches("summary")}
        </Link>
      )}
    </div>
  );
}
