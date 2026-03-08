// src/frontend/app/[locale]/(public)/competitions/departmental/page.tsx
import { getTranslations } from "next-intl/server";

import { CommitteesGrid } from "@/features/competitions/components";
import { serverCommitteesService } from "@/features/organizations/committees/api/committees.server";
import { Footer, Header } from "@/shared/components/layouts";

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
  const t = await getTranslations({ locale, namespace: "common" });

  const committees = await serverCommitteesService.getAll().catch((error) => {
    console.error("Error fetching committees:", error);
    return [];
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("sectionTitles.departmentalCommittees")}
          </h1>

          <CommitteesGrid committees={committees} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Revalidate once per day (committees rarely change)
export const revalidate = 86400;
