// src/frontend/features/competitions/championships/components/detail/championship-matches/match-card/MatchStatus.tsx
import { useTranslations } from "next-intl";

import { Badge } from "@/shared/components/primitives";
import { formatMatchDateTime } from "@/shared/utils";

interface MatchStatusProps {
  readonly date: Date | string;
  readonly overtime: boolean;
}

export function MatchStatus({ date, overtime }: MatchStatusProps) {
  const tMatches = useTranslations("matches");

  return (
    <div className="flex justify-between items-center mb-2">
      <time className="text-sm text-text-body">
        {formatMatchDateTime(date)}
      </time>
      <Badge variant={overtime ? "warning" : "outline"} size="sm">
        {overtime ? tMatches("finalOT") : tMatches("final")}
      </Badge>
    </div>
  );
}
