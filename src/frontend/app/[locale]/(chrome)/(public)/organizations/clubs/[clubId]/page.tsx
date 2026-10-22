// src/frontend/app/[locale]/(chrome)/(public)/organizations/clubs/[clubId]/page.tsx
import { Users } from "lucide-react";
import type { Metadata } from "next";
import {
  getFormatter,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";

import { serverClubsService } from "@/features/organizations/clubs/api/clubs.server";
import { ClubTeamsTable } from "@/features/organizations/clubs/components";
import { OrganizationDetailView } from "@/features/organizations/shared/components";
import { EmptyState, withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
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
export async function generateStaticParams() {
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

  const club = await serverClubsService
    .getById(clubId)
    .catch(handleServerError);

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

  const club = await serverClubsService
    .getById(clubId)
    .catch(handleServerError);

  const format = await getFormatter({ locale });
  const championshipCount = new Set(
    club.teams.flatMap((team) =>
      team.pool ? [team.pool.championship.id] : [],
    ),
  ).size;
  const won = club.teams.reduce(
    (sum, team) => sum + (team.leaderboard?.gamesWon ?? 0),
    0,
  );
  const lost = club.teams.reduce(
    (sum, team) => sum + (team.leaderboard?.gamesLost ?? 0),
    0,
  );

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
          stats: [
            {
              value: format.number(club.teams.length),
              label: tOrganizations("header.teams", {
                count: club.teams.length,
              }),
            },
            {
              value: format.number(championshipCount),
              label: tOrganizations("header.championships", {
                count: championshipCount,
              }),
            },
            {
              value: `${format.number(won)}–${format.number(lost)}`,
              label: tOrganizations("header.record"),
            },
          ],
        }}
        info={{
          address: club.address,
          website: club.website,
          ffbbUrl: club.ffbbUrl,
        }}
      >
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
      </OrganizationDetailView>
    </PageLayout>
  );
}

export default withServerErrorState(ClubPage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
