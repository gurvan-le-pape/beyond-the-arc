// src/frontend/app/[locale]/(public)/organizations/committees/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

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

export const revalidate = 86400;
// Prevent build-time rendering, but allow ISR at runtime
export const dynamic = "force-dynamic";

/**
 * Clubs Committees Page
 * Shows all departmental committees
 * Strategy: ISR with 24-hour revalidation
 */
export default async function ClubsCommitteesPage({
  params,
}: ClubsCommitteesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
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

      <DepartmentsGrid departments={departments} />
    </PageLayout>
  );
}
