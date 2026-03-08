// src/frontend/app/[locale]/(public)/competitions/regional/page.tsx
import { getTranslations } from "next-intl/server";

import { LeaguesGrid } from "@/features/competitions/components";
import { serverLeaguesService } from "@/features/organizations/leagues/api/leagues.server";
import { Footer, Header } from "@/shared/components/layouts";

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
  const t = await getTranslations({ locale, namespace: "common" });

  const leagues = await serverLeaguesService.getAll().catch((error) => {
    console.error("Error fetching leagues:", error);
    return [];
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("sectionTitles.regionalLeagues")}
          </h1>

          <LeaguesGrid leagues={leagues} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Revalidate once per day (leagues rarely change)
export const revalidate = 86400;
