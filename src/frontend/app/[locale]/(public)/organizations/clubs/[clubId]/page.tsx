// src/frontend/app/[locale]/(public)/organizations/clubs/[clubId]/page.tsx
import { Users } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import {
  OrganizationHeader,
  OrganizationInfo,
} from "@/features/organizations/shared/components";
import { GenderCategorizedSection } from "@/shared/components/domain";
import { EmptyState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";

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
      <GenderCategorizedSection
        items={club.teams.map((t) => ({
          type: "team",
          data: t,
          clubName: club.name,
        }))}
        title={t("detail.teamsTitle")}
        emptyState={
          <EmptyState
            icon={<Users className="w-16 h-16" />}
            title={t("noTeams")}
          />
        }
      />
    </PageLayout>
  );
}
