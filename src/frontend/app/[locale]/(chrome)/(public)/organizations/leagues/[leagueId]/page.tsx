// src/frontend/app/[locale]/(chrome)/(public)/organizations/leagues/[leagueId]/page.tsx
import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api/championships.server";
import { serverCommitteesService } from "@/features/organizations/committees/api/committees.server";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
import { OrganizationDetailView } from "@/features/organizations/shared/components";
import { EmptyState, withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
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

  return (
    <PageLayout>
      <OrganizationDetailView
        breadcrumb={[
          { label: tOrganizations("breadcrumb"), href: "/organizations" },
          {
            label: tOrganizations("leagues.label"),
            href: "/organizations/leagues",
          },
          { label: league.name, current: true },
        ]}
        header={{ name: league.name, imageFolder: "leagues" }}
        info={{
          president: league.president,
          address: league.address,
          email: league.email,
          phone: league.phone,
        }}
        chipList={{
          items: committees,
          title: tCommon("sectionTitles.departmentalCommittees"),
          searchPlaceholder: tCommon("searchPlaceholder"),
          basePath: "/organizations/committees",
          showSearch: false,
        }}
        section={{
          items: championships.map((c) => ({ type: "championship", data: c })),
          title: tCompetitions("championshipsSectionTitle"),
          emptyState: (
            <EmptyState
              icon={<Trophy className="w-16 h-16" />}
              title={tCompetitions("noChampionships")}
            />
          ),
        }}
      />
    </PageLayout>
  );
}

export default withServerErrorState(LeaguePage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
