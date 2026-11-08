// src/frontend/features/matches/components/ForfeitBadge.tsx
import { useTranslations } from "next-intl";

import { Badge } from "@/shared/components/primitives";

interface ForfeitBadgeProps {
  readonly className?: string;
  /**
   * Show the letter alone, beside the overtime badge in a matchday row where
   * the word would take a team name's width. Its title and a screen reader
   * still give the word.
   */
  readonly short?: boolean;
}

/**
 * Marks a forfeited match wherever its score is shown: the score alone, 20–0,
 * reads as a played match.
 */
export function ForfeitBadge({ className, short = false }: ForfeitBadgeProps) {
  const tMatches = useTranslations("matches");
  const word = tMatches("forfeit");

  if (!short) {
    return (
      <Badge variant="outline" size="sm" className={className}>
        {word}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" size="sm" className={className} title={word}>
      <span aria-hidden>{tMatches("forfeitShort")}</span>
      <span className="sr-only">{word}</span>
    </Badge>
  );
}
