// src/frontend/shared/components/domain/matches/MatchScore.tsx
import { useTranslations } from "next-intl";

import { Badge } from "@/shared/components/primitives";
import { cn } from "@/shared/utils";

type MatchScoreVariant = "list" | "compact" | "hero" | "table";

interface MatchScoreProps {
  readonly homeScore: number | null;
  readonly awayScore: number | null;
  readonly variant: MatchScoreVariant;
  readonly className?: string;
}

type BoxVariant = Exclude<MatchScoreVariant, "table">;

const CONTAINER_CLASSES: Record<BoxVariant, string> = {
  list: "flex items-center gap-3",
  compact: "text-xl font-bold text-text-heading",
  hero: "flex items-center gap-3",
};

const DASH_CLASSES: Record<BoxVariant, string> = {
  list: "text-xl text-text-muted",
  compact: "mx-1.5 text-text-muted",
  hero: "text-xl md:text-2xl text-text-muted",
};

function scoreClasses(variant: MatchScoreVariant, isWinner: boolean): string {
  switch (variant) {
    case "list":
      return isWinner
        ? "text-2xl font-bold text-text-heading"
        : "text-2xl font-normal text-text-body";
    case "compact":
      return isWinner ? "text-primary" : "text-text-emphasis";
    case "hero":
      return cn(
        "text-2xl md:text-4xl font-bold tabular-nums transition-colors duration-200",
        isWinner ? "text-text-heading" : "text-text-secondary",
      );
    case "table":
      return isWinner ? "font-bold" : "font-normal";
  }
}

/**
 * Shared home/away score pair, used across match lists, cards, tables, and
 * the match detail hero. `variant` reproduces each call site's existing look
 * (size + winner emphasis); the "upcoming" fallback badge is shared as-is.
 */
export function MatchScore({
  homeScore,
  awayScore,
  variant,
  className,
}: MatchScoreProps) {
  const tMatches = useTranslations("matches");
  const hasScore = homeScore !== null && awayScore !== null;

  if (!hasScore) {
    return (
      <Badge variant="outline" size="md">
        {tMatches("upcoming")}
      </Badge>
    );
  }

  const isHomeWinner = homeScore > awayScore;
  const isAwayWinner = awayScore > homeScore;
  const homeSpan = (
    <span className={scoreClasses(variant, isHomeWinner)}>{homeScore}</span>
  );
  const awaySpan = (
    <span className={scoreClasses(variant, isAwayWinner)}>{awayScore}</span>
  );

  if (variant === "table") {
    return (
      <span className={className}>
        {homeSpan}
        {" - "}
        {awaySpan}
      </span>
    );
  }

  return (
    <div className={cn(CONTAINER_CLASSES[variant], className)}>
      {homeSpan}
      <span className={DASH_CLASSES[variant]}>-</span>
      {awaySpan}
    </div>
  );
}

export default MatchScore;
