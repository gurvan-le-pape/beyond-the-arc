// src/frontend/app/[locale]/(chrome)/(public)/organizations/leagues/[leagueId]/page.tsx
import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { championshipsService } from "@/features/competitions/championships/api";
import { ChampionshipGrid } from "@/features/competitions/championships/components";
import { committeesService } from "@/features/organizations/committees/api";
import {
  OrganizationInfo,
  SearchableLinkList,
} from "@/features/organizations/components";
import { leaguesService } from "@/features/organizations/leagues/api";
import { LeagueHeader } from "@/features/organizations/leagues/components";
import { EmptyState, withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { CompetitionLevel } from "@/shared/constants";
import type { LocalePageProps } from "@/shared/types";
import {
  handleServerError,
  parseRouteId,
  withServerErrorMetadata,
} from "@/shared/utils";

/**
 * Pre-build list for league detail — always empty.
 *
 * The image build has no backend to enumerate leagues against. But the export must stay: returning `[]` is what
 * opts the route into ISR, and without it `dynamicParams` and `revalidate`
 * below are inert. See docs/frontend.md, "What each route directive is for".
 */
export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600;

async function buildMetadata({
  params,
}: LocalePageProps<{ leagueId: string }>): Promise<Metadata> {
  const routeParams = await params;
  const { locale } = routeParams;
  const leagueId = parseRouteId(routeParams.leagueId);
  const tMeta = await getTranslations({ locale, namespace: "organizations" });

  const league = await leaguesService
    .getById(leagueId)
    .catch(handleServerError);

  // The place name, as the page's heading and breadcrumb give it; the
  // federation's own name is the scraped upper-case form ("ISERE").
  const placeName = league.region.name;

  return {
    title: placeName,
    description: tMeta("leagueMeta", { name: placeName }),
  };
}

async function LeaguePage({ params }: LocalePageProps<{ leagueId: string }>) {
  const routeParams = await params;
  const { locale } = routeParams;
  const leagueId = parseRouteId(routeParams.leagueId);
  setRequestLocale(locale);

  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tCompetitions = await getTranslations({
    locale,
    namespace: "competitions",
  });
  const tOrganizations = await getTranslations({
    locale,
    namespace: "organizations",
  });

  const [league, { items: championships }, committees] = await Promise.all([
    leaguesService.getById(leagueId),
    championshipsService.getAll({
      level: CompetitionLevel.REGIONAL,
      leagueId,
      limit: 100,
    }),
    committeesService.getAll({ leagueId }),
  ]).catch(handleServerError);

  const placeName = league.region.name;

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: tOrganizations("breadcrumb"), href: "/organizations" },
          {
            label: tOrganizations("leagues.label"),
            href: "/organizations/leagues",
          },
          { label: placeName, current: true },
        ]}
      />
      <LeagueHeader
        league={league}
        committeeCount={committees.length}
        championshipCount={championships.length}
      />
      <OrganizationInfo address={league.address} ffbbUrl={league.ffbbUrl} />
      <SearchableLinkList
        items={committees}
        title={tCommon("sectionTitles.departmentalCommittees")}
        searchPlaceholder={tCommon("searchPlaceholder")}
        basePath="/organizations/committees"
        showSearch={false}
      />
      {championships.length > 0 ? (
        <ChampionshipGrid
          championships={championships}
          title={tCompetitions("championshipsSectionTitle")}
          emptyMessage={tCompetitions("noChampionships")}
        />
      ) : (
        <EmptyState
          icon={<Trophy className="w-16 h-16" />}
          title={tCompetitions("noChampionships")}
        />
      )}
    </PageLayout>
  );
}

export default withServerErrorState(LeaguePage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
