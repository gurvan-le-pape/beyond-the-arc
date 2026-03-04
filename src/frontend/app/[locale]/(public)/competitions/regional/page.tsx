// src/frontend/app/[locale]/(public)/competitions/regional/page.tsx
"use client";

import { useTranslations } from "next-intl";

import { Panel } from "@/features/competitions/components";
import { useLeagues } from "@/features/organizations/leagues/api/use-leagues";
import { Footer, Header } from "@/shared/components/layouts";
import { ErrorMessage, LoadingSpinner } from "@/shared/components/ui";
import { CompetitionLevel } from "@/shared/constants/competition-levels";

export default function RegionalListPage() {
  const t = useTranslations("common");
  const { data: leagues, isLoading, error } = useLeagues();

  // Determine what to render based on loading/error/data state
  let content: React.ReactNode;

  if (error) {
    content = (
      <ErrorMessage message="Une erreur est survenue lors du chargement des données." />
    );
  } else if (isLoading) {
    content = <LoadingSpinner />;
  } else if (leagues) {
    content = (
      <Panel
        items={leagues}
        title={t("sectionTitles.regionalLeagues")}
        imageFolder="leagues"
        basePath={`/competitions/${CompetitionLevel.REGIONAL}`}
        currentId={undefined}
        currentItemName={null}
        columns={2}
        enableSearch={true}
        list={false}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">{content}</div>
      </main>
      <Footer />
    </div>
  );
}
