// src/frontend/features/matches/components/detail/UpcomingMatchNotice.tsx
import { CalendarClock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Section } from "@/shared/components/blocks";
import { Text } from "@/shared/components/typography";
import { formatMatchDate, formatMatchTime } from "@/shared/utils";

interface UpcomingMatchNoticeProps {
  readonly startsAt: Date | string;
}

/**
 * Stands in for the stats and events of a match that has not been played: when
 * it starts, and that the rest appears once it has.
 */
export function UpcomingMatchNotice({ startsAt }: UpcomingMatchNoticeProps) {
  const tMatches = useTranslations("matches");
  const locale = useLocale();

  return (
    <Section title={tMatches("upcomingMatch.title")}>
      <div className="flex items-start gap-3">
        <CalendarClock
          className="w-5 h-5 mt-0.5 shrink-0 text-text-secondary"
          aria-hidden="true"
        />
        <Text variant="body">
          {tMatches("upcomingMatch.body", {
            date: formatMatchDate(startsAt, locale),
            time: formatMatchTime(startsAt, locale),
          })}
        </Text>
      </div>
    </Section>
  );
}

export default UpcomingMatchNotice;
