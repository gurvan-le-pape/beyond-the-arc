// src/frontend/app/[locale]/(public)/organizations/leagues/[leagueId]/page.tsx
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
import { ErrorMessage } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { CompetitionLevel } from "@/shared/constants/competition-levels";
import { groupBy } from "@/shared/utils";

export default function RegionalChampionshipsPage() {
  const tCommon = useTranslations("common");
  const tCompetitions = useTranslations("competitions");
  const tOrganizations = useTranslations("organizations");
  const router = useRouter();
  const params = useParams();
  const idStr = params?.leagueId as string;
  const id = Number.parseInt(idStr, 10);

  const { championships, league, committees, isLoading, fetchError } =
    useRegionalChampionshipsData(id);

  const championshipsByGender = groupBy(championships, (c) => c.gender);

  const breadcrumbItems = [
    { label: tOrganizations("breadcrumb"), href: "/organizations" },
    {
      label: tOrganizations("leagues.label"),
      href: "/organizations/leagues",
    },
    { label: league?.name ?? "…", current: true },
  ];

  return (
    <PageLayout>
      <Breadcrumb items={breadcrumbItems} />

      {fetchError && <ErrorMessage message={tCommon(fetchError)} />}
      {isLoading && <CompetitionsPageSkeleton />}

      {!fetchError && !isLoading && (
        <div className="space-y-6">
          {/* Competition Header */}
          <CompetitionHeader name={league?.name ?? ""} imageFolder="leagues" />

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
            onItemClick={(championship) =>
              router.push(
                `/competitions/${CompetitionLevel.REGIONAL}/${id}/${championship.id}`,
              )
            }
          />
        </div>
      )}
    </PageLayout>
  );
}
