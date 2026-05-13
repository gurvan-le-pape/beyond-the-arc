// src/frontend/app/[locale]/(public)/organizations/committees/[committeeId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { ChampionshipList } from "@/features/competitions/championships/components";
import { useDepartmentalChampionshipsData } from "@/features/competitions/championships/hooks";
import { useRouter } from "@/navigation";
import { OrganizationHeader, OrganizationInfo, OrganizationPageSkeleton, SearchableChipList } from "@/shared/components/domain";
import { ErrorMessage } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { groupBy } from "@/shared/utils";

export default function DepartmentalChampionshipsPage() {
  const tCommon = useTranslations("common");
  const tOrganizations = useTranslations("organizations");
  const router = useRouter();
  const params = useParams();
  const idStr = params?.committeeId as string;
  const id = Number.parseInt(idStr, 10);

  const { championships, committee, clubs, isLoading, fetchError } =
    useDepartmentalChampionshipsData(id);

  const championshipsByGender = groupBy(championships, (c) => c.gender);

  const breadcrumbItems = [
    { label: tOrganizations("breadcrumb"), href: "/organizations" },
    {
      label: tOrganizations("committees.label"),
      href: "/organizations/committees",
    },
    { label: committee?.name ?? "…", current: true },
  ];

  return (
    <PageLayout>
      <Breadcrumb items={breadcrumbItems} />

      {fetchError && <ErrorMessage message={tCommon(fetchError)} />}
      {isLoading && <OrganizationPageSkeleton />}

      {!fetchError && !isLoading && (
        <div className="space-y-6">
          {/* Organization Header */}
          <OrganizationHeader
            name={committee?.name ?? ""}
            imageFolder="committees"
          />

          {/* Organization info */}
          <OrganizationInfo
            president={committee?.president}
            address={committee?.address}
            email={committee?.email}
            phone={committee?.phone}
          />

          {/* Clubs */}
          <SearchableChipList
            items={clubs}
            title={tCommon("sectionTitles.clubs")}
            searchPlaceholder={tCommon("searchPlaceholder")}
            onItemClick={(club) =>
              router.push(`/organizations/clubs/${club.id}`)
            }
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
