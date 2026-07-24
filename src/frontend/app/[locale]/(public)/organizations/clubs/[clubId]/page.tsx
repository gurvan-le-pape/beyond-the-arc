// src/frontend/app/[locale]/(public)/organizations/clubs/[clubId]/page.tsx
import { Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api";
import { OrganizationDetailView } from "@/features/organizations/shared/components";
import { EmptyState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { handleServerError, parseRouteId } from "@/shared/utils";

interface ClubPageProps {
  readonly params: Promise<{
    locale: string;
    clubId: string;
  }>;
}

/**
 * Club Detail Page
 * Shows individual club information and teams
 * Path: /organizations/clubs/[clubId]
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

  const clubId = parseRouteId(clubIdStr);

  const club = await serverClubsService
    .getById(clubId)
    .catch(handleServerError);

  return (
    <PageLayout ariaLabel={t("detail.page", { clubName: club.name })}>
      <OrganizationDetailView
        breadcrumb={[
          { label: tOrganizations("breadcrumb"), href: "/organizations" },
          {
            label: tOrganizations("clubs.label"),
            href: "/organizations/clubs",
          },
          { label: club.name, current: true },
        ]}
        header={{
          name: club.name,
          imageFolder: "clubs",
          subtitle: [club.city, club.zipCode].filter(Boolean).join(" • "),
        }}
        info={{
          president: club.president,
          address: club.address,
          email: club.email,
          phone: club.phone,
          city: club.city,
          zipCode: club.zipCode,
          website: club.website,
        }}
        section={{
          items: club.teams.map((team) => ({
            type: "team",
            data: team,
            clubName: club.name,
          })),
          title: t("detail.teamsTitle"),
          emptyState: (
            <EmptyState
              icon={<Users className="w-16 h-16" />}
              title={t("noTeams")}
            />
          ),
        }}
      />
    </PageLayout>
  );
}
