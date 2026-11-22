// src/frontend/app/[locale]/(chrome)/(public)/organizations/committees/[committeeId]/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { championshipsService } from "@/features/competitions/championships/api";
import { ChampionshipGrid } from "@/features/competitions/championships/components";
import { committeesService } from "@/features/organizations/committees/api";
import { CommitteeHeader } from "@/features/organizations/committees/components";
import {
  OrganizationInfo,
  SearchableLinkList,
} from "@/features/organizations/components";
import { leaguesService } from "@/features/organizations/leagues/api";
import { withServerErrorState } from "@/shared/components/feedback";
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
 * Pre-build list for committee detail — always empty.
 *
 * The image build has no backend to enumerate committees against. But the export must stay: returning `[]` is what
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
}: LocalePageProps<{ committeeId: string }>): Promise<Metadata> {
  const routeParams = await params;
  const { locale } = routeParams;
  const committeeId = parseRouteId(routeParams.committeeId);
  const tMeta = await getTranslations({ locale, namespace: "organizations" });

  const committee = await committeesService
    .getById(committeeId)
    .catch(handleServerError);

  // The place name, as the page's heading and breadcrumb give it; the
  // federation's own name is the scraped upper-case form ("ISERE").
  const placeName = committee.department.name;

  return {
    title: placeName,
    description: tMeta("committeeMeta", { name: placeName }),
  };
}

async function CommitteePage({
  params,
}: LocalePageProps<{ committeeId: string }>) {
  const routeParams = await params;
  const { locale } = routeParams;
  const committeeId = parseRouteId(routeParams.committeeId);
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

  // All thirteen leagues rather than the one: it runs alongside the committee
  // instead of after it, and the list is the one the leagues pages cache.
  const [committee, { items: championships }, leagues] = await Promise.all([
    committeesService.getById(committeeId),
    championshipsService.getAll({
      level: CompetitionLevel.DEPARTMENTAL,
      committeeId,
      limit: 100,
    }),
    leaguesService.getAll(),
  ]).catch(handleServerError);

  const placeName = committee.department.name;

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: tOrganizations("breadcrumb"), href: "/organizations" },
          {
            label: tOrganizations("committees.label"),
            href: "/organizations/committees",
          },
          { label: placeName, current: true },
        ]}
      />
      <CommitteeHeader
        committee={committee}
        league={leagues.find((league) => league.id === committee.leagueId)}
        championshipCount={championships.length}
      />
      <OrganizationInfo
        address={committee.address}
        ffbbUrl={committee.ffbbUrl}
      />
      <SearchableLinkList
        items={committee.clubs}
        title={tCommon("sectionTitles.clubs")}
        searchPlaceholder={tCommon("searchPlaceholder")}
        basePath="/organizations/clubs"
      />
      <ChampionshipGrid
        championships={championships}
        title={tCompetitions("championshipsSectionTitle")}
        emptyMessage={tCompetitions("noChampionships")}
      />
    </PageLayout>
  );
}

export default withServerErrorState(CommitteePage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
