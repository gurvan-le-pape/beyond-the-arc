// src/frontend/features/site/home/components/LatestRoundSection.tsx
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import type { Championship } from "@/features/competitions/championships/types";
import {
  buildChampionshipHeading,
  buildChampionshipOrganizer,
} from "@/features/competitions/championships/utils";
import { LeaderboardTable } from "@/features/competitions/leaderboards/components";
import type { Leaderboard } from "@/features/competitions/leaderboards/types";
import type { RecentPool } from "@/features/competitions/pools/types";
import { ForfeitBadge } from "@/features/matches/components";
import type { Match } from "@/features/matches/types";
import { matchupSide } from "@/features/matches/utils";
import { Section } from "@/shared/components/blocks";
import { Matchup } from "@/shared/components/domain";
import { Card, TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import { MatchStatus } from "@/shared/constants";
import { cn, formatMatchDay } from "@/shared/utils";

/** Standings rows shown before the link to the full table. */
const STANDINGS_PREVIEW_ROWS = 5;

/**
 * Results shown on a phone, where the cards stack one per row; wider screens
 * show the whole round.
 */
const PHONE_RESULTS = 3;

interface LatestRoundSectionProps {
  readonly championship: Championship;
  /** The pool to feature, and the matchday it last played. */
  readonly pool: RecentPool;
  /** Every match of the pool; the section keeps the round's played ones. */
  readonly matches: Match[];
  readonly leaderboard: Leaderboard[];
}

/**
 * The home page's live band: one pool's latest matchday results beside its
 * standings, so the page shows the data and not only counts of it. The
 * standings stop at the top of the table; the rest is a link away.
 *
 * Which pool is the caller's decision — the backend's `/pools/recent` order.
 * This names its championship, keeps the round's played matches and lays them
 * out. A server component: nothing here is interactive.
 */
export function LatestRoundSection({
  championship,
  pool,
  matches,
  leaderboard,
}: LatestRoundSectionProps) {
  const t = useTranslations("home.latestRound");
  const tHome = useTranslations("home");
  const tMatches = useTranslations("matches");
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const locale = useLocale();

  const { matchday } = pool;
  const playedOn = formatMatchDay(pool.playedAt, locale);
  const championshipHref = `/championships/${championship.id}?pool=${pool.id}`;
  // The organisation is the name and the rest of the title is detail under it.
  const championshipName = buildChampionshipOrganizer(
    championship,
    tHome(`levels.${championship.level}.name`),
  );
  const championshipDetails = [
    buildChampionshipHeading(championship, {
      gender: tCommon(`gender.${championship.gender}`),
      division: tCompetitions("divisionWithValue", {
        value: championship.division,
      }),
    }),
    championship.seasonYear,
  ]
    .filter(Boolean)
    .join(" · ");
  // The round may still be mid-simulation: show what has finished.
  const roundResults = matches.filter(
    (match) =>
      match.matchday === matchday && match.status === MatchStatus.COMPLETED,
  );

  const onward = (label: string) => (
    <span className="text-sm">
      <TextLink href={championshipHref}>
        {label}
        <ArrowRight aria-hidden="true" className="ml-1 inline h-4 w-4" />
      </TextLink>
    </span>
  );

  return (
    <section
      aria-labelledby="latest-round-title"
      className="px-6 py-10 border-b border-divide"
    >
      <div className="mb-8">
        <Text variant="overline">
          {t("eyebrow", { matchday, date: playedOn })}
        </Text>
        <Text
          variant="h2"
          id="latest-round-title"
          className="mt-2 text-2xl md:text-3xl font-bold"
        >
          {championshipName}
        </Text>
        <Text variant="body" className="mt-1">
          {championshipDetails}
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Section title={t("resultsTitle")} action={onward(t("allResults"))}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {roundResults.map((match, index) => (
              <li
                key={match.id}
                className={cn(index >= PHONE_RESULTS && "max-sm:hidden")}
              >
                <Card
                  href={`/matches/${match.id}`}
                  padding="sm"
                  aria-label={tMatches("ariaLabelMatch", {
                    home: match.homeTeam.club.name,
                    away: match.awayTeam.club.name,
                  })}
                >
                  <Matchup
                    home={matchupSide(match.homeTeam, match.homeTeamScore)}
                    away={matchupSide(match.awayTeam, match.awayTeamScore)}
                    status={match.status}
                    size="line"
                  />
                  {match.forfeit && <ForfeitBadge className="mt-2" />}
                </Card>
              </li>
            ))}
          </ul>
        </Section>

        <LeaderboardTable
          leaderboards={leaderboard.slice(0, STANDINGS_PREVIEW_ROWS)}
          variant="summary"
          action={onward(t("fullStandings"))}
        />
      </div>
    </section>
  );
}
