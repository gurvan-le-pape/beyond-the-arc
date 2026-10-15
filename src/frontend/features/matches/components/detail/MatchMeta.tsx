// src/frontend/features/matches/components/detail/MatchMeta.tsx
import { useLocale, useTranslations } from "next-intl";

import { Text } from "@/shared/components/typography";
import { formatMatchDate, formatMatchTime } from "@/shared/utils";

interface MatchMetaProps {
  readonly startsAt: Date | string;
  readonly matchday: number;
  readonly poolLetter: string;
}

/**
 * The line that places a match in time and in its competition: date, tip-off,
 * matchday and pool. Times are shown in the competition's zone, like every
 * other match date on the site.
 */
export function MatchMeta({ startsAt, matchday, poolLetter }: MatchMetaProps) {
  const tMatches = useTranslations("matches");
  const locale = useLocale();

  const parts = [
    tMatches("startsAt", {
      date: formatMatchDate(startsAt, locale),
      time: formatMatchTime(startsAt, locale),
    }),
    tMatches("matchdayWithValue", { matchday }),
    tMatches("poolWithLetter", { letter: poolLetter }),
  ];

  return (
    <Text variant="caption" as="p" className="text-center">
      {parts.join(" · ")}
    </Text>
  );
}

export default MatchMeta;
