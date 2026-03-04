// src/frontend/app/[locale]/(public)/competitions/departmental/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { HorizontalCarousel } from "@/features/competitions/components";
import { CompetitionsPageSkeleton } from "@/features/competitions/components";
import ChampionshipList from "@/features/competitions/components/championships/ChampionshipList";
import { useDepartmentalChampionshipsData } from "@/features/competitions/hooks";
import { useRouter } from "@/navigation";
import { Footer, Header } from "@/shared/components/layouts";
import { ErrorMessage } from "@/shared/components/ui";
import { CompetitionLevel } from "@/shared/constants/competition-levels";
import {
  groupChampionshipsByCategory,
  groupChampionshipsByGender,
} from "@/shared/utils/grouping";

export default function DepartmentalChampionshipsPage() {
  const tCommon = useTranslations("common");
  const router = useRouter();
  const params = useParams();
  const idStr = params?.id as string;
  const id = Number.parseInt(idStr, 10);

  const { championships, committee, committees, clubs, isLoading, error } =
    useDepartmentalChampionshipsData(id);

  const championshipsByGender = groupChampionshipsByGender(championships);

  // ---------------------------------------------------------------------------
  // Body
  // ---------------------------------------------------------------------------

  let body: React.ReactNode;

  if (error) {
    body = <ErrorMessage message={error.message} />;
  } else if (isLoading) {
    body = <CompetitionsPageSkeleton />;
  } else {
    body = (
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Committee header strip */}
        {committee && (
          <div className="flex items-center border-l-4 border-l-primary-600 dark:border-l-primary-400 bg-white dark:bg-gray-800 rounded-card border border-gray-200 dark:border-gray-700 shadow-card dark:shadow-card-dark px-6 py-4">
            <h1 className="text-subtitle md:text-title font-bold text-gray-900 dark:text-gray-100">
              {committee.name}
            </h1>
          </div>
        )}

        {/* Committees carousel – wrapped in a card band */}
        <HorizontalCarousel
          items={committees}
          title={tCommon("sectionTitles.departmentalCommittees")}
          imageFolder="committees"
          basePath={`/competitions/${CompetitionLevel.DEPARTMENTAL}`}
          currentId={id}
          enableSearch={true}
          enableLetterFilter={true}
        />

        {/* Clubs carousel – same card band */}
        <HorizontalCarousel
          items={clubs}
          title={tCommon("sectionTitles.clubs")}
          imageFolder="clubs"
          basePath="/club"
          enableSearch={true}
          enableLetterFilter={true}
        />

        {/* Championships */}
        <ChampionshipList
          championshipsByGender={championshipsByGender}
          groupChampionshipsByCategory={groupChampionshipsByCategory}
          onItemClick={(championship) =>
            router.push(
              `/competitions/${CompetitionLevel.DEPARTMENTAL}/${id}/${championship.id}`,
            )
          }
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Layout shell
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">{body}</main>
      <Footer />
    </div>
  );
}
