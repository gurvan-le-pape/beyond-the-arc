// src/frontend/app/[locale]/(public)/competitions/regional/page.tsx
import { getTranslations } from "next-intl/server";

import { LeaguesGrid } from "@/features/competitions/components";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
import { Footer, Header } from "@/shared/components/layouts";
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
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb items={breadcrumbItems} />

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {tCommon("sectionTitles.regionalLeagues")}
          </h1>

          <LeaguesGrid leagues={leagues} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const revalidate = 86400;
