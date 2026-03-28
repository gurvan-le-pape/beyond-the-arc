// src/frontend/app/[locale]/(public)/competitions/departmental/page.tsx
import { getTranslations } from "next-intl/server";

import { CommitteesGrid } from "@/features/competitions/components";
import { serverCommitteesService } from "@/features/organizations/committees/api/committees.server";
import { PageLayout } from "@/shared/components/layouts/PageLayout";
import { Breadcrumb } from "@/shared/components/navigation";

interface DepartmentalListPageProps {
  readonly params: Promise<{ readonly locale: string }>;
}

/**
 * Departmental Competitions List Page
 * Shows all departmental committees
 * Strategy: SSG with daily revalidation
 */
export default async function DepartmentalListPage({
  params,
}: DepartmentalListPageProps) {
  const { locale } = await params;
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tCompetitions = await getTranslations({
    locale,
    namespace: "competitions",
  });

  const committees = await serverCommitteesService.getAll();

  const breadcrumbItems = [
    { label: tCompetitions("breadcrumb"), href: "/competitions" },
    { label: tCompetitions("departmental.label"), current: true },
  ];

  return (
    <PageLayout>
      <Breadcrumb items={breadcrumbItems} />

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        {tCommon("sectionTitles.departmentalCommittees")}
      </h1>

      <CommitteesGrid committees={committees} />
    </PageLayout>
  );
}

export const revalidate = 86400;
