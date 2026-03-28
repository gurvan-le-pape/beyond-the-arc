// src/frontend/app/[locale]/(public)/clubs/league/[leagueId]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import {
  DepartmentsGrid,
  MapViewButton,
  TitleSection,
} from "@/features/organizations/clubs/components";
import { getBreadcrumbItems } from "@/features/organizations/clubs/utils";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
import { Footer, Header } from "@/shared/components/layouts";
import { PageLayout } from "@/shared/components/layouts/PageLayout";
import { Breadcrumb } from "@/shared/components/navigation";
import { ViewLevel } from "@/shared/constants";
import { handleServerError } from "@/shared/utils/handleServerError";

interface ClubsCommitteesPageProps {
  readonly params: Promise<{
    locale: string;
    leagueId: string;
  }>;
}

/**
 * Clubs Committees Page (Departments List)
 * Shows ~10 committees per league
 * Path: /clubs/league/[leagueId]
 * Strategy: ISR with hourly revalidation
 */

// Don't pre-build - generate on first visit
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600; // 1 hour

export default async function ClubsCommitteesPage({
  params,
}: ClubsCommitteesPageProps) {
  const { leagueId: leagueIdStr, locale } = await params;

  const t = await getTranslations({ locale, namespace: "clubs" });

  const leagueId = Number.parseInt(leagueIdStr, 10);

  if (Number.isNaN(leagueId) || leagueId <= 0) {
    notFound();
  }

  const [league, departments] = await Promise.all([
    serverLeaguesService.getById(leagueId),
    serverClubsService.getStatsByDepartment(leagueId),
  ]).catch(handleServerError);

  const breadcrumbItems = getBreadcrumbItems(
    { league },
    { france: t("france") },
  );

  return (
    <PageLayout>
      <MapViewButton label={t("mapView")} />

      <Breadcrumb items={breadcrumbItems} />

      <TitleSection
        viewLevel={ViewLevel.DEPARTMENT}
        selectedLeague={league}
        selectedCommittee={null}
      />

      <DepartmentsGrid departments={departments} leagueId={league.id} />
    </PageLayout>
  );
}
