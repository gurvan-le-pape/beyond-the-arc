// src/frontend/app/[locale]/(chrome)/(public)/organizations/leagues/[leagueId]/page.tsx
import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api/championships.server";
import { ChampionshipGrid } from "@/features/competitions/championships/components";
import { serverCommitteesService } from "@/features/organizations/committees/api/committees.server";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
import { OrganizationDetailView } from "@/features/organizations/shared/components";
import { namesMatch } from "@/features/organizations/utils";
import { EmptyState, withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { CompetitionLevel } from "@/shared/constants";
import type { LocalePageProps } from "@/shared/types";
import {
  formatLeagueName,
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
export async function generateStaticParams() {
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

  const league = await serverLeaguesService
    .getById(leagueId)
    .catch(handleServerError);

  return {
    title: league.name,
    description: tMeta("leagueMeta", { name: league.name }),
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
    serverLeaguesService.getById(leagueId),
    serverChampionshipsService.getAll({
      level: CompetitionLevel.REGIONAL,
      leagueId,
      limit: 100,
    }),
    serverCommitteesService.getAll({ leagueId }),
  ]).catch(handleServerError);

  const format = await getFormatter({ locale });
  const placeName = league.region.name;
  const officialName = formatLeagueName(league.name);

  return (
    <PageLayout>
      <OrganizationDetailView
        breadcrumb={[
          { label: tOrganizations("breadcrumb"), href: "/organizations" },
          {
            label: tOrganizations("leagues.label"),
            href: "/organizations/leagues",
          },
          { label: placeName, current: true },
        ]}
        header={{
          name: placeName,
          logoName: league.name,
          imageFolder: "leagues",
          subtitle: [
            tOrganizations("header.leagueKind"),
            league.region.code,
            namesMatch(officialName, placeName) ? null : officialName,
          ]
            .filter(Boolean)
            .join(" · "),
          stats: [
            {
              value: format.number(committees.length),
              label: tOrganizations("header.committees", {
                count: committees.length,
              }),
            },
            {
              value: format.number(league.clubCount),
              label: tOrganizations("header.clubs", {
                count: league.clubCount,
              }),
            },
            {
              value: format.number(championships.length),
              label: tOrganizations("header.championships", {
                count: championships.length,
              }),
            },
          ],
        }}
        info={{
          address: league.address,
          ffbbUrl: league.ffbbUrl,
        }}
        chipList={{
          items: committees,
          title: tCommon("sectionTitles.departmentalCommittees"),
          searchPlaceholder: tCommon("searchPlaceholder"),
          basePath: "/organizations/committees",
          showSearch: false,
        }}
      >
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
      </OrganizationDetailView>
    </PageLayout>
  );
}

export default withServerErrorState(LeaguePage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
