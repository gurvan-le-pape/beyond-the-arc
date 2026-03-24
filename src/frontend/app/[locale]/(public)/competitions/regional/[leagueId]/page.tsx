// src/frontend/app/[locale]/(public)/competitions/regional/[leagueId]/page.tsx
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
import { useRegionalChampionshipsData } from "@/features/competitions/hooks/useRegionalChampionships";
import { useRouter } from "@/navigation";
import { Footer, Header } from "@/shared/components/layouts";
import { Breadcrumb } from "@/shared/components/navigation";
import { ErrorMessage } from "@/shared/components/ui";
import { CompetitionLevel } from "@/shared/constants/competition-levels";
import {
  groupChampionshipsByCategory,
  groupChampionshipsByGender,
} from "@/shared/utils/grouping";

export default function RegionalChampionshipsPage() {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const router = useRouter();
  const params = useParams();
  const idStr = params?.leagueId as string;
  const id = Number.parseInt(idStr, 10);

  const { championships, league, committees, isLoading, fetchError } =
    useRegionalChampionshipsData(id);

  const championshipsByGender = groupChampionshipsByGender(championships);

  const breadcrumbItems = [
    { label: tCompetitions("breadcrumb"), href: "/competitions" },
    {
      label: tCompetitions("regional.label"),
      href: `/competitions/${CompetitionLevel.REGIONAL}`,
    },
    { label: league?.name ?? "…", current: true },
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
                name={league?.name ?? ""}
                imageFolder="leagues"
              />

              {/* Competition info */}
              <CompetitionInfo
                president={league?.president}
                address={league?.address}
                email={league?.email}
                phone={league?.phone}
              />

              {/* Committees */}
              <SearchableChipList
                items={committees}
                title={tCompetitions("regional.committeesInLeague")}
                searchPlaceholder={tCompetitions("carousel.searchPlaceholder")}
                onItemClick={(committee) =>
                  router.push(
                    `/competitions/${CompetitionLevel.DEPARTMENTAL}/${committee.id}`,
                  )
                }
                showSearch={false}
              />

              {/* Championships */}
              <ChampionshipList
                championshipsByGender={championshipsByGender}
                groupChampionshipsByCategory={groupChampionshipsByCategory}
                onItemClick={(championship) =>
                  router.push(
                    `/competitions/${CompetitionLevel.REGIONAL}/${id}/${championship.id}`,
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
