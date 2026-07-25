// src/frontend/features/matches/components/detail/match-score-card/ScoreDisplay.tsx
import { cn } from "@/shared/utils";

interface ScoreDisplayProps {
  readonly homeScore: number;
  readonly awayScore: number;
  readonly isHomeWinning: boolean;
  readonly isAwayWinning: boolean;
}

/**
 * The `home - away` score pair, with the winning side emphasized.
 *
 * Not to be confused with the championships list card's `ScoreDisplay`, which
 * is a compact variant carrying its own upcoming-match badge and summary link.
 */
export function ScoreDisplay({
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
