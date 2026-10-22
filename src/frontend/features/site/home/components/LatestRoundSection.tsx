// src/frontend/features/site/home/components/LatestRoundSection.tsx
import { useTranslations } from "next-intl";

import type { Match } from "@/features/matches/types";
import { matchupSide } from "@/features/matches/utils";
import { Section } from "@/shared/components/blocks";
import { LeaderboardTable, Matchup } from "@/shared/components/domain";
import { Card, TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import type { Leaderboard } from "@/shared/types";
import { cn } from "@/shared/utils";

/** Standings rows shown before the link to the full table. */
const STANDINGS_PREVIEW_ROWS = 5;

/**
 * Results shown on a phone, where the cards stack one per row; wider screens
 * lay out the whole round in two or three columns.
 */
const PHONE_RESULTS = 3;

interface LatestRoundSectionProps {
  /** Who runs the championship: its committee or league, already formatted. */
  readonly championshipName: string;
  /** Category, gender, division and season, already translated and joined. */
  readonly championshipDetails: string;
  readonly championshipHref: string;
  readonly matchday: number;
  /** The pool's matches on `matchday`, in the order to show them. */
  readonly matches: Match[];
  readonly leaderboard: Leaderboard[];
}

/**
 * The home page's live band: one pool's latest matchday results beside its
 * standings, so the page shows the data and not only counts of it. The
 * standings stop at the top of the table; the rest is a link away.
 *
 * Which pool is the caller's decision — the backend's `/pools/recent` order —
 * and this only lays it out. A server component: nothing here is interactive.
 */
export function LatestRoundSection({
  championshipName,
  championshipDetails,
  championshipHref,
  matchday,
  matches,
  leaderboard,
}: LatestRoundSectionProps) {
  const t = useTranslations("home.latestRound");
  const tMatches = useTranslations("matches");

  return (
    <section
      aria-labelledby="latest-round-title"
      className="px-6 py-10 border-b border-divide"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 mb-6">
        <div className="min-w-0">
          <Text variant="overline">{t("eyebrow", { matchday })}</Text>
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
        <TextLink href={championshipHref}>{t("cta")}</TextLink>
      </div>

      <div className="flex flex-col gap-8">
        <Section title={t("resultsTitle")}>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {matches.map((match, index) => (
              <li
                key={match.id}
                className={cn(index >= PHONE_RESULTS && "max-sm:hidden")}
              >
                <Card padding="sm">
                  <Matchup
                    home={matchupSide(match.homeTeam, match.homeTeamScore)}
                    away={matchupSide(match.awayTeam, match.awayTeamScore)}
                    size="row"
                    linked
                    belowScore={
                      <span className="text-sm">
                        <TextLink href={`/matches/${match.id}`}>
                          {tMatches("summary")}
                        </TextLink>
                      </span>
                    }
                  />
                </Card>
              </li>
            ))}
          </ul>
          {matches.length > PHONE_RESULTS && (
            <span className="mt-3 block text-sm sm:hidden">
              <TextLink href={championshipHref}>
                {t("allResults", { count: matches.length })}
              </TextLink>
            </span>
          )}
        </Section>

        <div className="flex flex-col gap-3">
          <LeaderboardTable
            leaderboards={leaderboard.slice(0, STANDINGS_PREVIEW_ROWS)}
          />
          {leaderboard.length > STANDINGS_PREVIEW_ROWS && (
            <span className="text-sm">
              <TextLink href={championshipHref}>
                {t("fullStandings", { count: leaderboard.length })}
              </TextLink>
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
