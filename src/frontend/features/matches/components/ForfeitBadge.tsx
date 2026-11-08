// src/frontend/features/matches/components/ForfeitBadge.tsx
import { useTranslations } from "next-intl";

import { Badge } from "@/shared/components/primitives";

interface ForfeitBadgeProps {
  readonly className?: string;
}

/**
 * Marks a forfeited match wherever its score is shown: the score alone, 20–0,
 * reads as a played match.
 */
export function ForfeitBadge({ className }: ForfeitBadgeProps) {
  const tMatches = useTranslations("matches");

  return (
    <Badge variant="outline" size="sm" className={className}>
      {tMatches("forfeit")}
    </Badge>
  );
}
