// src/frontend/app/[locale]/(public)/organizations/committees/[committeeId]/page.tsx
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
import { ErrorMessage } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { CompetitionLevel } from "@/shared/constants/competition-levels";
import {
  groupChampionshipsByCategory,
  groupChampionshipsByGender,
} from "@/shared/utils/grouping";

export default function DepartmentalChampionshipsPage() {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const tOrganizations = useTranslations("organizations");
  const router = useRouter();
  const params = useParams();
  const idStr = params?.committeeId as string;
  const id = Number.parseInt(idStr, 10);

  const { championships, committee, clubs, isLoading, fetchError } =
    useDepartmentalChampionshipsData(id);

  const championshipsByGender = groupChampionshipsByGender(championships);

  const breadcrumbItems = [
    { label: tOrganizations("breadcrumb"), href: "/organizations" },
    {
      label: tOrganizations("committees.label"),
      href: "/organizations/committees",
    },
    { label: committee?.name ?? "…", current: true },
  ];

  console.log(clubs);

  return (
    <PageLayout>
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
            onItemClick={(club) =>
              router.push(`/organizations/clubs/${club.id}`)
            }
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
    </PageLayout>
  );
}
