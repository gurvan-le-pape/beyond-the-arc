// src/frontend/app/[locale]/(public)/organizations/leagues/[leagueId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import ChampionshipList from "@/features/competitions/championships/components/detail/ChampionshipList";
import { useRegionalChampionshipsData } from "@/features/competitions/championships/hooks";
import { useRouter } from "@/navigation";
import { OrganizationHeader } from "@/shared/components/domain/organizations/detail/OrganizationHeader";
import { OrganizationInfo } from "@/shared/components/domain/organizations/detail/OrganizationInfo";
import { OrganizationPageSkeleton } from "@/shared/components/domain/organizations/detail/OrganizationPageSkeleton";
import { SearchableChipList } from "@/shared/components/domain/organizations/detail/SearchableChipsList";
import { ErrorMessage } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
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
      {isLoading && <OrganizationPageSkeleton />}

      {!fetchError && !isLoading && (
        <div className="space-y-6">
          {/* Organization Header */}
          <OrganizationHeader name={league?.name ?? ""} imageFolder="leagues" />

          {/* Organization info */}
          <OrganizationInfo
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
              router.push(`/organizations/committees/${committee.id}`)
            }
            showSearch={false}
          />

          {/* Championships */}
          <ChampionshipList
            championshipsByGender={championshipsByGender}
            onItemClick={(championship) =>
              router.push(`/championships/${championship.id}`)
            }
          />
        </div>
      )}
    </PageLayout>
  );
}
