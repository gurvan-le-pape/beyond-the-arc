// src/frontend/app/[locale]/(chrome)/(public)/organizations/committees/[committeeId]/page.tsx
import { Trophy } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api/championships.server";
import { ChampionshipGrid } from "@/features/competitions/championships/components";
import { serverClubsService } from "@/features/organizations/clubs/api/clubs.server";
import { serverCommitteesService } from "@/features/organizations/committees/api/committees.server";
import { CommitteeHeader } from "@/features/organizations/committees/components";
import {
  OrganizationInfo,
  SearchableLinkList,
} from "@/features/organizations/shared/components";
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
 * Pre-build list for committee detail — always empty.
 *
 * The image build has no backend to enumerate committees against. But the export must stay: returning `[]` is what
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
}: LocalePageProps<{ committeeId: string }>): Promise<Metadata> {
  const routeParams = await params;
  const { locale } = routeParams;
  const committeeId = parseRouteId(routeParams.committeeId);
  const tMeta = await getTranslations({ locale, namespace: "organizations" });

  const committee = await serverCommitteesService
    .getById(committeeId)
    .catch(handleServerError);

  return {
    title: committee.name,
    description: tMeta("committeeMeta", { name: committee.name }),
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

  const [committee, { items: championships }, { items: clubs }] =
    await Promise.all([
      serverCommitteesService.getById(committeeId),
      serverChampionshipsService.getAll({
        level: CompetitionLevel.DEPARTMENTAL,
        committeeId,
        limit: 100,
      }),
      serverClubsService.getAll({
        level: CompetitionLevel.DEPARTMENTAL,
        committeeId,
      }),
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
        championshipCount={championships.length}
      />
      <OrganizationInfo
        address={committee.address}
        ffbbUrl={committee.ffbbUrl}
      />
      <SearchableLinkList
        items={clubs}
        title={tCommon("sectionTitles.clubs")}
        searchPlaceholder={tCommon("searchPlaceholder")}
        basePath="/organizations/clubs"
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

export default withServerErrorState(CommitteePage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
