// src/frontend/app/[locale]/(public)/organizations/clubs/[clubId]/page.tsx
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import { ClubTeams } from "@/features/organizations/clubs/components";
import type { ClubTeamInfo } from "@/features/organizations/clubs/types";
import {
  OrganizationHeader,
  OrganizationInfo,
} from "@/features/organizations/components";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import type { Gender } from "@/shared/constants";
import { groupTeamsByGender } from "@/shared/utils";

interface ClubPageProps {
  readonly params: Promise<{
    locale: string;
    leagueId: string;
    committeeId: string;
    clubId: string;
  }>;
}

/**
 * Club Detail Page
 * Shows individual club information and teams
 * Path: /clubs/league/[leagueId]/committee/[committeeId]/club/[clubId]
 * Strategy: ISR with hourly revalidation
 */

// Don't pre-build - too many clubs (25,000+)
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600;

export default async function ClubPage({ params }: ClubPageProps) {
  const { clubId: clubIdStr, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "clubs" });
  const tOrganizations = await getTranslations({
    locale,
    namespace: "organizations",
  });

  const clubId = Number.parseInt(clubIdStr, 10);

  if (Number.isNaN(clubId) || clubId <= 0) {
    notFound();
  }

  const club = await serverClubsService.getById(clubId);

  const teamsByGender: Record<Gender, ClubTeamInfo[]> =
    club.teams && club.teams.length > 0
      ? groupTeamsByGender(club.teams)
      : ({} as Record<Gender, ClubTeamInfo[]>);

  const breadcrumbItems = [
    { label: tOrganizations("breadcrumb"), href: "/organizations" },
    {
      label: tOrganizations("clubs.label"),
      href: "/organizations/clubs",
    },
    { label: club?.name ?? "…", current: true },
  ];

  return (
    <PageLayout ariaLabel={t("detail.page", { clubName: club.name })}>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Organization Header */}
      <OrganizationHeader
        name={club.name}
        imageFolder="clubs"
        subtitle={[club.city, club.zipCode].filter(Boolean).join(" • ")}
      />

      {/* Organization info */}
      <OrganizationInfo
        president={club?.president}
        address={club?.address}
        email={club?.email}
        phone={club?.phone}
        city={club?.city}
        zipCode={club?.zipCode}
        website={club?.website}
      />

      {/* Club teams */}
      <ClubTeams club={club} teamsByGender={teamsByGender} />
    </PageLayout>
  );
}
