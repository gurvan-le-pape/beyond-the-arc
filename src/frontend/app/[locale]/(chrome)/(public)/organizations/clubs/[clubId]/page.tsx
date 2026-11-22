// src/frontend/app/[locale]/(chrome)/(public)/organizations/clubs/[clubId]/page.tsx
import { Users } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { clubsService } from "@/features/organizations/clubs/api";
import {
  ClubHeader,
  ClubTeamsTable,
} from "@/features/organizations/clubs/components";
import { committeesService } from "@/features/organizations/committees/api";
import { OrganizationInfo } from "@/features/organizations/components";
import { EmptyState, withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import type { LocalePageProps } from "@/shared/types";
import {
  handleServerError,
  parseRouteId,
  withServerErrorMetadata,
} from "@/shared/utils";

/**
 * Pre-build list for club detail — always empty.
 *
 * Too many clubs (25,000+). But the export must stay: returning `[]` is what
 * opts the route into ISR, and without it `dynamicParams` and `revalidate`
 * below are inert. See docs/frontend.md, "What each route directive is for".
 */
export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600;

async function buildMetadata({
  params,
}: LocalePageProps<{ clubId: string }>): Promise<Metadata> {
  const routeParams = await params;
  const { locale } = routeParams;
  const clubId = parseRouteId(routeParams.clubId);
  const tMeta = await getTranslations({ locale, namespace: "clubs" });

  const club = await clubsService.getById(clubId).catch(handleServerError);

  return {
    title: club.name,
    description: tMeta("detail.meta", { name: club.name }),
  };
}

async function ClubPage({ params }: LocalePageProps<{ clubId: string }>) {
  const routeParams = await params;
  const { locale } = routeParams;
  const clubId = parseRouteId(routeParams.clubId);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "clubs" });
  const tOrganizations = await getTranslations({
    locale,
    namespace: "organizations",
  });

  // Every committee rather than the club's one: it runs alongside the club
  // instead of after it, and the list is the one the committees pages cache.
  const [club, committees] = await Promise.all([
    clubsService.getById(clubId),
    committeesService.getAll(),
  ]).catch(handleServerError);

  return (
    <PageLayout>
      <Breadcrumb
        items={[
          { label: tOrganizations("breadcrumb"), href: "/organizations" },
          {
            label: tOrganizations("clubs.label"),
            href: "/organizations/clubs",
          },
          { label: club.name, current: true },
        ]}
      />
      <ClubHeader
        club={club}
        committee={committees.find(
          (committee) => committee.id === club.committeeId,
        )}
      />
      <OrganizationInfo address={club.address} ffbbUrl={club.ffbbUrl} />
      {club.teams.length > 0 ? (
        <ClubTeamsTable
          clubName={club.name}
          teams={club.teams}
          title={t("detail.teamsTitle")}
          emptyMessage={t("noTeams")}
        />
      ) : (
        <EmptyState
          icon={<Users className="w-16 h-16" />}
          title={t("noTeams")}
        />
      )}
    </PageLayout>
  );
}

export default withServerErrorState(ClubPage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
