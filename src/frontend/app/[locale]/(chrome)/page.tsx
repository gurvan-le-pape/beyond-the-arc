// src/frontend/app/[locale]/(chrome)/page.tsx
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api/championships.server";
import { serverLeaderboardsService } from "@/features/competitions/leaderboards/api/leaderboards.server";
import { serverPoolsService } from "@/features/competitions/pools/api/pools.server";
import { matchesService } from "@/features/matches/api";
import {
  ExploreSection,
  HomeHero,
  LatestRoundSection,
  LevelsSection,
  MapBand,
  StatsBand,
} from "@/features/site/home/components";
import { serverStatsService } from "@/features/stats/api/stats.server";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
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

async function Home() {
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
        matchesService.getByPoolId(featuredPool.id),
      ])
        .then(([championship, leaderboard, matches]) => ({
          championship,
          pool: featuredPool,
          matches,
          leaderboard,
        }))
        .catch(handleServerError)
    : null;

  return (
    <PageLayout edgeToEdge>
      <HomeHero />
      <StatsBand stats={stats} />
      {latestRound && <LatestRoundSection {...latestRound} />}
      <ExploreSection />
      <MapBand />
      <LevelsSection championshipsByLevel={stats.championshipsByLevel} />
    </PageLayout>
  );
}

export default withServerErrorState(Home);
