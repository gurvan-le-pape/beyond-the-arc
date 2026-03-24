// src/frontend/app/[locale]/(public)/competitions/departmental/[committeeId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  CompetitionHeader,
  CompetitionInfo,
  CompetitionsPageSkeleton,
  SearchableChipList,
} from "@/features/competitions/components";
import ChampionshipList from "@/features/competitions/components/championships/ChampionshipList";
import { useDepartmentalChampionshipsData } from "@/features/competitions/hooks";
import { useRouter } from "@/navigation";
import { Footer, Header } from "@/shared/components/layouts";
import { Breadcrumb } from "@/shared/components/navigation";
import { ErrorMessage } from "@/shared/components/ui";
import { CompetitionLevel } from "@/shared/constants/competition-levels";
import {
  groupChampionshipsByCategory,
  groupChampionshipsByGender,
} from "@/shared/utils/grouping";

export default function DepartmentalChampionshipsPage() {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const router = useRouter();
  const params = useParams();
  const idStr = params?.committeeId as string;
  const id = Number.parseInt(idStr, 10);

  const { championships, committee, clubs, isLoading, fetchError } =
    useDepartmentalChampionshipsData(id);

  const championshipsByGender = groupChampionshipsByGender(championships);

  const breadcrumbItems = [
    { label: tCompetitions("breadcrumb"), href: "/competitions" },
    {
      label: tCompetitions("departmental.label"),
      href: `/competitions/${CompetitionLevel.DEPARTMENTAL}`,
    },
    { label: committee?.name ?? "…", current: true },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Breadcrumb items={breadcrumbItems} />

          {fetchError && <ErrorMessage message={tCommon(fetchError)} />}
          {isLoading && <CompetitionsPageSkeleton />}

          {!fetchError && !isLoading && (
            <div className="space-y-6">
              {/* Competition Header */}
              <CompetitionHeader
                name={committee?.name ?? ""}
                imageFolder="committees"
              />

              {/* Competition info */}
              <CompetitionInfo
                president={committee?.president}
                address={committee?.address}
                email={committee?.email}
                phone={committee?.phone}
              />

              {/* Clubs */}
              <SearchableChipList
                items={clubs}
                title={tCommon("sectionTitles.clubs")}
                searchPlaceholder={tCompetitions("carousel.searchPlaceholder")}
                onItemClick={(club) => router.push(`/club/${club.id}`)}
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
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
