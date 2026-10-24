// src/frontend/features/matches/components/list/matches-by-round/match-card/MatchStatus.tsx
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/shared/components/primitives";
import { formatMatchDateTime } from "@/shared/utils";

interface MatchStatusProps {
  readonly date: Date | string;
  readonly overtime: boolean;
}

/**
 * The kickoff time and a final-score badge.
 *
 * **Assumes the match has been played** — the badge reads "final", or "final
 * (OT)" when `overtime`. There is no scheduled or in-progress state, so
 * rendering this for a future fixture labels it final.
 */
export function MatchStatus({ date, overtime }: MatchStatusProps) {
  const tMatches = useTranslations("matches");
  const locale = useLocale();

  return (
    <div className="flex justify-between items-center mb-2">
      <time className="text-sm text-text-body">
        {formatMatchDateTime(date, locale)}
      </time>
      <Badge variant={overtime ? "warning" : "outline"} size="sm">
        {overtime ? tMatches("finalOT") : tMatches("final")}
      </Badge>
    </div>
  );
}
