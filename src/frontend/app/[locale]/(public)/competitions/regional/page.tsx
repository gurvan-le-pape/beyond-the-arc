// src/frontend/app/[locale]/(public)/competitions/regional/page.tsx
import { getTranslations } from "next-intl/server";

import { LeaguesGrid } from "@/features/competitions/components";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";

interface RegionalListPageProps {
  readonly params: Promise<{ readonly locale: string }>;
}

/**
 * Regional Competitions List Page
 * Shows all regional leagues
 * Strategy: SSG with daily revalidation
 */
export default async function RegionalListPage({
  params,
}: RegionalListPageProps) {
  const { locale } = await params;
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tCompetitions = await getTranslations({
    locale,
    namespace: "competitions",
  });

  const leagues = await serverLeaguesService.getAll();

  const breadcrumbItems = [
    { label: tCompetitions("breadcrumb"), href: "/competitions" },
    { label: tCompetitions("regional.label"), current: true },
  ];

  return (
    <PageLayout>
      <Breadcrumb items={breadcrumbItems} />

      <h1 className="text-2xl font-bold text-text-heading dark:text-text-heading-dark">
        {tCommon("sectionTitles.regionalLeagues")}
      </h1>

      <LeaguesGrid leagues={leagues} />
    </PageLayout>
  );
}

export const revalidate = 86400;
