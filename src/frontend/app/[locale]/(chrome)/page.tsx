// src/frontend/app/[locale]/(chrome)/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api/championships.server";
import { buildChampionshipTitle } from "@/features/competitions/championships/utils";
import { serverLeaderboardsService } from "@/features/competitions/leaderboards/api/leaderboards.server";
import { serverPoolsService } from "@/features/competitions/pools/api/pools.server";
import { serverMatchesService } from "@/features/matches/api/matches.server";
import {
  ExploreCard,
  LatestRoundSection,
  LevelRow,
} from "@/features/site/home/components";
import {
  EXPLORE_CARDS,
  LEVEL_ROWS,
  STATS_BAND_KEYS,
} from "@/features/site/home/constants";
import { serverStatsService } from "@/features/stats/api/stats.server";
import { Link } from "@/navigation";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { buttonVariants } from "@/shared/components/primitives";
import { StatCell } from "@/shared/components/stats";
import { Text } from "@/shared/components/typography";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError } from "@/shared/utils";

// Rendered per request: the image build has no backend to fetch stats from.
//
// This is also one of two *server* pages that never call setRequestLocale —
// the other is (fullscreen)/map/page.tsx, which says so in its own comment.
// Both fall back to next-intl reading headers(), and both declare
// force-dynamic, so neither enters the prerender pass and neither can break
// the build when the locale layout adopts setRequestLocale.
//
// Two more pages skip it for reasons that do not bear on that: docs/page.tsx
// is 'use client' and could not call a server API, and [...rest]/page.tsx
// only calls notFound(). Recorded here because this comment is the record —
// a reader auditing "which pages skip setRequestLocale" should find four,
// two of which are the ones this invariant is about.
export const dynamic = "force-dynamic";

/**
 * Metadata for the home page.
 *
 * Next calls this separately from the page, so a fetch failure here is not caught by the page's own error handling — hence the `withServerErrorMetadata` wrapper where one fetches.
 */
export async function generateMetadata({
  params,
}: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "home" });

  // Absolute: the home page is the site, so it does not want the
  // "· Beyond The Arc" suffix every other route inherits.
  return {
    title: {
      absolute: tMeta("hero.metaTitle"),
    },
    description: tMeta("hero.subtitle"),
  };
}

async function Home({ params }: LocalePageProps) {
  const { locale } = await params;
  const [t, tCommon, tCompetitions] = await Promise.all([
    getTranslations({ locale, namespace: "home" }),
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "competitions" }),
  ]);

  const [stats, [featuredPool]] = await Promise.all([
    serverStatsService.getStats(),
    serverPoolsService.getRecent(),
  ]).catch(handleServerError);

  // The latest round band: the backend ranks the pools that played most
  // recently, and the first is the one featured. None yet (season start) means
  // no band, not an error.
  const latestRound = featuredPool
    ? await Promise.all([
        serverChampionshipsService.getById(featuredPool.championshipId),
        serverLeaderboardsService.getAll({ poolId: featuredPool.id }),
        serverMatchesService.getByPoolId(featuredPool.id),
      ])
        .then(([championship, leaderboard, poolMatches]) => ({
          championshipTitle: buildChampionshipTitle(championship, {
            gender: tCommon(`gender.${championship.gender}`),
            division: tCompetitions("divisionWithValue", {
              value: championship.division,
            }),
          }),
          championshipHref: `/championships/${championship.id}?pool=${featuredPool.id}`,
          matchday: featuredPool.matchday,
          // The round may still be mid-simulation: show what has a score.
          matches: poolMatches.filter(
            (match) =>
              match.matchday === featuredPool.matchday &&
              match.homeTeamScore !== null &&
              match.awayTeamScore !== null,
          ),
          leaderboard,
        }))
        .catch(handleServerError)
    : null;

  const formatCount = (n: number): string => n.toLocaleString(locale);

  const statsBand = STATS_BAND_KEYS.map((key) => ({
    value: formatCount(stats[key]),
    label: t(`stats.${key}`),
  }));

  const exploreCards = EXPLORE_CARDS.map((card) => ({
    href: card.href,
    badgeVariant: card.badgeVariant,
    badge: t(`explore.${card.key}.badge`),
    title: t(`explore.${card.key}.title`),
    desc: t(`explore.${card.key}.desc`),
  }));

  // A level with no championships yet is listed last and not linked — there is
  // nothing behind the link. The sort is stable, so covered levels keep their
  // LEVEL_ROWS order and an uncovered one moves back once it has data.
  const levelCards = LEVEL_ROWS.map((row) => {
    const championshipCount = stats.championshipsByLevel[row.level];
    return {
      dot: row.dot,
      name: t(`levels.${row.level}.name`),
      detail: t(`levels.${row.level}.detail`),
      // One message, three counts — ICU picks the plural form, and the key is
      // named once rather than at each call site.
      count: t("levels.championshipCount", { count: championshipCount }),
      href:
        championshipCount > 0 ? `/championships?tab=${row.level}` : undefined,
    };
  }).sort((a, b) => Number(!a.href) - Number(!b.href));

  return (
    <PageLayout edgeToEdge>
      <section className="flex flex-col items-center text-center px-6 py-16 border-b border-divide">
        <Text
          variant="overline"
          className="inline-flex items-center gap-1.5 text-ink-primary bg-tint-primary px-3 py-1 rounded mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-solid-primary" />
          {t("hero.eyebrow")}
        </Text>

        <Text
          variant="h1"
          className="font-extrabold leading-none tracking-tight mb-5"
        >
          {t("hero.titleStart")}{" "}
          <em className="not-italic text-ink-primary">
            {t("hero.titleEmphasis")}
          </em>
        </Text>

        <Text variant="lead" className="max-w-lg">
          {t("hero.subtitle")}
        </Text>
      </section>

      {/* Every cell draws its right and bottom rule, pulled 1px outward and
          clipped by the container, so the outer edges carry none — whatever
          the column count at this breakpoint. */}
      <div className="grid grid-cols-3 md:grid-cols-6 border-b border-divide overflow-hidden">
        {statsBand.map((s) => (
          <div
            key={s.label}
            className="border-r border-b border-divide -mr-px -mb-px"
          >
            <StatCell value={s.value} label={s.label} />
          </div>
        ))}
      </div>

      {latestRound && <LatestRoundSection {...latestRound} />}

      <div className="px-6 pt-7 pb-2 border-b border-divide">
        <Text variant="overline" as="h2">
          {t("explore.sectionTitle")}
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 border-b border-divide divide-y md:divide-y-0 md:divide-x divide-divide">
        {exploreCards.map((card) => (
          <ExploreCard key={card.href} {...card} />
        ))}
      </div>

      <div className="border-b border-divide px-8 py-16 flex flex-col items-center text-center">
        <Text variant="overline" className="text-ink-clubs">
          {t("map.eyebrow")}
        </Text>
        <Text variant="h2" className="mt-3 max-w-sm">
          {t("map.title")}
        </Text>
        <Text variant="caption" className="max-w-sm mt-2">
          {t("map.desc")}
        </Text>
        <Link
          href="/map"
          className={buttonVariants({ variant: "clubs", size: "sm" }) + " mt-5"}
        >
          {t("map.cta")}
        </Link>
      </div>

      <div className="px-6 pt-7 pb-2">
        <Text variant="overline" as="h2">
          {t("levels.sectionTitle")}
        </Text>
      </div>

      <div className="flex flex-col gap-2 px-6 pb-10">
        {levelCards.map((level) => (
          <LevelRow key={level.name} {...level} />
        ))}
      </div>
    </PageLayout>
  );
}

export default withServerErrorState(Home);
