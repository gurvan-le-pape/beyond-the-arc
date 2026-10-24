// src/frontend/features/matches/components/detail/MatchHero.tsx
import { useLocale, useTranslations } from "next-intl";

import { Matchup } from "@/shared/components/domain";
import { Card } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { formatMatchDate, formatMatchTime } from "@/shared/utils";

import type { MatchTeam } from "../../types/MatchTeam";
import { matchTeamMatchupSide } from "../../utils/matchupSide";

interface MatchHeroProps {
  readonly homeTeam: MatchTeam;
  readonly awayTeam: MatchTeam;
  readonly startsAt: Date | string;
  readonly matchday: number;
  readonly poolLetter: string;
}

/**
 * The title block of a match page: the line that places the match in time and
 * in its competition — date, tip-off, matchday and pool — above the two teams
 * and their score.
 *
 * The score card is the visible title, so the page's heading is rendered for
 * screen readers only. Times are shown in the competition's zone, like every
 * other match date on the site.
 */
export function MatchHero({
  homeTeam,
  awayTeam,
  startsAt,
  matchday,
  poolLetter,
}: MatchHeroProps) {
  const tMatches = useTranslations("matches");
  const locale = useLocale();

  const meta = [
    tMatches("startsAt", {
      date: formatMatchDate(startsAt, locale),
      time: formatMatchTime(startsAt, locale),
    }),
    tMatches("matchdayWithValue", { matchday }),
    tMatches("poolWithLetter", { letter: poolLetter }),
  ];

  return (
    <>
      <Text variant="pageTitle" className="sr-only">
        {tMatches("matchTitle", {
          homeTeam: homeTeam.name,
          awayTeam: awayTeam.name,
        })}
      </Text>

      <Card padding="lg" className="space-y-4">
        <Text variant="caption" as="p" className="text-center">
          {meta.join(" · ")}
        </Text>
        <Matchup
          home={matchTeamMatchupSide(homeTeam)}
          away={matchTeamMatchupSide(awayTeam)}
          size="hero"
          linked
        />
      </Card>
    </>
  );
}

export default MatchHero;
