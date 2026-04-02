// src/frontend/app/[locale]/(public)/organizations/committees/page.tsx
import { getTranslations } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import {
  DepartmentsGrid,
  TitleSection,
} from "@/features/organizations/clubs/components";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { ViewLevel } from "@/shared/constants";

interface ClubsCommitteesPageProps {
  readonly params: Promise<{
    locale: string;
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
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "organizations" });

  const departments = await serverClubsService.getStatsByDepartment();

  const breadcrumbItems = [
    { label: t("breadcrumb"), href: "/organizations" },
    { label: t("committees.label"), current: true },
  ];

  return (
    <PageLayout>
      <Breadcrumb items={breadcrumbItems} />

      <TitleSection
        viewLevel={ViewLevel.DEPARTMENT}
        selectedLeague={null}
        selectedCommittee={null}
      />

      <DepartmentsGrid departments={departments} leagueId={0} />
    </PageLayout>
  );
}
