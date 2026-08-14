// src/frontend/app/[locale]/(chrome)/(public)/teams/[teamId]/page.tsx
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { TeamShotChart } from "@/features/charts/components";
import { serverMatchesService } from "@/features/matches/api/matches.server";
import { serverTeamsService } from "@/features/teams/api/teams.server";
import {
  TeamHeader,
  TeamMatchHistoryTable,
  TeamRoster,
} from "@/features/teams/components";
import { PerGameStatsPanel } from "@/shared/components/domain";
import { PageLayout } from "@/shared/components/layout";
import type { LocalePageProps } from "@/shared/types";
import { handleServerError, parseRouteId } from "@/shared/utils";

// Don't pre-build - one page per team, across every club and division
export async function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({
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

export default async function TeamDetailPage({
  params,
}: LocalePageProps<{ teamId: string }>) {
  const routeParams = await params;
  const { locale } = routeParams;
  const teamId = parseRouteId(routeParams.teamId);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "teams" });

  const [team, matchHistory, matchEvents] = await Promise.all([
    serverTeamsService.getById(teamId),
    serverTeamsService.getMatches(teamId),
    serverMatchesService.getEventsByTeamId(teamId),
  ]).catch(handleServerError);

  const { matches, seasonStats } = matchHistory;

  return (
    <PageLayout>
      {/* Team Header */}
      <TeamHeader team={team} />

      {/* Team Stats */}
      <PerGameStatsPanel stats={seasonStats} />

      {/* Roster */}
      <TeamRoster players={team.players} />

      {/* Match History */}
      <TeamMatchHistoryTable team={team} matches={matches} maxRows={5} />

      {/* Team Shot Chart Heatmap */}
      <TeamShotChart
        matchEvents={matchEvents}
        title={t("teamDetail.shotchartTitle")}
        description={t("teamDetail.shotchartDescription")}
        isLoading={false}
        error={null}
      />
    </PageLayout>
  );
}
