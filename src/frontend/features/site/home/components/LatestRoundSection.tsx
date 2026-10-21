// src/frontend/features/site/home/components/LatestRoundSection.tsx
import { useTranslations } from "next-intl";

import type { Match } from "@/features/matches/types";
import { matchupSide } from "@/features/matches/utils";
import { Section } from "@/shared/components/blocks";
import { LeaderboardTable, Matchup } from "@/shared/components/domain";
import { Card, TextLink } from "@/shared/components/primitives";
import { Text } from "@/shared/components/typography";
import type { Leaderboard } from "@/shared/types";

/** Standings rows shown before the link to the full table. */
const STANDINGS_PREVIEW_ROWS = 5;

interface LatestRoundSectionProps {
  /** The championship's one-line title, already translated. */
  readonly championshipTitle: string;
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
  championshipTitle,
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
          <Text variant="h2" id="latest-round-title" className="mt-2">
            {championshipTitle}
          </Text>
        </div>
        <TextLink href={championshipHref}>{t("cta")}</TextLink>
      </div>

      <div className="flex flex-col gap-8">
        <Section title={t("resultsTitle")}>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {matches.map((match) => (
              <li key={match.id}>
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
