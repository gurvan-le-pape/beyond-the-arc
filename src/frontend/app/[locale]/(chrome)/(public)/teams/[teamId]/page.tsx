// src/frontend/app/[locale]/(chrome)/(public)/teams/[teamId]/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { serverMatchesService } from "@/features/matches/api/matches.server";
import { transformToShotEvents } from "@/features/matches/utils";
import { TeamShotChart } from "@/features/shot-chart/components";
import { PerGameStatsPanel } from "@/features/stats/components";
import { serverTeamsService } from "@/features/teams/api/teams.server";
import {
  TeamHeader,
  TeamMatchHistoryTable,
  TeamRoster,
  TeamUpcomingMatchesTable,
} from "@/features/teams/components";
import { splitMatchHistory } from "@/features/teams/utils";
import { withServerErrorState } from "@/shared/components/feedback";
import { PageLayout } from "@/shared/components/layout";
import { Breadcrumb } from "@/shared/components/navigation";
import type { LocalePageProps } from "@/shared/types";
import {
  formatTeamName,
  handleServerError,
  parseRouteId,
  withServerErrorMetadata,
} from "@/shared/utils";

/**
 * Pre-build list for team detail — always empty.
 *
 * One page per team, across every club and division. But the export must stay: returning `[]` is what
 * opts the route into ISR, and without it `dynamicParams` and `revalidate`
 * below are inert. See docs/frontend.md, "What each route directive is for".
 */
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
// 60s because every fetch here is `ServerRevalidate.LIVE` and the lowest
// revalidate in a route sets the frequency for the whole route.
export const revalidate = 60;

async function buildMetadata({
  params,
}: LocalePageProps<{ teamId: string }>): Promise<Metadata> {
  const routeParams = await params;
  const { locale } = routeParams;
  const teamId = parseRouteId(routeParams.teamId);
  const [tCommon, tMeta] = await Promise.all([
    getTranslations({ locale, namespace: "common" }),
    getTranslations({ locale, namespace: "teams" }),
  ]);

  const team = await serverTeamsService
    .getById(teamId)
    .catch(handleServerError);

  // A team has no name of its own — the page titles it by club, and the badges
  // beside that are what distinguish one team of a club from the next.
  const name = [
    team.club.name,
    team.category,
    tCommon(`gender.${team.gender}`),
  ].join(" · ");

  return { title: name, description: tMeta("meta", { name }) };
}

async function TeamDetailPage({ params }: LocalePageProps<{ teamId: string }>) {
  const routeParams = await params;
  const { locale } = routeParams;
  const teamId = parseRouteId(routeParams.teamId);
  setRequestLocale(locale);
  const [t, tOrganizations] = await Promise.all([
    getTranslations({ locale, namespace: "teams" }),
    getTranslations({ locale, namespace: "organizations" }),
  ]);

  const [team, matchHistory, shots] = await Promise.all([
    serverTeamsService.getById(teamId),
    serverTeamsService.getMatches(teamId),
    serverMatchesService.getShotsByTeamId(teamId),
  ]).catch(handleServerError);

  const { matches, seasonStats } = matchHistory;
  const { played, upcoming } = splitMatchHistory(matches);

  return (
    <PageLayout>
      {/* A team belongs to its club, so its trail continues the club's. */}
      <Breadcrumb
        items={[
          { label: tOrganizations("breadcrumb"), href: "/organizations" },
          {
            label: tOrganizations("clubs.label"),
            href: "/organizations/clubs",
          },
          {
            label: team.club.name,
            href: `/organizations/clubs/${team.club.id}`,
          },
          {
            label: formatTeamName(team.club.name, team.number),
            current: true,
          },
        ]}
      />
      <TeamHeader team={team} />

      <PerGameStatsPanel stats={seasonStats} />

      <TeamRoster players={team.players} />

      <TeamMatchHistoryTable team={team} matches={played} maxRows={5} />

      <TeamUpcomingMatchesTable team={team} matches={upcoming} />

      <TeamShotChart
        shots={transformToShotEvents(shots)}
        title={t("teamDetail.shotchartTitle")}
        description={t("teamDetail.shotchartDescription")}
      />
    </PageLayout>
  );
}

export default withServerErrorState(TeamDetailPage);

export const generateMetadata = withServerErrorMetadata(buildMetadata);
