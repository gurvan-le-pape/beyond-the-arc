// src/frontend/app/[locale]/(public)/organizations/committees/[committeeId]/page.tsx
import { Trophy } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverChampionshipsService } from "@/features/competitions/championships/api";
import { serverClubsService } from "@/features/organizations/clubs/api";
import { serverCommitteesService } from "@/features/organizations/committees/api";
import {
  OrganizationHeader,
  OrganizationInfo,
  SearchableChipList,
} from "@/features/organizations/shared/components";
import { GenderCategorizedSection } from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import { CompetitionLevel } from "@/shared/constants";

interface CommitteePageProps {
  readonly params: Promise<{ locale: string; committeeId: string }>;
}

export async function generateStaticParams() {
  try {
    const committees = await serverCommitteesService.getAll();
    return committees.map((c) => ({ committeeId: String(c.id) }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function DepartmentalChampionshipsPage({
  params,
}: CommitteePageProps) {
  const { committeeId: committeeIdStr, locale } = await params;
  setRequestLocale(locale);

  const committeeId = Number.parseInt(committeeIdStr, 10);
  if (Number.isNaN(committeeId) || committeeId <= 0) notFound();

  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tCompetitions = await getTranslations({
    locale,
    namespace: "competitions",
  });
  const tOrganizations = await getTranslations({
    locale,
    namespace: "organizations",
  });

  const [committee, { items: championships }, { items: clubs }] =
    await Promise.all([
      serverCommitteesService.getById(committeeId),
      serverChampionshipsService.getAll({
        level: CompetitionLevel.DEPARTMENTAL,
        id: committeeId,
      }),
      serverClubsService.getAll({
        level: CompetitionLevel.DEPARTMENTAL,
        committeeId,
      }),
    ]);

  if (!committee) notFound();

  const breadcrumbItems = [
    { label: tOrganizations("breadcrumb"), href: "/organizations" },
    {
      label: tOrganizations("committees.label"),
      href: "/organizations/committees",
    },
    { label: committee.name, current: true },
  ];

  return (
    <PageLayout>
      <Breadcrumb items={breadcrumbItems} />
      <div className="space-y-6">
        {/* Organization Header */}
        <OrganizationHeader name={committee.name} imageFolder="committees" />

        {/* Organization info */}
        <OrganizationInfo
          president={committee.president}
          address={committee.address}
          email={committee.email}
          phone={committee.phone}
        />

        {/* Clubs */}
        <SearchableChipList
          items={clubs}
          title={tCommon("sectionTitles.clubs")}
          searchPlaceholder={tCommon("searchPlaceholder")}
          basePath="/organizations/clubs"
        />

        {/* Championships */}
        <GenderCategorizedSection
          items={championships.map((c) => ({ type: "championship", data: c }))}
          title={tCompetitions("championshipsSectionTitle")}
          emptyState={
            <EmptyState
              icon={<Trophy className="w-16 h-16" />}
              title={tCompetitions("noChampionships")}
            />
          }
        />
      </div>
    </PageLayout>
  );
}
