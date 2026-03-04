// src/frontend/app/[locale]/(public)/competitions/departmental/page.tsx
"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Panel } from "@/features/competitions/components";
import { committeesService } from "@/features/organizations/committees/api/committees.service";
import { Footer, Header } from "@/shared/components/layouts";
import { ErrorMessage, LoadingSpinner } from "@/shared/components/ui";
import { CompetitionLevel } from "@/shared/constants/competition-levels";

export default function DepartmentalListPage() {
  const t = useTranslations("common");

  const [committees, setCommittees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    committeesService
      .getAll()
      .then(setCommittees)
      .catch(() => {
        setError("Une erreur est survenue lors du chargement des données.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Determine what to render based on loading/error/data state
  let content: React.ReactNode;

  if (error) {
    content = <ErrorMessage message={error} />;
  } else if (isLoading) {
    content = <LoadingSpinner />;
  } else {
    content = (
      <Panel
        items={committees}
        title={t("sectionTitles.departmentalCommittees")}
        imageFolder="committees"
        basePath={`/competitions/${CompetitionLevel.DEPARTMENTAL}`}
        currentId={undefined}
        currentItemName={null}
        columns={4}
        enableSearch={true}
        list={false}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">{content}</div>
      </main>
      <Footer />
    </div>
  );
}
