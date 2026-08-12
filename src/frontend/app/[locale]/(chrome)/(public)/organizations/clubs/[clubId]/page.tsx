// src/frontend/app/[locale]/(chrome)/(public)/organizations/clubs/[clubId]/page.tsx
import { Users } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api/clubs.server";
import { OrganizationDetailView } from "@/features/organizations/shared/components";
import { EmptyState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError, parseRouteId } from "@/shared/utils";

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

export async function generateMetadata({
  params,
}: LocalePageProps<{ clubId: string }>): Promise<Metadata> {
  const { clubId: clubIdStr, locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "clubs" });

  const club = await serverClubsService
    .getById(parseRouteId(clubIdStr))
    .catch(handleServerError);

  return {
    title: club.name,
    description: tMeta("detail.meta", { name: club.name }),
  };
}

export default async function ClubPage({
  params,
}: LocalePageProps<{ clubId: string }>) {
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
    <PageLayout>
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
          // The bullet is punctuation, not content — joining it into the
          // string would have a screen reader read "Saint-Etienne, bullet,
          // 42000".
          subtitle: (
            <>
              {club.city}
              {club.city && club.zipCode && <span aria-hidden="true"> • </span>}
              {club.zipCode}
            </>
          ),
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
