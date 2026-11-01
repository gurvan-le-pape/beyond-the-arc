// src/frontend/features/matches/components/detail/match-events/match-flow/usePeriodAbbr.ts
import { useTranslations } from "next-intl";
import { useCallback } from "react";

import { overtimeNumber } from "../gameClock";

/**
 * The short name of a period, as the quarter filter writes it: `Q3`, or the
 * locale's overtime abbreviation, numbered from the second overtime on.
 *
 * @returns a function from a 1-based period to its short name
 */
export function usePeriodAbbr(): (period: number) => string {
  const t = useTranslations("matches.matchEvents");
  return useCallback(
    (period: number) => {
      const overtime = overtimeNumber(period);
      return overtime === null
        ? `Q${period}`
        : t("overtimeAbbr", { n: overtime });
    },
    [t],
  );
}
